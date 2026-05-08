const fs = require('fs');
const path = require('path');
const parquet = require('parquetjs-lite');

// JS-скрипт для генерации parquet-файла из образца данных.
const outputDir = path.resolve(__dirname, 'parquet-output');
const outputPath = path.join(outputDir, 'extracted_orders.parquet');

const schema = new parquet.ParquetSchema({
  id: { type: 'INT64' },
  customer_name: { type: 'UTF8' },
  product: { type: 'UTF8' },
  quantity: { type: 'INT64' },
  total: { type: 'DOUBLE' },
  order_date: { type: 'UTF8' }
});

const orders = [
  {
    id: 1,
    customer_name: 'Алексей Иванов',
    product: 'Ноутбук',
    quantity: 1,
    total: 1099.9,
    order_date: '2026-05-01T10:00:00'
  },
  {
    id: 2,
    customer_name: 'Мария Петрова',
    product: 'Смартфон',
    quantity: 2,
    total: 1299.98,
    order_date: '2026-05-03T14:30:00'
  },
  {
    id: 3,
    customer_name: 'Олег Смирнов',
    product: 'Наушники',
    quantity: 3,
    total: 299.97,
    order_date: '2026-05-05T09:20:00'
  }
];

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const writer = await parquet.ParquetWriter.openFile(schema, outputPath);

  for (const order of orders) {
    await writer.appendRow(order);
  }

  await writer.close();
  console.log('Parquet file saved:', outputPath);
}

main().catch(error => {
  console.error('Ошибка при записи Parquet:', error);
  process.exit(1);
});
