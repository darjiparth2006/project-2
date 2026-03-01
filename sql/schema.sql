-- MySQL schema for Parth Library
CREATE DATABASE IF NOT EXISTS parth_library CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE parth_library;

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  isbn VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS allocations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  book_id INT NOT NULL,
  when_allocated DATETIME NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
