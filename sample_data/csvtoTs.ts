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
const columnTypes: Record<string, 'int' | 'string' | 'date' | 'enum'> = {};
const enumTypes: Record<string, string> = {}; // enumのカラム名とenum型名のマッピング
const columnNames = headers.map(h => {
  const match = h.match(/^(.*?)(?::(int|date|enum)(?:\((.*?)\))?)?$/);
  if (match) {
    const name = match[1];
    const type = match[2] === 'int' ? 'int' :
                match[2] === 'date' ? 'date' :
                match[2] === 'enum' ? 'enum' : 'string';
    columnTypes[name] = type;
    
    // enum型の場合、enum名を保存（指定がなければカラム名から生成）
    if (type === 'enum') {
      // カラム名から型名を生成（先頭を大文字に）
      const enumName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
      enumTypes[name] = enumName;
    }
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
    } else if (columnTypes[key] === 'date') {
      newRow[key] = row[key]; // 文字列のまま保持し、TS出力時にnew Dateで出力
    } else if (columnTypes[key] === 'enum') {
      newRow[key] = row[key]; // 文字列のまま保持
    } else {
      newRow[key] = row[key];
    }
  }
  return newRow;
});

// 変数名をCSVファイル名から自動生成
const varName = path.basename(csvPath, path.extname(csvPath));

// オブジェクトをTypeScriptのリテラル形式で出力する関数
function toTsLiteral(obj: any): string {
  const props = Object.entries(obj).map(([k, v]) => {
    if (columnTypes[k] === 'date') {
      return `  ${k}: new Date('${v}'),`;
    } else if (columnTypes[k] === 'enum') {
      return `  ${k}: ${enumTypes[k]}.${v},`; // enum値はenum型名.値の形式で出力
    } else if (typeof v === 'string') {
      return `  ${k}: '${v}',`;
    } else {
      return `  ${k}: ${v},`;
    }
  });
  return `{
${props.join('\n')}
}`;
}

// 使用されているenum型の定義を生成
function generateEnumDefinitions(): string {
  const enumDefs: string[] = [];
  
  for (const [columnName, enumName] of Object.entries(enumTypes)) {
    // 使用されているenum値を収集
    const enumValues = new Set<string>();
    for (const record of converted) {
      if (record[columnName]) {
        enumValues.add(record[columnName]);
      }
    }
    
    if (enumValues.size > 0) {
      const enumValuesStr = Array.from(enumValues)
        .map(value => `  ${value} = '${value}'`)
        .join(',\n');
      
      enumDefs.push(`export enum ${enumName} {\n${enumValuesStr}\n}`);
    }
  }
  
  return enumDefs.join('\n\n') + (enumDefs.length > 0 ? '\n\n' : '');
}

const enumDefinitions = generateEnumDefinitions();
const tsArray = `${enumDefinitions}export const ${varName} = [
${converted.map(toTsLiteral).join(',\n')}
] as const;\n`;

fs.writeFileSync(tsPath, tsArray, 'utf-8');

console.log(`tsファイル を生成しました: ${tsPath}`);
