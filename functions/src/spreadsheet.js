/*!
 * sri sri guru gaurangau jayatah
 */

import { google } from 'googleapis';

/** @enum {string} */
const IValueInputOption = {
  USER_ENTERED: 'USER_ENTERED',
  RAW: 'RAW',
};

/**
 * Converts undefined to null and null to empty string.
 *
 * @param {unknown} value Value to encode.
 * @returns {unknown}
 */
const encodeSheetsValue = (value) =>
  value === undefined ? null : value === null ? '' : value;

/**
 * Convert empty string to null.
 *
 * @param {unknown} value Value from Sheets API to decode.
 * @returns {unknown}
 */
const decodeSheetsValue = (value) => (value === '' ? null : value ?? null);

/**
 * @template T
 * @param {Iterable<T>} xs Sequence.
 * @param {(x: T) => boolean} fn Predicate.
 * @returns {Generator<T, void, unknown>}
 */
function* takeWhile(xs, fn) {
  for (const x of xs)
    if (fn(x)) yield x;
    else break;
}

/** @template T */
export class Spreadsheet {
  /** @type {string[]} */
  columnNames;

  /**
   * @template T
   * @param {string} spreadsheetId
   * @param {string} sheetName
   * @returns {Promise<Spreadsheet<T>>}
   */
  static async open(spreadsheetId, sheetName) {
    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const api = google.sheets({ version: 'v4', auth });
    const schema = this.#getResponse(
      await api.spreadsheets.get({
        spreadsheetId: spreadsheetId,
        includeGridData: true,
        ranges: [this.toA1Notation(sheetName, undefined, 1, undefined, 1)],
      })
    );
    if (!schema.sheets) throw new Error('Invalid API response.');

    const sheet = schema.sheets.find((s) => s.properties?.title === sheetName);
    if (!sheet) throw new Error(`No "${sheetName}" sheet in the spreadsheet.`);

