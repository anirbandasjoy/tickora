import ExcelJS from 'exceljs';
import { Parser } from 'json2csv';
import { Response } from 'express';

export const streamExport = async (
  res: Response,
  filename: string,
  format: 'csv' | 'xlsx',
  rows: Record<string, unknown>[],
  columns: string[]
) => {
  const flat = rows.map((r) => {
    const o: Record<string, unknown> = {};
    for (const c of columns) {
      const v = c
        .split('.')
        .reduce<unknown>((acc: unknown, k: string) => (acc as Record<string, unknown>)?.[k], r);
      o[c] = typeof v === 'object' && v !== null ? JSON.stringify(v) : (v ?? '');
    }
    return o;
  });
  if (format === 'csv') {
    const parser = new Parser({ fields: columns });
    const csv = parser.parse(flat);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
    res.send(csv);
    return;
  }
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('data');
  ws.columns = columns.map((c) => ({ header: c, key: c, width: 22 }));
  ws.addRows(flat);
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
  await wb.xlsx.write(res);
  res.end();
};
