CREATE DATABASE clinic;
USE clinic;

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20),
    department VARCHAR(50),
    date DATE,
    time TIME
);
