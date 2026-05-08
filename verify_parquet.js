const fs = require('fs');
const path = require('path');
const parquet = require('parquetjs-lite');

// JS-скрипт для проверки созданного Parquet-файла.
const parquetPath = path.resolve(__dirname, 'parquet-output', 'extracted_orders.parquet');

async function main() {
  if (!fs.existsSync(parquetPath)) {
    console.error('Файл не найден:', parquetPath);
    process.exit(1);
  }

  const reader = await parquet.ParquetReader.openFile(parquetPath);
  const cursor = reader.getCursor();
  const records = [];

  let record = null;
  while ((record = await cursor.next())) {
    records.push(record);
  }

  await reader.close();

  const normalize = value => {
    if (typeof value === 'bigint') {
      const numberValue = Number(value);
      return Number.isSafeInteger(numberValue) ? numberValue : value.toString();
    }
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalize(v)]));
    }
    return value;
  };

  console.log('Parquet файл найден:', parquetPath);
  console.log('Структура файла:');
  console.log(reader.schema);
  console.log('Значения записей:');
  console.log(JSON.stringify(records.map(normalize), null, 2));
}

main().catch(error => {
  console.error('Ошибка проверки Parquet:', error);
  process.exit(1);
});