    return new Spreadsheet(api, spreadsheetId, sheet);
  }

  #api;
  #spreadsheetId;
  #sheet;

  /**
   * @param {import('googleapis').sheets_v4.Sheets} api
   * @param {string} spreadsheetId
   * @param {import('googleapis').sheets_v4.Schema$Sheet} sheet
   */
  constructor(api, spreadsheetId, sheet) {
    this.#api = api;
    this.#spreadsheetId = spreadsheetId;
    this.#sheet = sheet;
    const headers = this.#sheet.data?.[0].rowData?.[0].values?.map(
      (cell) => cell.effectiveValue?.stringValue || ''
    );

    if (!headers) throw new Error('Incorrect API response.');

    this.columnNames = [...takeWhile(headers, (value) => !!value)];
  }

  /**
   * @template R
   * @param {import('gaxios').GaxiosResponse<R>} response
   * @returns {R}
   */
  static #getResponse(response) {
    const { statusText, status, data } = response;
    if (statusText !== 'OK' || status !== 200)
      throw new Error(
        `Got ${status} (${statusText}) from ${response.config.url}.`
      );

    return data;
  }

  /**
   * Constructs an A1 notation of the range. For example: 'Sheet 1'!A3:D5.
   *
   * @param {string} sheetName
   * @param {string} [firstColumnLetter] First column letter, optional.
   * @param {number} [firstRowNumber] First row number, optional.
   * @param {string} [lastColumnLetter] Last column letter, optional.
   * @param {number} [lastRowNumber] Last row number, optional.
   * @returns {string}
   */
  static toA1Notation(
    sheetName,
    firstColumnLetter,
    firstRowNumber,
    lastColumnLetter,
    lastRowNumber
  ) {
    return (
      sheetName +
      '!' +
      (firstColumnLetter || '') +
      (firstRowNumber?.toString() || '') +
      /// Second part can be absent altogether
      (lastColumnLetter || lastRowNumber
        ? ':' + (lastColumnLetter || '') + (lastRowNumber?.toString() || '')
        : '')
    );
  }

  /**
   * @param {string} firstColumnLetter
   * @param {number} firstRowNumber
   * @param {string} [lastColumnLetter]
   * @param {number} [lastRowNumber]
   * @returns {string}
   */
  #toA1Notation(
    firstColumnLetter,
    firstRowNumber,
    lastColumnLetter,
    lastRowNumber
  ) {
    return Spreadsheet.toA1Notation(
      this.title,
      firstColumnLetter,
      firstRowNumber,
      lastColumnLetter,
      lastRowNumber
    );
  }

  /**
   * Returns A1 notation for a row span. For example: A1:H5. Columns within
   * header are included only.
   *
   * @param {number} firstRowNumber First row number.
   * @param {number} [lastRowNumber] Last row number.
   * @returns {string}
   */
  #rowsToA1Notation(firstRowNumber, lastRowNumber) {
    return this.#toA1Notation(
      this.#getColumnLetter(this.columnNames[0]),
      firstRowNumber,
      this.#getColumnLetter(this.columnNames[this.columnNames.length - 1]),
      lastRowNumber
    );
  }

  /**
   * Returns A1 notation for the row. For example: A1:H1. Columns within header
   * are included only.
   *
   * @param {number} rowNumber Row number on the sheet.
   * @returns {string}
   */
  #rowToA1Notation(rowNumber) {
    return this.#rowsToA1Notation(rowNumber, rowNumber);
  }

  /**
   * Returns A1 notation for the column. For example: A2:A. Only data is
   * included, without header.
   *
   * @param {string} columnName
   * @returns {string}
   */
  #columnToA1Notation(columnName) {
    const columnLetter = this.#getColumnLetter(columnName);
    return this.#toA1Notation(
      columnLetter,
      this.#fromDataRowNumber(1),
      columnLetter
    );
  }

  /**
   * @param {string} columnName
   * @returns {string}
   */
  #getColumnLetter(columnName) {
    let index = this.columnNames.indexOf(columnName);
    if (index < 0) {
      throw Error(`Column ${columnName} not found`);
    }

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let encoded = '';
    while (index >= 0) {
      encoded = alphabet[index % alphabet.length] + encoded;
      index = Math.floor(index / alphabet.length) - 1;
    }
    return encoded;
  }

  /**
   * Converts data row number into the sheet row number.
   *
   * @param {number} dataRowNumber Number of the row in the data section,
   *   1-based.
   * @returns {number}
   */
  #fromDataRowNumber(dataRowNumber) {
    return dataRowNumber + Math.max(this.frozenRowCount, 1);
  }

  /**
   * Returns the title of the sheet.
   *
   * @returns {string}
   */
  get title() {
    return this.#sheet.properties?.title ?? '';
  }

  /**
   * Returns count of the frozen rows in the sheet.
   *
   * @returns {number}
   */
  get frozenRowCount() {
    return this.#sheet.properties?.gridProperties?.frozenRowCount || 0;
  }

  /**
   * Returns count of the total rows in the sheet.
   *
   * @returns {number}
   */
  get rowCount() {
    return this.#sheet.properties?.gridProperties?.rowCount || 0;
  }

  /**
   * Gets values using Google Sheets API.
   *
   * @param {string} range Range to get values for.
   * @param {'COLUMNS' | 'ROWS'} majorDimension Columns or Rows.
   * @returns {Promise<unknown[][]>}
   */
  async #getValues(range, majorDimension = 'ROWS') {
    return (
      Spreadsheet.#getResponse(
        await this.#api.spreadsheets.values.get({
          spreadsheetId: this.#spreadsheetId,
          majorDimension,
          dateTimeRenderOption: 'SERIAL_NUMBER',
          valueRenderOption: 'UNFORMATTED_VALUE',
          range,
        })
      ).values || [[]]
    );
  }

  /**
   * Transforms the values array into an object.
   *
   * - Empty string in the array transforms into `null` in the object.
   *
   * @param {unknown[]} values The values array to be transformed into an
   *   object.
   * @returns {T}
   */
  #arrayToObject(values) {
    /* According to https://developers.google.com/sheets/api/samples/reading#read_a_single_range_grouped_by_column,
     * “Empty trailing rows and columns are omitted.”
     * Thus, the values array may be shorter than columnNames, which produces `undefined`.
     * That is why we coalesce the undefined values to null after zipping.
     */

    return this.columnNames.reduce(
      (accumulator, columnName, i) => ({
        ...accumulator,
        [columnName]: decodeSheetsValue(values[i]),
      }),
      /** @type {T} */ ({})
    );
  }

  /**
   * Transforms the object into a values array.
   * https://developers.google.com/sheets/api/guides/values says,> When
   * updating, values with no data are skipped. To clear data, use an empty> String ("").
   *
   * - `undefined` in the object transforms into `null` in the array.
   * - `null` in the object transforms into empty string in the array.
   *
   * @param {T} object Source object to be transformed into an array.
   * @returns {unknown[]}
   */
  objectToArray(object) {
    return this.columnNames.map((columnName) =>
      encodeSheetsValue(object[/** @type {keyof T} */ (columnName)])
    );
  }

  /**
   * Gets row at specified row number.
   *
   * @param {number} dataRowNumber Number of the row in the data section,
   *   1-based.
   * @returns {Promise<T>}
   */
  async getRow(dataRowNumber) {
    const values = await this.#getValues(
      this.#rowToA1Notation(this.#fromDataRowNumber(dataRowNumber))
    );
    return this.#arrayToObject(values[0]);
  }

  /**
   * Gets all the rows on the sheet.
   *
   * @returns {Promise<T[]>}
   */
  async getRows() {
    const values = await this.#getValues(
      this.#rowsToA1Notation(this.#fromDataRowNumber(1), this.rowCount)
    );

    return values
      .filter((rowValues) => rowValues.length > 0)
      .map((rowValues) => this.#arrayToObject(rowValues));
  }

  /**
   * Updates row at specified row number.
   *
   * @param {number} dataRowNumber Number of the row in the data section,
   *   1-based.
   * @param {T} object Object to be saved into the row Nulls are skipped. To
   *   clear data, use an empty string ("") in the property value.
   */
  async updateRow(dataRowNumber, object) {
    Spreadsheet.#getResponse(
      await this.#api.spreadsheets.values.update({
        spreadsheetId: this.#spreadsheetId,
        range: this.#rowToA1Notation(this.#fromDataRowNumber(dataRowNumber)),
        valueInputOption: IValueInputOption.RAW,
        requestBody: {
          values: [this.objectToArray(object)],
        },
      })
    );
  }

  /**
   * Update rows at specified row numbers.
   *
   * @param {Map<number, T>} objects Map of objects by data row number.
   */
  async updateRows(objects) {
    if (objects.size === 0) return;
    Spreadsheet.#getResponse(
      await this.#api.spreadsheets.values.batchUpdate({
        spreadsheetId: this.#spreadsheetId,
        requestBody: {
          valueInputOption: IValueInputOption.RAW,
          data: Array.from(objects, ([dataRowNumber, object]) => ({
            range: this.#rowToA1Notation(
              this.#fromDataRowNumber(dataRowNumber)
            ),
            values: [this.objectToArray(object)],
          })),
        },
      })
    );
  }

  /**
   * Appends new rows.
   *
   * @param {T[]} objects Data values to add to Google Sheets.
   */
  async appendRows(objects) {
    Spreadsheet.#getResponse(
      await this.#api.spreadsheets.values.append({
        spreadsheetId: this.#spreadsheetId,
        range: this.title,
        valueInputOption: IValueInputOption.RAW,
        requestBody: {
          values: objects.map((object) => this.objectToArray(object)),
        },
      })
    );
  }
}
