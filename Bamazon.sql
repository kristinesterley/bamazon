CREATE DATABASE Bamazon;
USE Bamazon;

CREATE TABLE `products` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `price` decimal(10,2) DEFAULT '0.00',
  `stock_quantity` int(11) DEFAULT '0',
  `product_sales` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  `over_head_costs` decimal(10,2) DEFAULT '0.00',
  `total_sales` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;