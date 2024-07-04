-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: db-prorep-instance-1.crxwdt2oupkd.us-east-1.rds.amazonaws.com    Database: rigk-sgr-dm
-- ------------------------------------------------------
-- Server version	5.7.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `tbd_cum_anio`
--

DROP TABLE IF EXISTS `tbd_cum_anio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbd_cum_anio` (
  `ID_CUMP` int(11) NOT NULL AUTO_INCREMENT,
  `ID_ANIO` int(11) NOT NULL,
  PRIMARY KEY (`ID_CUMP`,`ID_ANIO`),
  KEY `ID_ANIO` (`ID_ANIO`),
  CONSTRAINT `tbd_cum_anio_ibfk_1` FOREIGN KEY (`ID_ANIO`) REFERENCES `tbm_anios` (`ID`),
  CONSTRAINT `tbd_cum_anio_ibfk_2` FOREIGN KEY (`ID_CUMP`) REFERENCES `tbh_porc_cump_ci` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbd_cum_anio`
--

LOCK TABLES `tbd_cum_anio` WRITE;
/*!40000 ALTER TABLE `tbd_cum_anio` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbd_cum_anio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbd_cum_materiales`
--

DROP TABLE IF EXISTS `tbd_cum_materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbd_cum_materiales` (
  `ID_CUMP` int(11) NOT NULL AUTO_INCREMENT,
  `ID_MATERIAL` int(11) NOT NULL,
  PRIMARY KEY (`ID_CUMP`,`ID_MATERIAL`),
  KEY `ID_MATERIAL` (`ID_MATERIAL`),
  CONSTRAINT `tbd_cum_materiales_ibfk_1` FOREIGN KEY (`ID_MATERIAL`) REFERENCES `tbm_materiales` (`ID`),
  CONSTRAINT `tbd_cum_materiales_ibfk_2` FOREIGN KEY (`ID_CUMP`) REFERENCES `tbh_porc_cump_ci` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbd_cum_materiales`
--

LOCK TABLES `tbd_cum_materiales` WRITE;
/*!40000 ALTER TABLE `tbd_cum_materiales` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbd_cum_materiales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbd_cum_meses`
--

DROP TABLE IF EXISTS `tbd_cum_meses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbd_cum_meses` (
  `ID_CUMP` int(11) NOT NULL AUTO_INCREMENT,
  `ID_MES` int(11) NOT NULL,
  PRIMARY KEY (`ID_CUMP`,`ID_MES`),
  KEY `ID_MES` (`ID_MES`),
  CONSTRAINT `tbd_cum_meses_ibfk_1` FOREIGN KEY (`ID_MES`) REFERENCES `tbm_meses` (`ID`),
  CONSTRAINT `tbd_cum_meses_ibfk_2` FOREIGN KEY (`ID_CUMP`) REFERENCES `tbh_porc_cump_ci` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbd_cum_meses`
--

LOCK TABLES `tbd_cum_meses` WRITE;
/*!40000 ALTER TABLE `tbd_cum_meses` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbd_cum_meses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbh_porc_cump_ci`
--

DROP TABLE IF EXISTS `tbh_porc_cump_ci`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbh_porc_cump_ci` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `VALOR_CUM` float NOT NULL,
  `VALOR_TON_VAL` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbh_porc_cump_ci`
--

LOCK TABLES `tbh_porc_cump_ci` WRITE;
/*!40000 ALTER TABLE `tbh_porc_cump_ci` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbh_porc_cump_ci` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbm_anios`
--

DROP TABLE IF EXISTS `tbm_anios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbm_anios` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ANIO` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbm_anios`
--

LOCK TABLES `tbm_anios` WRITE;
/*!40000 ALTER TABLE `tbm_anios` DISABLE KEYS */;
INSERT INTO `tbm_anios` VALUES (1,2021),(2,2022),(3,2023),(4,2024),(5,2025),(6,2026),(7,2027),(8,2028),(9,2029),(10,2030);
/*!40000 ALTER TABLE `tbm_anios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbm_materiales`
--

DROP TABLE IF EXISTS `tbm_materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbm_materiales` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `TYPE_MATERIAL` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbm_materiales`
--

LOCK TABLES `tbm_materiales` WRITE;
/*!40000 ALTER TABLE `tbm_materiales` DISABLE KEYS */;
INSERT INTO `tbm_materiales` VALUES (1,'Papel/Carton'),(2,'Metal'),(3,'Plastico'),(5,'Global');
/*!40000 ALTER TABLE `tbm_materiales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbm_meses`
--

DROP TABLE IF EXISTS `tbm_meses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbm_meses` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `MESES` varchar(100) NOT NULL,
  `MESES_ABREV` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbm_meses`
--

LOCK TABLES `tbm_meses` WRITE;
/*!40000 ALTER TABLE `tbm_meses` DISABLE KEYS */;
INSERT INTO `tbm_meses` VALUES (1,'Enero','Ene'),(2,'Febrero','Feb'),(3,'Marzo','Mar'),(4,'Abril','Abr'),(5,'Mayo','May'),(6,'Junio','Jun'),(7,'Julio','Jul'),(8,'Agosto','Ago'),(9,'Septiembre','Sep'),(10,'Octubre','Oct'),(11,'Noviembre','Nov'),(12,'Diciembre','Dic');
/*!40000 ALTER TABLE `tbm_meses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'rigk-sgr-dm'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-04 11:03:41
