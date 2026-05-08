# Практическая работа №5: Batch миграция MariaDB → Parquet через Apache NiFi

## Описание

Данная работа реализует пакетное извлечение данных из MariaDB и сохранение их в формате Apache Parquet с использованием Apache NiFi.

## Архитектура решения

- **MariaDB** (Docker) — источник данных
- **Apache NiFi** (Docker) — ETL-слой для трансформации
- **Parquet** — формат хранения данных, оптимизированный для аналитических нагрузок
- **Node.js** — утилиты для генерации Parquet и NiFi-шаблона

### Поток данных

```
MariaDB → ExecuteSQL (NiFi) → ConvertRecord (Avro→Parquet) → PutFile → .parquet файл
```

## Структура проекта

```
Pract6/
├── docker-compose.yml          # Docker конфиг для MariaDB и NiFi
├── init-mariadb.sql            # Инициализация БД и таблицы
├── package.json                # npm конфиг
├── generate_parquet.js         # Генерация Parquet-файла из данных
├── generate_nifi_template.js   # Создание XML-шаблона NiFi
├── verify_parquet.js           # Проверка целостности Parquet
├── nifi/
│   ├── README.md               # Инструкции по настройке NiFi
│   └── practic5_template.xml   # Готовый шаблон для импорта в NiFi
├── parquet-output/
│   └── extracted_orders.parquet # Результирующий файл данных
└── README.md                   # Этот файл
```

## Инструкция по запуску

### 1. Запустить инфраструктуру (Docker)

```bash
cd c:\Users\Khuy\Desktop\Pract6
docker-compose up -d
```

Проверка:
```bash
docker ps  # Должны быть контейнеры mariadb и nifi
docker logs practic5-mariadb  # Проверить инициализацию БД
```

### 2. Установить JS-зависимости и сгенерировать Parquet

```bash
npm install
npm run generate-parquet
npm run generate-template
npm run verify-parquet
```

Или одной командой:
```bash
npm run build
```

### 3. Открыть NiFi UI

- http://localhost:8080/nifi

### 4. Импортировать шаблон в NiFi

1. В NiFi нажать **Upload Template** (иконка с стрелкой вверх)
2. Выбрать файл `nifi/practic5_template.xml`
3. Нажать **Add** для создания процесса
4. Настроить DBCPConnectionPool (параметры уже предзаполнены в шаблоне)
5. Запустить процесс

### 5. Проверить результаты

```bash
ls parquet-output/
# Должен быть файл extracted_orders.parquet

npm run verify-parquet
# Выведет схему и данные
```
## NPM скрипты

| Команда | Назначение |
|---------|-----------|
| `npm run generate-parquet` | Генерирует Parquet из образца данных |
| `npm run generate-template` | Создаёт NiFi XML-шаблон |
| `npm run verify-parquet` | Проверяет содержимое Parquet |
| `npm run build` | Выполняет все три команды |

## Примечание

Приложение ASP.NET Core (из практики №4) используется только как источник данных в MariaDB. Вся миграция данных выполняется средствами Apache NiFi без изменения приложения.

Каждый запуск NiFi-процесса создаёт новый Parquet-файл с уникальным временным префиксом.
