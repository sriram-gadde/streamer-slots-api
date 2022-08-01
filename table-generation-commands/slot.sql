CREATE TABLE `slots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slot_name` varchar(45) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `start_time` varchar(45) NOT NULL,
  `end_time` varchar(45) NOT NULL,
  `duration` int NOT NULL DEFAULT '30',
  `concurrent_users` int NOT NULL DEFAULT '5',
  `slot_users` int NOT NULL,
  `tier` varchar(45) NOT NULL DEFAULT 't3',
  `language` varchar(2) NOT NULL DEFAULT 'EN',
  `game` int NOT NULL,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_idx` (`game`),
  CONSTRAINT `id` FOREIGN KEY (`game`) REFERENCES `games` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci