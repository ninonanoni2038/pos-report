import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// コマンドライン引数からパスを取得
const [,, csvPathArg, tsPathArg] = process.argv;

if (!csvPathArg || !tsPathArg) {
  console.error('使い方: ts-node csvtoTs.ts <input.csv> <output.ts>');
  process.exit(1);
}

const csvPath = path.resolve(csvPathArg);
const tsPath = path.resolve(tsPathArg);

// CSVを読み込む
const csvData = fs.readFileSync(csvPath, 'utf-8');
const lines = csvData.split(/\r?\n/);
const headerLine = lines[0];
const headers = headerLine.split(',');

// 型ヒントを抽出
const columnTypes: Record<string, 'int' | 'string'> = {};
const columnNames = headers.map(h => {
  const match = h.match(/^(.*?)(?::(int))?$/);
  if (match) {
    const name = match[1];
    const type = match[2] === 'int' ? 'int' : 'string';
    columnTypes[name] = type;
    return name;
  }
  return h;
});

// パース
const records = parse(csvData, {
  columns: (header: string[]) => columnNames,
  skip_empty_lines: true,
});

// 型変換
const converted = records.map((row: any) => {
  const newRow: any = {};
  for (const key of Object.keys(row)) {
    if (columnTypes[key] === 'int') {
      newRow[key] = row[key] === '' ? null : Number(row[key]);
    } else {
      newRow[key] = row[key];
    }
  }
  return newRow;
});

// オブジェクトをTypeScriptのリテラル形式で出力する関数
function toTsLiteral(obj: any): string {
  const props = Object.entries(obj).map(([k, v]) => {
    if (typeof v === 'string') {
      return `  ${k}: '${v}',`;
    } else {
      return `  ${k}: ${v},`;
    }
  });
  return `{
${props.join('\n')}
}`;
}

const tsArray = `export const products = [
${converted.map(toTsLiteral).join(',\n')}
] as const;\n`;

fs.writeFileSync(tsPath, tsArray, 'utf-8');

console.log(`tsファイル を生成しました: ${tsPath}`);
