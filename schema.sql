CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;


CREATE TABLE IF NOT EXISTS products (
    item_id INTEGER AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    product_sales DECIMAL(NOT NULL DEFAULT 0,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES 
        ('Water', 'Drinks', 0.50, 20),
        ('Dr. Pepper', 'Drinks', 1.00, 10),
        ('Rice', 'Non-perishables', 2.50, 30),
        ('Beans', 'Non-perishables', 2.00, 25),
        ('Pasta', 'Non-perishables', 1.50, 40),
        ('Milk', 'Refridgerated', 2.00, 50),
        ('Eggs', 'Refridgerated', 3.00, 20),
        ('Cheese', 'Refridgerated', 1.50, 15),
        ('Lettuce', 'Produce', 1.00, 30),
        ('Tomato', 'Produce', 0.75, 20);


CREATE TABLE IF NOT EXISTS departments (
    department_id INTEGER AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(11, 2) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs)
    VALUES
        ('Drinks', 1000),
        ('Non-perishables', 500),
        ('Refridgerated', 3000),
        ('Produce', 1500);
