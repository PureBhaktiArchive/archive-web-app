/*!
 * sri sri guru gaurangau jayatah
 */

import { google } from 'googleapis';

export async function getAllRows<T>(
  spreadsheetId: string,
  sheetName: string
): Promise<T[]> {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const api = google.sheets({ version: 'v4', auth });

  const { statusText, status, data } = await api.spreadsheets.values.get({
    spreadsheetId,
    dateTimeRenderOption: 'SERIAL_NUMBER',
    valueRenderOption: 'UNFORMATTED_VALUE',
    range: sheetName,
  });

  if (statusText !== 'OK' || status !== 200)
    throw new Error(`Got ${status} (${statusText}) from Google Sheets API.`);

  if (!data.values || data.values.length < 2) return [];

  const columnNames = data.values.shift() || [];

  const coalesce = (value: unknown) => (value === '' ? null : value);

  return data.values.map((rowValues) =>
    // Zipping data with the column names to produce objects
    columnNames.reduce((acc, key, idx) => {
      /* According to https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values,
       * “empty trailing rows and columns will not be included.”
       * Thus, the values array may be shorter than columnNames, which results in `value` being `undefined`.
       * That is why we coalesce the undefined values to `null`.
       *
       * Empty string in the API response represents empty cell, thus replacing it with `null` also.
       */
      acc[key] = coalesce(rowValues[idx] ?? null);
      return acc;
    }, {})
  );
}
