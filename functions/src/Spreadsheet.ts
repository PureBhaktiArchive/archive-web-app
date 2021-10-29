/*!
 * sri sri guru gaurangau jayatah
 */

import { GaxiosResponse } from 'gaxios';
import { google, sheets_v4 as sheets } from 'googleapis';

enum IValueInputOption {
  USER_ENTERED = 'USER_ENTERED',
  RAW = 'RAW',
}

const encodeSheetsValue = (value: unknown): unknown =>
  value === undefined ? null : value === null ? '' : value;

const decodeSheetsValue = (value: unknown): unknown =>
  value === '' ? null : value ?? null;

export class Spreadsheet<T> {
  public columnNames: string[];

  public static async open<T>(
    spreadsheetId: string,
    sheetName: string
  ): Promise<Spreadsheet<T>> {
    const auth = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const api = google.sheets({ version: 'v4', auth });
    const schema = this.getResponse(
      await api.spreadsheets.get({
        spreadsheetId: spreadsheetId,
        includeGridData: true,
        ranges: [this.toA1Notation(sheetName, undefined, 1, undefined, 1)],
      })
    );
    if (!schema.sheets) throw new Error('Invalid API response.');

    const sheet = schema.sheets.find((s) => s.properties?.title === sheetName);
    if (!sheet) throw new Error(`No "${sheetName}" sheet in the spreadsheet.`);

    return new Spreadsheet<T>(api, spreadsheetId, sheet);
  }

  protected constructor(
    private api: sheets.Sheets,
    private spreadsheetId: string,
    private sheet: sheets.Schema$Sheet
  ) {
    const headers = this.sheet.data?.[0].rowData?.[0].values?.map(
      (cell) => cell.effectiveValue?.stringValue || ''
    );

    if (!headers) throw new Error('Incorrect API response.');

    this.columnNames = headers.slice(
      0,
      headers.findIndex((value) => !value) - 1
    );
  }

  protected static getResponse<T>(response: GaxiosResponse<T>): T {
    const { statusText, status, data } = response;
    if (statusText !== 'OK' || status !== 200)
      throw new Error(
        `Got ${status} (${statusText}) from ${response.config.url}.`
      );

    return data;
  }

