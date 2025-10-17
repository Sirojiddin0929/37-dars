-- Active: 1759323704886@@127.0.0.1@5432@examination

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    email VARCHAR(300) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_lower_title_boards ON boards (LOWER(title));

CREATE TABLE IF NOT EXISTS columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(256) NOT NULL,
    description TEXT,
    order_num INT DEFAULT 0,
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_lower_title_columns ON columns (LOWER(title));

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(256) NOT NULL,
    description TEXT,
    order_num INT DEFAULT 0,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    column_id UUID REFERENCES columns(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_lower_title_tasks ON tasks (LOWER(title));
CREATE UNIQUE INDEX IF NOT EXISTS unique_order_num ON tasks (order_num)

CREATE UNIQUE INDEX IF NOT EXISTS unique_order_num ON columns (order_num);
SELECT order_num, COUNT(*)
FROM columns
GROUP BY order_num
HAVING COUNT(*) > 1;
DELETE FROM columns a
USING columns b
WHERE a.ctid < b.ctid
  AND a.order_num = b.order_num;


