# Настройка Apache NiFi для batch-миграции MariaDB → Parquet

## Шаг 1: Подключение к MariaDB

1. В NiFi открыть `Controller Settings` → `Controller Services`.
2. Добавить `DBCPConnectionPool`.
3. Настроить свойства:
   - `Database Connection URL`: `jdbc:mariadb://mariadb:3306/practic4`
   - `Database Driver Class Name`: `org.mariadb.jdbc.Driver`
   - `Database User`: `student`
   - `Password`: `student`
   - `Database Driver Location(s)`: `/opt/nifi/nifi-current/lib/mariadb-java-client-*.jar`

> Примечание: если драйвер не установлен в образе NiFi, поместите `mariadb-java-client.jar` в каталог `nifi/drivers` и перезапустите контейнер.

## Шаг 2: Процесс `ExecuteSQL`

1. Перетащить `ExecuteSQL` на холст.
2. Настроить свойства:
   - `Database Connection Pooling Service`: выбранный `DBCPConnectionPool`
   - `SQL select query`: `SELECT id, customer_name, product, quantity, total, order_date FROM orders;`
   - `Output FlowFile Format`: `Avro`
   - `Max Rows Per Flow File`: оставить пустым или указать `0`

## Шаг 3: Процесс `ConvertRecord`

1. Добавить `ConvertRecord`.
2. Настроить `Record Reader` и `Record Writer`.

### Record Reader: AvroReader
- `Schema Access Strategy`: `Use Schema Text`
- Оставить схему пустой, если ExecuteSQL передает встроенную схему.

### Record Writer: ParquetRecordSetWriter
- `Schema Access Strategy`: `Use Schema Text`
- `Compression`: `SNAPPY`
- `Output Format`: Parquet
- В поле `Schema Text` можно задать схему данных, соответствующую таблице `orders`.

## Шаг 4: Процесс `PutFile`

1. Добавить `PutFile`.
2. Настроить свойства:
   - `Directory`: `/data/parquet-output`
   - `Conflict Resolution Strategy`: `replace`
   - `Create Missing Directories`: `true`

## Шаг 5: Связи между процессами

- `ExecuteSQL` → `ConvertRecord` (успех)
- `ConvertRecord` → `PutFile` (успех)
- Обработать ошибки `failure` через `LogAttribute` или `TerminateFlowFile`

## Шаг 6: Периодический запуск

- Установить `Scheduling Strategy` у `ExecuteSQL`: `Timer Driven`
- `Run Schedule`: например `1 min` или `5 min`
- Каждый запуск будет создавать новый FlowFile и, соответственно, новый Parquet-файл

## Комментарий

Этот процесс реализует пакетную выгрузку данных из MariaDB без CDC и Kafka. Данные берутся из таблицы `orders` и сохраняются в файловой системе в формате Parquet.