  /**
   * Constructs an A1 notation of the range. For example: 'Sheet 1'!A3:D5.
   * @param firstColumnLetter First column letter, optional
   * @param firstRowNumber First row number, optional
   * @param lastColumnLetter Last column letter, optional
   * @param lastRowNumber Last row number, optional
   */
  public static toA1Notation(
    sheetName: string,
    firstColumnLetter?: string,
    firstRowNumber?: number,
    lastColumnLetter?: string,
    lastRowNumber?: number
  ): string {
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

  protected toA1Notation(
    firstColumnLetter: string,
    firstRowNumber: number,
    lastColumnLetter?: string,
    lastRowNumber?: number
  ): string {
    return Spreadsheet.toA1Notation(
      this.title,
      firstColumnLetter,
      firstRowNumber,
      lastColumnLetter,
      lastRowNumber
    );
  }

  /**
   * Returns A1 notation for a row span. For example: A1:H5.
   * Columns within header are included only.
   * @param firstRowNumber First row number
   * @param lastRowNumber Last row number
   */
  protected rowsToA1Notation(
    firstRowNumber: number,
    lastRowNumber?: number
  ): string {
    return this.toA1Notation(
      this.getColumnLetter(this.columnNames[0]),
      firstRowNumber,
      this.getColumnLetter(this.columnNames[this.columnNames.length - 1]),
      lastRowNumber
    );
  }

  /**
   * Returns A1 notation for the row. For example: A1:H1.
   * Columns within header are included only.
   * @param rowNumber Row number on the sheet
   */
  protected rowToA1Notation(rowNumber: number): string {
    return this.rowsToA1Notation(rowNumber, rowNumber);
  }

  /**
   * Returns A1 notation for the column. For example: A2:A.
   * Only data is included, without header.
   * @param rowNumber Row number on the sheet
   */
  protected columnToA1Notation(columnName: string): string {
    const columnLetter = this.getColumnLetter(columnName);
    return this.toA1Notation(
      columnLetter,
      this.fromDataRowNumber(1),
      columnLetter
    );
  }

  protected getColumnLetter(columnName: string): string {
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
   * @param dataRowNumber Number of the row in the data section, 1-based
   */
  protected fromDataRowNumber(dataRowNumber: number): number {
    return dataRowNumber + Math.max(this.frozenRowCount, 1);
  }

  /**
   * Returns the title of the sheet
   */
  public get title(): string {
    return this.sheet.properties?.title ?? '';
  }

  /**
   * Returns count of the frozen rows in the sheet
   */
  public get frozenRowCount(): number {
    return this.sheet.properties?.gridProperties?.frozenRowCount || 0;
  }

  /**
   * Returns count of the total rows in the sheet
   */
  public get rowCount(): number {
    return this.sheet.properties?.gridProperties?.rowCount || 0;
  }

  /**
   * Gets values using Google Sheets API
   * @param range range to get values for
   * @param majorDimension Columns or Rows
   */
  protected async getValues(
    range: string,
    majorDimension: 'COLUMNS' | 'ROWS' = 'ROWS'
  ): Promise<unknown[][]> {
    return (
      Spreadsheet.getResponse(
        await this.api.spreadsheets.values.get({
          spreadsheetId: this.spreadsheetId,
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
   * - Empty string in the array transforms into `null` in the object.
   * @param values The values array to be transformed into an object
   */
  protected arrayToObject(values: unknown[]): T {
    /* According to https://developers.google.com/sheets/api/samples/reading#read_a_single_range_grouped_by_column,
     * “Empty trailing rows and columns are omitted.”
     * Thus, the values array may be shorter than columnNames, which produces `undefined`.
     * That is why we coalesce the undefined values to null after zipping.
     */
    return this.columnNames.reduce(
      (prev, prop, i) =>
        Object.assign(prev, { [prop]: decodeSheetsValue(values[i]) }),
      {}
    ) as T;
  }

  /**
   * Transforms the object into a values array.
   * https://developers.google.com/sheets/api/guides/values says,
   * “When updating, values with no data are skipped. To clear data, use an empty string ("").”
   * - `undefined` in the object transforms into `null` in the array.
   * - `null` in the object transforms into empty string in the array.
   * @param object Source object to be transformed into an array
   */
  protected objectToArray(object: T): unknown[] {
    return this.columnNames.map((columnName) =>
      encodeSheetsValue(object[columnName as keyof T])
    );
  }

  /**
   * Gets row at specified row number
   * @param dataRowNumber Number of the row in the data section, 1-based
   */
  public async getRow(dataRowNumber: number): Promise<T> {
    const values = await this.getValues(
      this.rowToA1Notation(this.fromDataRowNumber(dataRowNumber))
    );
    return this.arrayToObject(values[0]);
  }

  /**
   * Gets all the rows on the sheet.
   */
  public async getRows(): Promise<T[]> {
    const values = await this.getValues(
      this.rowsToA1Notation(this.fromDataRowNumber(1), this.rowCount)
    );

    return values
      .filter((rowValues) => rowValues.length > 0)
      .map((rowValues) => this.arrayToObject(rowValues));
  }

  /**
   * Updates row at specified row number
   * @param dataRowNumber Number of the row in the data section, 1-based
   * @param object Object to be saved into the row
   * Nulls are skipped. To clear data, use an empty string ("") in the property value.
   */
  public async updateRow(dataRowNumber: number, object: T): Promise<void> {
    Spreadsheet.getResponse(
      await this.api.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: this.rowToA1Notation(this.fromDataRowNumber(dataRowNumber)),
        valueInputOption: IValueInputOption.RAW,
        requestBody: {
          values: [this.objectToArray(object)],
        },
      })
    );
  }

  /**
   * Update rows at specified row numbers.
   * @param objects Map of objects by data row number
   */
  public async updateRows(objects: Map<number, T>): Promise<void> {
    if (objects.size === 0) return;

    Spreadsheet.getResponse(
      await this.api.spreadsheets.values.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          valueInputOption: IValueInputOption.RAW,
          data: Array.from(objects, ([dataRowNumber, object]) => ({
            range: this.rowToA1Notation(this.fromDataRowNumber(dataRowNumber)),
            values: [this.objectToArray(object)],
          })),
        },
      })
    );
  }

  /**
   * Appends new rows
   * @param objects Data values to add to Google Sheets
   */
  public async appendRows(objects: T[]): Promise<void> {
    Spreadsheet.getResponse(
      await this.api.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: this.title,
        valueInputOption: IValueInputOption.RAW,
        requestBody: {
          values: objects.map((object) => this.objectToArray(object)),
        },
      })
    );
  }
}
