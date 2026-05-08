-- Инициализация MariaDB для практической работы №5
-- Создается база practic4 и образец таблицы для выгрузки в Parquet
CREATE DATABASE IF NOT EXISTS practic4;
USE practic4;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(128) NOT NULL,
  product VARCHAR(128) NOT NULL,
  quantity INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  order_date DATETIME NOT NULL
);

INSERT INTO orders (customer_name, product, quantity, total, order_date) VALUES
('Алексей Иванов', 'Ноутбук', 1, 1099.90, '2026-05-01 10:00:00'),
('Мария Петрова', 'Смартфон', 2, 1299.98, '2026-05-03 14:30:00'),
('Олег Смирнов', 'Наушники', 3, 299.97, '2026-05-05 09:20:00');
