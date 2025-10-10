-- Active: 1759323704886@@127.0.0.1@5432@exam
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(300) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS boards(
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS columns(
    id SERIAL PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    description text,
    order_num INT DEFAULT 0,
    board_id INT REFERENCES boards(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS tasks(
    id SERIAL PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    description text,
    order_num INT DEFAULT 0,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    column_id INT REFERENCES columns(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);