CREATE DATABASE carzy;
Drop database carzy;
USE carzy;

SHOW TABLES;

SELECT * FROM car; 
SELECT * FROM coupon;
SELECT * FROM booking;
SELECT * FROM car_verification; 
SELECT * FROM payment; 
SELECT * FROM user; 
SELECT * FROM system_review; 
SELECT * FROM user_verification; 
DELETE FROM user WHERE mobile_number != '9529093846';

ALTER TABLE booking
ADD COLUMN late_charge FLOAT DEFAULT 100;


