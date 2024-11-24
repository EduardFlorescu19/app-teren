CREATE TABLE pitches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL
);

INSERT INTO pitches (name, location, price_per_hour) VALUES
('Terenul 1', 'Adresa 1', 50.00),
('Terenul 2', 'Adresa 2', 60.00),
('Terenul 3', 'Adresa 3', 55.00);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pitch_id INT NOT NULL,
    user_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    FOREIGN KEY (pitch_id) REFERENCES pitches(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
