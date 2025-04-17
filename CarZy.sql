CREATE DATABASE carzy;

USE carzy;

SHOW TABLES;


CREATE TABLE otp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile_number VARCHAR(15) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at DATETIME DEFAULT (CURRENT_TIMESTAMP + INTERVAL 10 MINUTE),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified_at DATETIME NULL,
    INDEX idx_otp_id (id)
);
Drop table user;
SELECT * FROM car; 

show tables;