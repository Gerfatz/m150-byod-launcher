-- MySQL dump 10.17  Distrib 10.3.17-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: byodlauncher
-- ------------------------------------------------------
-- Server version	10.3.17-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Categories` (
  `Id` char(36) NOT NULL,
  `Title` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES ('070b92f1-b9d8-4595-a2d2-84cec57f3d82','Category B'),('34917d2d-bd78-42d8-8424-d0ebb83486ef','Category A');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Directors`
--

DROP TABLE IF EXISTS `Directors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Directors` (
  `Id` char(36) NOT NULL,
  `DisplayName` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `Email` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `ConnectionId` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Directors`
--

LOCK TABLES `Directors` WRITE;
/*!40000 ALTER TABLE `Directors` DISABLE KEYS */;
INSERT INTO `Directors` VALUES ('08d80d21-ea06-4d93-8234-bcbe26ebc888','Peter Gisler','peter.gisler@gibz.ch',NULL),('08d8400c-b813-4670-817a-c95a7bc35890','Peter Gisler','peter.gisler@gibz.ch',NULL),('08d845c4-cd09-49a5-8fe2-4283a11e24a0','Peter Gisler','peter.gisler@gibz.ch',NULL);
/*!40000 ALTER TABLE `Directors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Participants`
--

DROP TABLE IF EXISTS `Participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Participants` (
  `Id` char(36) NOT NULL,
  `DisplayName` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `SessionId` char(36) NOT NULL,
  `ConnectionId` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Participants_SessionId` (`SessionId`),
  CONSTRAINT `FK_Participants_Sessions_SessionId` FOREIGN KEY (`SessionId`) REFERENCES `Sessions` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Participants`
--

LOCK TABLES `Participants` WRITE;
/*!40000 ALTER TABLE `Participants` DISABLE KEYS */;
INSERT INTO `Participants` VALUES ('08d83d72-0ddc-49fd-8db8-5a0cba20716c','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83d73-51f4-455c-8106-c54fffdcc04c','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83d75-8d2b-4d7e-8fbf-3727e9e0a43c','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83d76-2fc7-48fc-8d27-e2a01b156428','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83ddb-6790-41b0-84fe-bc8e8d00d3da','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83ddc-5803-43fa-83de-ed86d68296af','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83ddc-9b53-4f93-8353-28d4f6319381','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83ddf-372d-4a1d-85cb-49def6298b3c','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83de5-6068-4a9e-8cc1-9c8a3c09126b','Pppp','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83de5-88ed-48fa-86fb-8b616773de21','test','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83dee-bac2-4ce4-88bc-02ad85b6b81a','GIPE from wlan config','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83df2-3011-445e-8e88-6dc9e61210b1','OtherUser','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83df3-9932-4304-863d-1c87ccb9a2be','OtherPC','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83dff-3ceb-49e5-8e7a-49e6fc4f1c4b','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83f7a-6e20-407e-8e30-faa2eac4eb92','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83fbf-e42a-4cc6-87ac-1a184471de01','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83fc0-017c-46c3-8869-2762ae365304','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83fc0-0b38-481e-8fb1-ed49c1b137fd','GIPE','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83fc0-2d50-48f2-8bae-5adf800a2c7e','X','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL),('08d83fc0-37c1-45e6-818d-2787d85dfa11','Y','08d80d21-ea2b-4e7b-8f38-4652f4c849db',NULL);
/*!40000 ALTER TABLE `Participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sessions`
--

DROP TABLE IF EXISTS `Sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Sessions` (
  `Id` char(36) NOT NULL,
  `Title` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `AccessCode` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `EditCode` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `DirectorId` char(36) NOT NULL,
  `CurrentStage` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Sessions_DirectorId` (`DirectorId`),
  CONSTRAINT `FK_Sessions_Directors_DirectorId` FOREIGN KEY (`DirectorId`) REFERENCES `Directors` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sessions`
--

LOCK TABLES `Sessions` WRITE;
/*!40000 ALTER TABLE `Sessions` DISABLE KEYS */;
INSERT INTO `Sessions` VALUES ('08d80d21-ea2b-4e7b-8f38-4652f4c849db','Testlauf','201396','549496','08d80d21-ea06-4d93-8234-bcbe26ebc888',1),('08d8400c-b869-4dd4-8300-b47813b145f9','Tech-WarmUp FAGEEB und FAGEV','706174','149190','08d8400c-b813-4670-817a-c95a7bc35890',2),('08d845c4-cd19-4488-88e3-30da744a0750','Test','533207','133919','08d845c4-cd09-49a5-8fe2-4283a11e24a0',0);
/*!40000 ALTER TABLE `Sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StageTargets`
--

DROP TABLE IF EXISTS `StageTargets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `StageTargets` (
  `StageId` char(36) NOT NULL,
  `TargetId` char(36) NOT NULL,
  PRIMARY KEY (`StageId`,`TargetId`),
  KEY `IX_StageTargets_TargetId` (`TargetId`),
  CONSTRAINT `FK_StageTargets_Stages_StageId` FOREIGN KEY (`StageId`) REFERENCES `Stages` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_StageTargets_Targets_TargetId` FOREIGN KEY (`TargetId`) REFERENCES `Targets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StageTargets`
--

LOCK TABLES `StageTargets` WRITE;
/*!40000 ALTER TABLE `StageTargets` DISABLE KEYS */;
INSERT INTO `StageTargets` VALUES ('08d80d21-eb2b-41cb-8ca7-6d58a5660fa5','08d80d23-dc5d-4363-8dcd-e148b41a0b8c'),('08d80d21-eb2b-41cb-8ca7-6d58a5660fa5','2b2bfd73-da5b-4cc1-a5f4-20c195c84744'),('08d80d21-eb2b-41cb-8ca7-6d58a5660fa5','5182ae90-1b29-453e-8611-a0a3d35ae418'),('08d80d25-7589-4034-8384-e2bb7ac420f6','2b44e860-cac2-49b8-9a28-2f2cf2c62fd3'),('08d8400c-d037-4653-852c-ab8047ae2b6c','08d80d23-dc5d-4363-8dcd-e148b41a0b8c'),('08d8400c-d037-4653-852c-ab8047ae2b6c','08d83e07-673d-4aa8-8da4-e643ba942d03'),('08d8400c-daf9-4204-8713-284c787cdd20','08d83e29-05e7-4e39-892a-2d99ccd37052'),('08d8400c-e805-41a2-82ab-d535efca9a0f','08d83f63-a6ee-4cdb-8780-e301bdd6e76c');
/*!40000 ALTER TABLE `StageTargets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Stages`
--

DROP TABLE IF EXISTS `Stages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Stages` (
  `Id` char(36) NOT NULL,
  `SequenceNumber` int(11) NOT NULL,
  `Title` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `SessionId` char(36) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Stages_SessionId` (`SessionId`),
  CONSTRAINT `FK_Stages_Sessions_SessionId` FOREIGN KEY (`SessionId`) REFERENCES `Sessions` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Stages`
--

LOCK TABLES `Stages` WRITE;
/*!40000 ALTER TABLE `Stages` DISABLE KEYS */;
INSERT INTO `Stages` VALUES ('08d80d21-eb2b-41cb-8ca7-6d58a5660fa5',1,'Alle bisher verfügbaren Skripts','08d80d21-ea2b-4e7b-8f38-4652f4c849db'),('08d80d25-7589-4034-8384-e2bb7ac420f6',2,'Tutorial (exemplarisch)','08d80d21-ea2b-4e7b-8f38-4652f4c849db'),('08d8400c-d037-4653-852c-ab8047ae2b6c',1,'EDUZug','08d8400c-b869-4dd4-8300-b47813b145f9'),('08d8400c-daf9-4204-8713-284c787cdd20',2,'Zustimmung zu Dokumenten','08d8400c-b869-4dd4-8300-b47813b145f9'),('08d8400c-e805-41a2-82ab-d535efca9a0f',3,'Initiales Login O365','08d8400c-b869-4dd4-8300-b47813b145f9'),('08d845c4-cdeb-4a26-89f3-54771553d57c',1,'Stufe 1','08d845c4-cd19-4488-88e3-30da744a0750');
/*!40000 ALTER TABLE `Stages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TargetDependencies`
--

DROP TABLE IF EXISTS `TargetDependencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TargetDependencies` (
  `DependerId` char(36) NOT NULL,
  `DependeeId` char(36) NOT NULL,
  PRIMARY KEY (`DependeeId`,`DependerId`),
  KEY `IX_TargetDependencies_DependerId` (`DependerId`),
  CONSTRAINT `FK_TargetDependencies_Targets_DependeeId` FOREIGN KEY (`DependeeId`) REFERENCES `Targets` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_TargetDependencies_Targets_DependerId` FOREIGN KEY (`DependerId`) REFERENCES `Targets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TargetDependencies`
--

LOCK TABLES `TargetDependencies` WRITE;
/*!40000 ALTER TABLE `TargetDependencies` DISABLE KEYS */;
/*!40000 ALTER TABLE `TargetDependencies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TargetResults`
--

DROP TABLE IF EXISTS `TargetResults`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TargetResults` (
  `Id` char(36) NOT NULL,
  `Success` tinyint(1) NOT NULL,
  `Details` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `ParticipantId` char(36) NOT NULL,
  `TargetId` char(36) NOT NULL,
  `Timestamp` datetime(6) NOT NULL DEFAULT '0001-01-01 00:00:00.000000',
  PRIMARY KEY (`Id`),
  KEY `IX_TargetResults_ParticipantId` (`ParticipantId`),
  KEY `IX_TargetResults_TargetId` (`TargetId`),
  CONSTRAINT `FK_TargetResults_Participants_ParticipantId` FOREIGN KEY (`ParticipantId`) REFERENCES `Participants` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_TargetResults_Targets_TargetId` FOREIGN KEY (`TargetId`) REFERENCES `Targets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TargetResults`
--

LOCK TABLES `TargetResults` WRITE;
/*!40000 ALTER TABLE `TargetResults` DISABLE KEYS */;
INSERT INTO `TargetResults` VALUES ('08d83d73-6b53-4fc3-81a1-1b2062e19030',1,'','08d83d73-51f4-455c-8106-c54fffdcc04c','08d80d23-dc5d-4363-8dcd-e148b41a0b8c','2020-08-10 21:22:00.404123'),('08d83d73-7f11-4726-8ee0-bb50dc6631c5',0,'','08d83d73-51f4-455c-8106-c54fffdcc04c','08d80d23-dc5d-4363-8dcd-e148b41a0b8c','2020-08-10 21:22:33.530333'),('08d83d73-80b4-4775-818d-8fc388aacb62',1,'','08d83d73-51f4-455c-8106-c54fffdcc04c','08d80d23-dc5d-4363-8dcd-e148b41a0b8c','2020-08-10 21:22:36.276717'),('08d83d76-50f6-48e8-8ef2-a059c974cf2d',1,'','08d83d76-2fc7-48fc-8d27-e2a01b156428','2b2bfd73-da5b-4cc1-a5f4-20c195c84744','2020-08-10 21:42:44.666845'),('08d83ddd-8e9d-4b8e-8f8b-a82238945ff0',1,'','08d83ddc-9b53-4f93-8353-28d4f6319381','2b44e860-cac2-49b8-9a28-2f2cf2c62fd3','2020-08-11 10:01:46.260961'),('08d83de5-1360-45b1-804b-4aa56af13115',1,'','08d83ddf-372d-4a1d-85cb-49def6298b3c','2b44e860-cac2-49b8-9a28-2f2cf2c62fd3','2020-08-11 10:55:35.473163'),('08d83de5-6a77-43b9-8ac0-a5956384f5d8',1,'','08d83de5-6068-4a9e-8cc1-9c8a3c09126b','08d80d23-dc5d-4363-8dcd-e148b41a0b8c','2020-08-11 10:58:01.592758'),('08d83de5-6b23-4685-8ea7-d6f8115b461c',0,'','08d83de5-6068-4a9e-8cc1-9c8a3c09126b','08d80d23-dc5d-4363-8dcd-e148b41a0b8c','2020-08-11 10:58:02.721145'),('08d83de5-6bcc-4be3-8a4d-0dbd314dad7d',1,'','08d83de5-6068-4a9e-8cc1-9c8a3c09126b','08d80d23-dc5d-4363-8dcd-e148b41a0b8c','2020-08-11 10:58:03.830902'),('08d83de5-ac35-408d-8184-00829b60a824',1,'','08d83de5-88ed-48fa-86fb-8b616773de21','2b44e860-cac2-49b8-9a28-2f2cf2c62fd3','2020-08-11 10:59:51.888561');
/*!40000 ALTER TABLE `TargetResults` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Targets`
--

DROP TABLE IF EXISTS `Targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Targets` (
  `Id` char(36) NOT NULL,
  `Title` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `Description` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `CategoryId` char(36) DEFAULT NULL,
  `Discriminator` longtext CHARACTER SET utf8mb4 NOT NULL,
  `Script` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `RequiresCredentials` tinyint(1) NOT NULL DEFAULT 0,
  `NsisScript` longtext DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Targets_CategoryId` (`CategoryId`),
  CONSTRAINT `FK_Targets_Categories_CategoryId` FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Targets`
--

LOCK TABLES `Targets` WRITE;
/*!40000 ALTER TABLE `Targets` DISABLE KEYS */;
INSERT INTO `Targets` VALUES ('08d80d23-dc5d-4363-8dcd-e148b41a0b8c','Mobilnummer in EDUZug eintragen','Für den externen Zugriff auf EDUZug ist die Eintragung der Mobilnummer in EDUZug erforderlich. In diesem Tutorial erfahren Sie, wie Sie diese Eintragung ganz einfach und selbständig durchführen können. ',NULL,'TutorialTarget',NULL,0,NULL),('08d83e07-673d-4aa8-8da4-e643ba942d03','E-Mail Adresse in EDUZug eintragen','Für die Kommunikation über EDUZug sowie für das Zurücksetzen des Passwortes muss in EDUZug eine private E-Mail Adresse eingetragen werden.',NULL,'TutorialTarget',NULL,0,NULL),('08d83e29-05e7-4e39-892a-2d99ccd37052','AGBs akzeptieren','Neue Lernende müssen jeweils bis spätestens Ende September die Informatikbenutzerordnung und die Vereinbarung \"sauberes GIBZ\" akzeptieren.',NULL,'TutorialTarget',NULL,0,NULL),('08d83f63-a6ee-4cdb-8780-e301bdd6e76c','Erstanmeldung Office 365','Bei der ersten Anmeldung in Office 365 müssen für den Schutz des persönlichen Kontos zusätzliche Sicherheitsinformationen eingegeben werden. Diese Sicherheitsinformationen können die Handynummer und/oder eine alternative E-Mail Adresse sein.',NULL,'TutorialTarget',NULL,0,NULL),('08d84005-e3d7-49d7-89d7-9198188e9f65','FORTSETZUNG Initial O365','Fortsetzung',NULL,'TutorialTarget',NULL,0,NULL),('2B2BFD73-DA5B-4CC1-A5F4-20C195C84744','Favoriten im Browser','Fügt die Webseiten www.gibz.ch und portal.gibz.ch als Favoriten im Browser Internet Explorer hinzu','34917d2d-bd78-42d8-8424-d0ebb83486ef','SimpleScriptTarget','\n<#\n        .SYNOPSIS\n        Add favorites to Internet Explorer. Other browser will be added in future\n        Author:     Tobias Schmid\n        Date:       20. Mai 2020\n        Version:    1.0 \n\n        .DESCRIPTION\n        None. \n\n        .PARAMETER Name\n        None.\n\n        .PARAMETER Extension\n        None-\n\n        .INPUTS\n        None. \n\n        .OUTPUTS\n        None.\n\n        .EXAMPLE\n        None.\n\n        .LINK\n        None.\n\n        .LINK\n        None.\n    #>\n\n# Set Executionpolicy to unrestricted\n$ExecutionPolicy = Get-ExecutionPolicy\nSet-ExecutionPolicy -scope CurrentUser -ExecutionPolicy Unrestricted -Force\n\n# Replace Information from WebUI\n# RESPONSE_URL : Url, an welche der POST Request mit dem Ergebnis der Skript-Ausführung gesendet wird\n# USERNAME : Benutzername des Benutzers (muss initial durch Benutzer eingegeben werden)\n# PASSWORD : Passwort des Benutzers (muss initial durch Benutzer eingegeben werden)\n# PARTICIPANT_ID : ID des Benutzers (wird durch System vergeben)\n# TARGET_ID : ID des Skripts\n$ResponseURL = \'RESPONSE_URL\';\n$ParticipantID = \'PARTICIPANT_ID\';\n$TargetID = \'TARGET_ID\';\n\n# Add favorite https://www.gibz.ch to desktop as link\n$Shell = New-Object -ComObject (\"WScript.Shell\")\n$ShortCut = $Shell.CreateShortcut($env:USERPROFILE + \"\\Desktop\\GIBZ.lnk\")\n$ShortCut.TargetPath = \"C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe\"\n$ShortCut.Arguments = \"https://www.gibz.ch\"\n$ShortCut.WorkingDirectory = \"C:\\Program Files (x86)\\Internet Explorer\"\n$ShortCut.WindowStyle = 1\n$ShortCut.IconLocation = \"iexplore.exe, 0\"\n\n$ShortCut.Save()\n\n\n# Add favorites to Internet Explorer\nfunction add-Bookmarks{                  \n    $Bookmarks = @{ \n    \"GIBZ\" = @{\n        \"GIBZ\" = \"https://www.gibz.ch\";\n    };\n    \"Office 365\" = @{  \n        \"Office 365\" = \"https://portal.office.com\";\n    };\n}\n    foreach ($Name in $Bookmarks.keys)\n    {\n        $IEFav =  [Environment]::GetFolderPath(\'Favorites\')                  \n        New-Item $IEFav\\$Name -ItemType Directory -Force\n        $Shell = New-Object -ComObject WScript.Shell\n        $IEFav = Join-Path -Path $IEFav -ChildPath $Name\n        foreach ($Key in $Bookmarks[$Name].keys)\n        {\n            $FullPath = Join-Path -Path $IEFav -ChildPath \"$($Key).url\"\n            $Shortcut = $Shell.CreateShortcut($FullPath)\n            $Shortcut.TargetPath = $bookmarks[$Name][$Key]\n            $Shortcut.Save()\n        }\n    }   \n}\nadd-Bookmarks\n\n# Import to Edge, Chrome will be added in future.\n\n# Send Post Request to Website BYOD from GIBZ\n# {\n#    \"success\": true,\n#    \"details\": \"Further description of state. Might be used for error codes.\",\n#    \"participantId\": \"Id of participant. Will be given in script.\",\n#    \"targetId\": \"Id of target (=task). Will be given in script.\"\n#  }\n$postParams = @{\"success\" = $true;\n    \"details\"             = \"\";\n    \"participantId\"       = \"$ParticipantID\";\n    \"targetId\"             = \"$TargetID\"\n}\n\nInvoke-WebRequest -Uri $ResponseURL -Method POST -Body ($postParams | ConvertTo-Json) -ContentType \"application/json\"\n\n# Set Executionpolicy to predefined value\n$ExecutionPolicy = Get-ExecutionPolicy\nSet-ExecutionPolicy -ExecutionPolicy $ExecutionPolicy -Force ',0,NULL),('2B44E860-CAC2-49B8-9A28-2F2CF2C62FD3','Installation von Teams ','Lädt das Programm Teams aus dem Internet herunter und installiert die Client-Applikation','34917d2d-bd78-42d8-8424-d0ebb83486ef','SimpleScriptTarget','param([switch]$success,\n[string]$details)\n\n$ResponseURL = \'RESPONSE_URL\';\n$ParticipantID = \'PARTICIPANT_ID\';\n$TargetID = \'TARGET_ID\';\n\n\n# Send Post Request to Website BYOD from GIBZ\n# {\n#    \"success\": true,\n#    \"details\": \"Further description of state. Might be used for error codes.\",\n#    \"participantId\": \"Id of participant. Will be given in script.\",\n#    \"targetId\": \"Id of target (=task). Will be given in script.\"\n#  }\n$postParams = @{\"success\" = $success.IsPresent;\n    \"details\"             = \"$details\";\n    \"participantId\"       = \"$ParticipantID\";\n    \"targetId\"             = \"$TargetID\"\n}\n\nInvoke-WebRequest -Uri $ResponseURL -Method POST -Body ($postParams | ConvertTo-Json) -ContentType \"application/json\"',0,';Get most recent installer from: https://teams.microsoft.com/desktopclient/installer/windows\n\n!include \"MUI.nsh\"\n!include nsDialogs.nsh\n!include LogicLib.nsh\n\nName \"Microsoft Teams\"\nOutfile \"INSTALLER_PATHINSTALLER_FILENAME.exe\"\nRequestexecutionlevel admin\nBrandingText \" \"\nUnicode True\n\n!define MUI_ICON \"INSTALLER_RESOURCES_PATH/icon.ico\"\n\nVar Dialog\n\nPage custom mypagecreate\n!insertmacro MUI_PAGE_INSTFILES\n\n!insertmacro MUI_LANGUAGE \"German\"\n\nFunction mypagecreate\n\n    !insertmacro MUI_HEADER_TEXT \"BYOD Launcher\" \"Installation des Desktop-Clients für Microsoft Teams\"\n\n    nsDialogs::Create 1018\n    Pop $Dialog\n    \n    ${If} $Dialog == error\n        Abort\n    ${EndIf}\n    \n    ${NSD_CreateLabel} 0 0 100% 30u \"Im Rahmen dieser Installation wird Teams aus dem Internet heruntergeladen und automatisch auf Ihrem Computer installiert.\"\n        \n    nsDialogs::Show\n    \nFunctionEnd\n\nFunction .onInstSuccess\n\n    Delete \"$TEMP\\INSTALLER_FILENAME\"\n\nFunctionEnd\n\nSection\n\n    SetOutPath $TEMP\n    File \"SCRIPT_PATHSCRIPT_FILENAME\"\n    File \"INSTALLER_RESOURCES_PATH/Teams_windows_x64.exe\"\n\n    nsExec::ExecToStack /TIMEOUT=60000 \'\"Teams_windows_x64.exe\" -s\'\n    \n    Pop $0  ; returnValue/error/timeout\n    Pop $1  ; output of installer execution\n    \n    ${If} $0 == 0\n        DetailPrint \"Microsoft Teams erfolgreich installiert.\"\n        nsExec::ExecToStack \"powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File .\\SCRIPT_FILENAME -success\"            \n    ${ElseIf} $0 == \'timeout\'\n        DetailPrint \"TimeOut bei der Installation von Microsoft Teams.\"\n        nsExec::ExecToStack \"powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File .\\SCRIPT_FILENAME -details \'timeout\'\"\n    ${ElseIf} $0 == \'error\'\n        DetailPrint \"Fehler bei der Installation von Microsoft Teams\"\n        nsExec::ExecToStack \"powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File .\\SCRIPT_FILENAME -details \'error\'\"\n    ${EndIf}\n    \nSectionEnd'),('5182AE90-1B29-453E-8611-A0A3D35AE418','Einrichtung WLAN','Richtet den Zugang zum WLAN \"eduroam\" ein.','34917d2d-bd78-42d8-8424-d0ebb83486ef','SimpleScriptTarget','param(\n[string]$username,\n[string]$password,\n[string]$displayname)\n\n$ResponseURL = \'https://byod-launcher.ch/api/session/SESSION_ID/participant/\';\n\n# Send Post Request to Website BYOD from GIBZ\n# {\n#    \"success\": true,\n#    \"details\": \"Further description of state. Might be used for error codes.\",\n#    \"participantId\": \"Id of participant. Will be given in script.\",\n#    \"targetId\": \"Id of target (=task). Will be given in script.\"\n#  }\n$postParams = @{\n    \"username\"     = \"$username\";\n    \"password\"     = \"$password\";\n    \"displayname\"  = \"$displayname\"\n}\n\n$JoinUri = (Invoke-WebRequest -Uri $ResponseURL -Method POST -Body ($postParams | ConvertTo-Json) -ContentType \"application/json\").Content\nstart $JoinUri',0,'!include \"MUI.nsh\"\n!include nsDialogs.nsh\n!include LogicLib.nsh\n\nName \"WLAN\"\nOutfile \"INSTALLER_PATHINSTALLER_FILENAME.exe\"\nRequestexecutionlevel admin\nBrandingText \" \"\nUnicode True\n\n!define MUI_ICON \"INSTALLER_RESOURCES_PATH/icon.ico\"\n\nVar Dialog\nVar UsernameLabel\nVar UsernameInput\nVar Username\nVar PasswordLabel\nVar PasswordInput\nVar Password\nVar DisplaynameLabel\nVar DisplaynameInput\nVar Displayname\nVar EduroamInstallSuccessful\n\nVar UsernameReadOnly\n\nPage custom mypagecreate myPageLeave\n!insertmacro MUI_PAGE_INSTFILES\nPage custom successPage successPageEnd\nPage custom failMessage\n\n!insertmacro MUI_LANGUAGE \"German\"\n\nFunction successPage\n\n    ${IfNot} $EduroamInstallSuccessful == 1\n        Abort\n    ${EndIf}\n\n    !insertmacro MUI_HEADER_TEXT \"BYOD Launcher\" \"Einrichtung der kabellosen Netzwerkverbindung (WLAN) abgeschlossen.\"\n    \n    nsDialogs::Create 1018\n    Pop $Dialog\n    \n    ${If} $Dialog == error\n        Abort\n    ${EndIf}\n\n    ${NSD_CreateLabel} 0 0 100% 25u \'Die Einrichtung der kabellosen Netzwerkverbindung konnte erfolgreich abgeschlossen werden. Um eine Verbindung mit dem Internet herzustellen, müssen Sie nun Ihre persönlichen Zugangsdaten (Benutzername/Passwort) eingeben.\'\n    \n    ${NSD_CreateLabel} 0 30u 100% 35u \'Klicken Sie dazu in der unteren, rechten Ecke Ihres Bildschirms auf das Symbol für die Internetverbindung (Weltkugel oder WLAN-Wellen) und anschliessend auf das Netzwerk mit dem Namen eduroam. Nach einem Klick auf den Button \"Verbinden\" öffnet sich ein Eingabefenster für Benutzername und Kennwort.\'\n    \n    ${NSD_CreateLabel} 0 85u 40% 20u \"Ihr Benutzername lautet:\"\n    \n    ${NSD_CreateText} 40% 85u 60% 12u \"$Username@gibz.edu-zg.ch\"\n    Pop $UsernameReadOnly\n    SendMessage $UsernameReadOnly ${EM_SETREADONLY} 1 0\n        \n    nsDialogs::Show\n    \nFunctionEnd\n\nFunction successPageEnd\n\n    nsExec::ExecToStack \"powershell -ExecutionPolicy Bypass -WindowStyle Hidden -File $TEMP\\SCRIPT_FILENAME -username $Username -password $Password -displayname $Displayname\"\n\nFunctionEnd\n\nFunction failMessage\n\n    ${If} $EduroamInstallSuccessful == 1\n        Abort\n    ${EndIf}\n\n    !insertmacro MUI_HEADER_TEXT \"BYOD Launcher\" \"Einrichtung der kabellosen Netzwerkverbindung (WLAN) fehlgeschlagen.\"\n    \n    nsDialogs::Create 1018\n    Pop $Dialog\n    \n    ${If} $Dialog == error\n        Abort\n    ${EndIf}\n\n    ${NSD_CreateLabel} 0 0 100% 30u \"Die Einrichtung der kabellosen Netzwerkverbindung ist fehlgeschlagen. Bitte wenden Sie sich für weiteren Support an Ihre Lehrperson oder den IT-Support des GIBZ.\"\n    \n    nsDialogs::Show\n        \nFunctionEnd\n\nFunction mypagecreate\n\n    !insertmacro MUI_HEADER_TEXT \"BYOD Launcher\" \"Einrichtung der kabellosen Netzwerkverbindung (WLAN)\"\n\n    nsDialogs::Create 1018\n    Pop $Dialog\n\n    ${If} $Dialog == error\n        Abort\n    ${EndIf}\n\n    ${NSD_CreateLabel} 0 0 100% 25u \"Für die Einrichtung des WLAN werden Ihre persönlichen Zugangsdaten benötigt. Geben Sie in die nachfolgenden Felder bitte Ihren Benutzernamen sowie Ihr Passwort ein.\"\n\n    ${NSD_CreateLabel} 10% 25u 30% 12u \"Benutzername\"\n    Pop $UsernameLabel\n\n    ${NSD_CreateText} 40% 25u 40% 12u \"\"\n    Pop $UsernameInput\n\n\n    ${NSD_CreateLabel} 10% 40u 30% 12u \"Passwort\"\n    Pop $PasswordLabel\n\n    ${NSD_CreatePassword} 40% 40u 40% 12u \"\"\n    Pop $PasswordInput\n\n\n    ${NSD_CreateLabel} 0 70u 100% 35u \"Nach erfolgreicher Einrichtung der WLAN Verbindung wird der BYOD Launcher zur weiteren Einrichtung Ihres persönlichen Geräts im Browser gestartet. Geben Sie im nachfolgenden Eingabefeld einen Anzeigenamen für die Verwendung des BYOD Launcher ein. Dieser Anzeigename ist frei wählbar, sollte Sie jedoch angemessen identifizieren.\"\n\n    ${NSD_CreateLabel} 10% 110u 30% 12u \"Anzeigename\"\n    Pop $DisplaynameLabel\n\n    ${NSD_CreateText} 40% 110u 40% 12u \"\"\n    Pop $DisplaynameInput\n\n    nsDialogs::Show\n    \nFunctionEnd\n\nFunction myPageLeave\n\n    ${NSD_GetText} $UsernameInput $Username\n    ${NSD_GetText} $PasswordInput $Password\n    ${NSD_GetText} $DisplaynameInput $Displayname\n\nFunctionEnd\n\nFunction .onInstSuccess\n\n    Delete \"$TEMP\\SCRIPT_FILENAME\"\n    Delete \"$TEMP\\eduroam-W10-edu-zg.ch-gibz.edu-zg.ch.exe\"\n\nFunctionEnd\n\nSection\n\n    SetOutPath $TEMP\n    File \"INSTALLER_RESOURCES_PATH/eduroam-W10-edu-zg.ch-gibz.edu-zg.ch.exe\"\n    File \"SCRIPT_PATHSCRIPT_FILENAME\"\n    \n    ExecWait \'\"eduroam-W10-edu-zg.ch-gibz.edu-zg.ch.exe\" /S\'\n    \n    StrCpy $EduroamInstallSuccessful 1\n    \n    ;nsExec::ExecToStack \'\"eduroam-W10-edu-zg.ch-gibz.edu-zg.ch.exe\"\'\n    ;Pop $0  ; returnValue/error/timeout\n    ;Pop $1  ; output of installer execution\n    \n;    ${If} $0 == 0\n;        StrCpy $EduroamInstallSuccessful 1\n;        DetailPrint \"WLAN Verbindung erfolgreich eingerichtet.\"\n;    ${Else}\n;        StrCpy $EduroamInstallSuccessful 0\n;    ${EndIf}\n    \nSectionEnd'),('79A9E3F6-1FA3-42E6-9FE5-03E46F84F9BE','Drucker einrichten','Installation der Drucker am GIBZ auf dem persönlichen Gerät','34917d2d-bd78-42d8-8424-d0ebb83486ef','SimpleScriptTarget','<#\n        .SYNOPSIS\n        Silently install Printer.\n        Author:     Tobias Schmid\n        Date:       20. Mai 2020\n        Version:    1.0 \n\n        .DESCRIPTION\n        None.\n\n        .PARAMETER Name\n        None.\n\n        .PARAMETER Extension\n        None-\n\n        .INPUTS\n        None. \n\n        .OUTPUTS\n        None.\n\n        .EXAMPLE\n        None.\n\n        .LINK\n        None.\n\n        .LINK\n        None.\n    #>\n\n# Set Executionpolicy to unrestricted\n$ExecutionPolicy = Get-ExecutionPolicy\nSet-ExecutionPolicy -scope CurrentUser -ExecutionPolicy Unrestricted -Force\n\n# Replace Information from WebUI\n# RESPONSE_URL : Url, an welche der POST Request mit dem Ergebnis der Skript-Ausführung gesendet wird\n# USERNAME : Benutzername des Benutzers (muss initial durch Benutzer eingegeben werden)\n# PASSWORD : Passwort des Benutzers (muss initial durch Benutzer eingegeben werden)\n# PARTICIPANT_ID : ID des Benutzers (wird durch System vergeben)\n# TARGET_ID : ID des Skripts\n$ResponseURL = \'RESPONSE_URL\';\n$ParticipantID = \'PARTICIPANT_ID\';\n$TargetID = \'TARGET_ID\';\n\n\n\n\n\n\n\n# Send Post Request to Website BYOD from GIBZ\n# {\n#    \"success\": true,\n#    \"details\": \"Further description of state. Might be used for error codes.\",\n#    \"participantId\": \"Id of participant. Will be given in script.\",\n#    \"targetId\": \"Id of target (=task). Will be given in script.\"\n#  }\n$postParams = @{\"success\" = $true;\n    \"details\"             = \"\";\n    \"participantId\"       = \"$ParticipantID\";\n    \"targetId\"             = \"$TargetID\"\n}\n\nInvoke-WebRequest -Uri $ResponseURL -Method POST -Body ($postParams | ConvertTo-Json) -ContentType \"application/json\"\n\n# Set Executionpolicy to predefined value\n$ExecutionPolicy = Get-ExecutionPolicy\nSet-ExecutionPolicy -ExecutionPolicy $ExecutionPolicy -Force ',0,NULL),('8487BF5C-ECAC-4BA9-8D87-DB32DF7E9FE9','Installation von MS Office (lokal) ','Führt die lokal vorhandene Installationsdatei von MS Office aus um Word, Excel & Co. zu installieren.','34917d2d-bd78-42d8-8424-d0ebb83486ef','SimpleScriptTarget','<#\n        .SYNOPSIS\n        Silently install MS Office 365.\n        Author:     Tobias Schmid\n        Date:       20. Mai 2020\n        Version:    1.0 \n\n        .DESCRIPTION\n        None. \n\n        .PARAMETER Name\n        None.\n\n        .PARAMETER Extension\n        None-\n\n        .INPUTS\n        None. \n\n        .OUTPUTS\n        None.\n\n        .EXAMPLE\n        None.\n\n        .LINK\n        None.\n\n        .LINK\n        None.\n    #>\n\n# Set Executionpolicy to unrestricted\n$ExecutionPolicy = Get-ExecutionPolicy\nSet-ExecutionPolicy -scope CurrentUser -ExecutionPolicy Unrestricted -Force\n\n# Replace Information from WebUI\n# RESPONSE_URL : Url, an welche der POST Request mit dem Ergebnis der Skript-Ausführung gesendet wird\n# USERNAME : Benutzername des Benutzers (muss initial durch Benutzer eingegeben werden)\n# PASSWORD : Passwort des Benutzers (muss initial durch Benutzer eingegeben werden)\n# PARTICIPANT_ID : ID des Benutzers (wird durch System vergeben)\n# TARGET_ID : ID des Skripts\n$ResponseURL = \'RESPONSE_URL\';\n$ParticipantID = \'PARTICIPANT_ID\';\n$TargetID = \'TARGET_ID\';\n\n# download setup.exe\n$Installdir = \"c:\\Apps\\install_O365\\\"    \n$OfficeInstaller = \"$Installdir\"+\'setup.exe\'\n\n# download xml file\n# $OfficeArguments = \"$Installdir\"+\'configuration.xml\'\n\n# install O365\nStart-Process -FilePath $OfficeInstaller -ArgumentList \'/configure \'+$Installdir+\'configuration.xml\' -Wait\n\n\n\n\n\n\n\n\n# Send Post Request to Website BYOD from GIBZ\n# {\n#    \"success\": true,\n#    \"details\": \"Further description of state. Might be used for error codes.\",\n#    \"participantId\": \"Id of participant. Will be given in script.\",\n#    \"targetId\": \"Id of target (=task). Will be given in script.\"\n#  }\n$postParams = @{\"success\" = $true;\n    \"details\"             = \"\";\n    \"participantId\"       = \"$ParticipantID\";\n    \"targetId\"             = \"$TargetID\"\n}\n\nInvoke-WebRequest -Uri $ResponseURL -Method POST -Body ($postParams | ConvertTo-Json) -ContentType \"application/json\"\n\n# Set Executionpolicy to predefined value\n$ExecutionPolicy = Get-ExecutionPolicy\nSet-ExecutionPolicy -ExecutionPolicy $ExecutionPolicy -Force ',0,NULL),('ACA65895-2231-4B0F-8FA2-1189D2AAAB31','OneDrive ','Lädt das Programm OneDrive aus dem Internet herunter und installiert die Client-Applikation','34917d2d-bd78-42d8-8424-d0ebb83486ef','SimpleScriptTarget','<#\n    .SYNOPSIS\n    Silently install Microsoft OneDrive for Business with PowerShell Script.\n    Author:     Tobias Schmid\n    Date:       20. Mai 2020\n    Version:    1.0 \n\n    .DESCRIPTION\n    Silently install Microsoft OneDrive for Business with PowerShell Script.\n    Download Microsoft OneDrive for Business from https://onedrive.live.com/about/de-de/download/   \n\n    .PARAMETER Name\n    None.\n\n    .PARAMETER Extension\n    None-\n\n    .INPUTS\n    None. \n\n    .OUTPUTS\n    None.\n\n    .EXAMPLE\n    None.\n\n    .LINK\n    None.\n\n    .LINK\n    None.\n#>\n\n# Set Executionpolicy to unrestricted\n$ExecutionPolicy = Get-ExecutionPolicy\nSet-ExecutionPolicy -ExecutionPolicy Unrestricted -Force\n\n# Replace Information from WebUI\n# RESPONSE_URL : Url, an welche der POST Request mit dem Ergebnis der Skript-Ausführung gesendet wird\n# USERNAME : Benutzername des Benutzers (muss initial durch Benutzer eingegeben werden)\n# PASSWORD : Passwort des Benutzers (muss initial durch Benutzer eingegeben werden)\n# PARTICIPANT_ID : ID des Benutzers (wird durch System vergeben)\n# TARGET_ID : ID des Skripts\n$ResponseURL = \'RESPONSE_URL\';\n$ParticipantID = \'PARTICIPANT_ID\';\n$TargetID = \'TARGET_ID\';\n\n#path to download Microsoft OneDrive  for Business\n$Installdir = \"c:\\Apps\\install_OneDrive\"    \nNew-Item -Path $Installdir -ItemType directory  \n      \n# Download the installer from the Microsoft website. Check URL because it can be changed for new versions  \n$Source = \"https://go.microsoft.com/fwlink/?linkid=844652\"  \n$Destination = \"$Installdir\\OneDrive_Client.exe\"  \nInvoke-WebRequest $Source -OutFile $Destination  \n      \n# Wait for the installation to finish. I\'ve set it to 3 min. to take enough time until source of Microsoft OneDrive for Business download from internet  \nStart-Sleep -s 180  \n      \n# Start the installation of Microsoft OneDrive \nStart-Process -FilePath \"$Installdir\\OneDrive_Client.exe\"  \n    \n# Send Post Request to Website BYOD from GIBZ\n# {\n#    \"success\": true,\n#    \"details\": \"Further description of state. Might be used for error codes.\",\n#    \"participantId\": \"Id of participant. Will be given in script.\",\n#    \"targetId\": \"Id of target (=task). Will be given in script.\"\n#  }\n$postParams = @{\"success\" = $true;\n    \"details\"             = \"\";\n    \"participantId\"       = \"$ParticipantID\";\n    \"targetId\"             = \"$TargetID\"\n}\n\nInvoke-WebRequest -Uri $ResponseURL -Method POST -Body ($postParams | ConvertTo-Json) -ContentType \"application/json\"\n\n# Set Executionpolicy to predefined value\n$ExecutionPolicy = Get-ExecutionPolicy\nSet-ExecutionPolicy -ExecutionPolicy $ExecutionPolicy -Force ',0,NULL);
/*!40000 ALTER TABLE `Targets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TutorialSteps`
--

DROP TABLE IF EXISTS `TutorialSteps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TutorialSteps` (
  `Id` char(36) NOT NULL,
  `SequenceNumber` int(11) NOT NULL,
  `Title` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `Instruction` longtext CHARACTER SET utf8mb4 DEFAULT NULL,
  `TutorialTargetId` char(36) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_TutorialSteps_TutorialTargetId` (`TutorialTargetId`),
  CONSTRAINT `FK_TutorialSteps_Targets_TutorialTargetId` FOREIGN KEY (`TutorialTargetId`) REFERENCES `Targets` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TutorialSteps`
--

LOCK TABLES `TutorialSteps` WRITE;
/*!40000 ALTER TABLE `TutorialSteps` DISABLE KEYS */;
INSERT INTO `TutorialSteps` VALUES ('08d80d23-ddcb-4c65-8436-a23b6e9c703a',1,'Login ein EDUZug','<figure class=\"image image-style-side\"><img src=\"/static/e4o1nhwl.pbd.png\"><figcaption>Login-Maske auf https://gibz.zg.ch</figcaption></figure><p>&nbsp;</p><p>Um die Mobiltelefonnummer eintragen zu können, müssen Sie sich auf der Webseite https://gibz.zg.ch mit Ihren persönlichen Zugangsdaten anmelden. <strong>Diese erste Anmeldung kann nur aus dem Netzwerk (WLAN oder LAN) des GIBZ erfolgen.</strong></p><p>Geben Sie in den markierten Feldern Ihre Zugangsdaten, bestehend aus <i>Benutzername</i> und <i>Passwort</i> ein. Klicken Sie anschliessend auf den Button <i>Anmelden.</i></p>','08d80d23-dc5d-4363-8dcd-e148b41a0b8c'),('08d80d24-5991-4714-8df6-2f682bdbed82',2,'Mein schulNetz','<p>Ihre persönlichen Daten können Sie im Abschnitt <strong>Mein schulNetz</strong> bearbeiten. Klicken Sie dafür in der oberen, linken Ecke der Webseite auf die 3 vertikal angeordneten Punkte und anschliessend auf den Eintrag <i>Mein schulNetz</i>.</p><figure class=\"image\"><img src=\"/static/epqetq2h.lah.png\"><figcaption>Startseite von EDU-Zug mit Hinweisen zum Menüpunkt \"Mein schulNetz\"</figcaption></figure><p>&nbsp;</p>','08d80d23-dc5d-4363-8dcd-e148b41a0b8c'),('08d80d24-c8d5-445f-89c2-643ec254f9b6',3,'Mobilnummer eintragen','<p>Auf der Seite <i>Mein schulNetz</i> können Sie im entsprechenden Feld Ihre persönliche <strong>Mobilnummer</strong> eintragen. Prüfen Sie gleichzeitig die Korrektheit aller anderen Angaben.</p><figure class=\"image\"><img src=\"/static/jw3wqyis.ho2.png\"><figcaption>Feld \"Mobilnummer\" im Abschnitt \"Mein schulNetz\"</figcaption></figure><p>&nbsp;</p>','08d80d23-dc5d-4363-8dcd-e148b41a0b8c'),('08d80d25-0b32-4cfd-8910-8f8d7d9581e9',4,'Eingaben speichern','<p>Mit einem Klick auf den Button <i>ERFASSEN</i> können Sie die neu eingetragene bzw. geänderte Mobilnummer speichern.</p><figure class=\"image\"><img src=\"/static/k3mutf4l.zh3.png\"></figure><p>Nach der Speicherung können Sie sich bei vorhandener Internetverbindung von überall her bei EDUZug anmelden. Falls die Anmeldung von ausserhalb des GIBZ-Netzwerks erfolgt, wird zur Überprüfung Ihrer Identität ein SMS an die erfasste Mobilnummer gesendet. Den 6-stelligen Code aus diesem SMS müssen Sie bei der Anmeldung eingeben.</p>','08d80d23-dc5d-4363-8dcd-e148b41a0b8c'),('08d83e07-6858-432e-8599-a9c21ebb54a5',1,'Login in EDUZug','<figure class=\"image image-style-side\"><img src=\"/static/55e0gwid.tav.png\"><figcaption>Login-Mase auf https://gibz.zg.ch</figcaption></figure><p>Um die E-Mail Adresse eintragen zu können, müssen Sie sich auf der Webseite https://gibz.zg.ch mit Ihren persönlichen Zugangsdaten anmelden. <strong>Diese erste Anmeldung kann nur aus dem Netzwerk (WLAN oder LAN) des GIBZ erfolgen.</strong></p><p>Geben Sie in den markierten Feldern Ihre Zugangsdaten, bestehend aus <i>Benutzername</i> und <i>Passwort</i> ein. Klicken Sie anschliessend auf den Button <i>Anmelden.</i></p>','08d83e07-673d-4aa8-8da4-e643ba942d03'),('08d83e07-c2d8-435e-8235-14d50c7de7bf',2,'Mein schulNetz','<p>Ihre persönlichen Daten können Sie im Abschnitt <strong>Mein schulNetz</strong> bearbeiten. Klicken Sie dafür in der oberen, linken Ecke der Webseite auf die 3 vertikal angeordneten Punkte und anschliessend auf den Eintrag <i>Mein schulNetz</i>.</p><figure class=\"image\"><img src=\"/static/pxr5uxep.dfl.png\"><figcaption>Startseite von EDU-Zug mit Hinweisen zum Menüpunkt \"Mein schulNetz\"</figcaption></figure>','08d83e07-673d-4aa8-8da4-e643ba942d03'),('08d83e07-ec68-4263-8f94-00954765c39e',3,'E-Mail Adresse eintragen','<p>Auf der Seite <i>Mein schulNetz</i> können Sie im entsprechenden Feld Ihre persönliche <strong>E-Mail Adresse</strong> eintragen. Prüfen Sie gleichzeitig die Korrektheit aller anderen Angaben.</p><figure class=\"image\"><img src=\"/static/ert53hxv.drf.png\"><figcaption>Feld \"E-Mail\" im Abschnitt \"Mein schulNetz\"</figcaption></figure><p>Die von Ihnen eingetragene E-Mail Adresse wird innerhalb von EDUZug für den automatischen Versand von Nachrichten verwendet. Zudem wird an diese E-Mail Adresse ein Link für das Zurücksetzen Ihres Passwortes geschickt. Es ist aus diesem Grund empfehlenswert, <strong>nicht die E-Mail Adresse des GIBZ (@online.gibz.ch bzw. @gibz.ch) zu verwenden</strong>!</p><p>Falls bei Ihnen bereits eine (korrekte) E-Mail Adresse erfasst ist, müssen Sie diese nicht zwingend ändern.</p>','08d83e07-673d-4aa8-8da4-e643ba942d03'),('08d83e08-8a9b-4426-82a0-48a1233898ee',4,'Eingaben speichern','<p>Mit einem Klick auf den Button <i>ERFASSEN</i> können Sie die neu eingetragene bzw. geänderte E-Mail Adresse speichern.</p><p>Bild</p><figure class=\"image\"><img src=\"/static/ahlms3z2.wot.png\"><figcaption>Button ERFASSEN im Abschnitt \"Mein schulNetz\"</figcaption></figure><p>Denken Sie daran, sich über die drei Punkte (oben, links) und den Link Abmelden von EDUZug abzumelden, wenn Sie keine weiteren Informationen eintragen bzw. einsehen müssen.</p><p>&nbsp;</p>','08d83e07-673d-4aa8-8da4-e643ba942d03'),('08d83e29-075b-48eb-80cd-26178becb1d3',1,'Login am GIBZ Portal','<p>Um die <i>Informatikbenutzerordnung</i> und die Vereinbarung <i>sauberes GIBZ</i> zu akzeptieren, müssen Sie in Ihrem Browser die Adresse <strong>https://portal.gibz.ch/agb</strong> eintippen. Auf der Login-Seite geben Sie anschliessend Ihre persönlichen Zugangsdaten des GIBZ ein.</p><figure class=\"image\"><img src=\"/static/x35lky31.n31.png\"><figcaption>Login-Formular für das GIBZ Portal auf https://portal.gibz.ch/agb</figcaption></figure>','08d83e29-05e7-4e39-892a-2d99ccd37052'),('08d83e2a-10aa-44cc-84ca-6508942902c9',2,'Vereinbarungen akzeptieren','<p>Auf der AGB-Seite sind verschiedene Dokumente aufgelistet. Jedes aufgeführte Dokument ist durch einen Klick auf den jeweiligen Klick einsehbar.</p><figure class=\"image\"><img src=\"/static/2ti4veyh.upc.png\"><figcaption>Die beiden aktivierten Kästchen bestätigen Ihre Zustimmung zu den jeweiligen Dokumenten.</figcaption></figure><p>Drücken Sie Ihr Einverständnis mit der <strong>Informatikbenutzerordnung</strong> und der Vereinbarung <strong>sauberes GIBZ</strong> aus, indem Sie die jeweiligen Kästchen auswählen. Klicken Sie anschliessend am unteren Ende der Seite auf den Button um Ihre Zustimmung auszudrücken.</p>','08d83e29-05e7-4e39-892a-2d99ccd37052'),('08d83e2b-7065-49e5-8fe5-88c835d59da6',3,'Bestätigung','<p>Nach dem Absenden Ihrer Einverständniserklärung wird im Browser eine entsprechende Bestätigung angezeigt.Ihre Zustimmung wird auf den Systemen des GIBZ bis zur Löschung Ihres Netzwerkaccounts (nach dem Ende Ihres Ausbildungszeit am GIBZ) gespeichert.</p><figure class=\"image\"><img src=\"/static/jdcadukz.ewt.png\"><figcaption>Bestätigungsseite mit Links für weitere Aktionen.</figcaption></figure><p>Auf der Bestätigungsseite finden Sie zudem zwei weitere Links zur Seite für die Änderung Ihres Passwortes bzw. für die Abmeldung.</p>','08d83e29-05e7-4e39-892a-2d99ccd37052'),('08d83f63-a82e-4c44-895f-68aed3e49a5d',1,'Login','<p>Öffnen Sie einen Browser (Chrome, Firefox, Edge, Safari) und geben Sie in der Adressleiste die Adresse <strong>https://portal.office.com</strong> ein. Auf dieser Seite finden Sie ein Login-Formular für die Eingabe Ihres Benutzernamens.</p><p>Wenn Sie kein Login-Formular sehen, sind Sie möglicherweise noch mit einem anderen Microsoft-Account angemeldet. Melden Sie sich in diesem Fall mit dem anderen Account ab.</p><p>Ihr Benutzername für Office 365 entspricht einer E-Mail Adresse und besteht aus Ihrem Benutzernamen des GIBZ sowie einem Domainnamen (nach dem <i>@</i>-Zeichen).</p><ul><li>Für Lernende: hmuster<strong>@online.gibz.ch</strong></li><li>Für Lehrpersonen: hmuster<strong>@gibz.ch</strong></li></ul><p>&nbsp;</p><figure class=\"table\"><table><tbody><tr><td><figure class=\"image\"><img src=\"/static/keo0sngi.q5j.png\"><figcaption>Erster Schritt beim Login: Eingabe des Benutzernamens</figcaption></figure></td><td><figure class=\"image\"><img src=\"/static/embn4mjq.iqn.png\"><figcaption>Zweiter Schritt beim Login: Eingabe des Passwortes</figcaption></figure></td></tr></tbody></table></figure><p>Geben Sie im Login-Formular zuerst Ihren Benutzernamen ein, klicken Sie anschliessend auf den Button <i>Weiter</i>, geben Sie anschliessend Ihr Passwort ein und bestätigen Sie dieses mit einem Klick auf den Button <i>Anmelden</i>.</p>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c'),('08d83f64-d488-4c68-81f6-c02938600b60',2,'Weitere Informationen erforderlich','<p>Beim ersten Login in Office 365 werden Sie darauf hingewiesen, dass für den Schutz Ihres Accounts weitere Informationen benötigt werden. Bestätigen Sie den entsprechenden Hinweis mit einem Klick auf den Button <i>Weiter</i>.</p><figure class=\"image\"><img src=\"/static/qnowxgwa.gjb.png\"><figcaption>Weitere Informationen erforderlich: Bestätigen mit dem Button</figcaption></figure>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c'),('08d83f65-3dbd-49c0-86f4-9b9770a248e2',3,'Eingabe von mindestens einer Information','<p>Auf der nächsten Seite finden Sie eine Erklärung, dass Sie für die Sicherheit Ihres Kontos zwei mögliche Informationen erfassen können:</p><ul><li>Ihre persönliche Handynummer</li><li>Ihre private E-Mail Adresse</li></ul><p>Sie müssen mindestens eine Information erfassen. Optional können Sie auch beide Angaben (Handynummer <i>und</i> E-Mail Adresse) eintragen.</p><p>Wenn Sie Ihr Handy griffbereit haben, empfehlen wir Ihnen die Eingabe Ihrer Handynummer. Dies ist meist einfacher, weil Sie dann keinen Zugriff auf Ihr privates E-Mail Konto benötigen.</p><figure class=\"image\"><img src=\"/static/4cgsn5of.5nz.png\"></figure><p>Wenn Sie die Handynummer nicht eintragen können oder möchten, können Sie den nächsten Schritt (Eingabe der Handynummer) überspringen und stattdessen anschliessend Ihre E-Mail Adresse eintragen.</p>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c'),('08d84005-e5ee-4156-8456-67d3a05a0183',4,'Eingabe der Handynummer (Teil 1)','<p>Um Ihre Handynummer einzutragen, klicken Sie auf den <strong>ersten</strong> Link: <strong>Jetzt einrichten</strong>.</p><figure class=\"image\"><img src=\"/static/ds1uutm3.pkr.png\"><figcaption>Zwei Möglichkeiten zur Sicherung des Accounts.</figcaption></figure><p>&nbsp;</p>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c'),('08d84006-7f2b-4cbf-87a7-775eed8a8971',5,'Eingabe der Handynummer (Teil 2)','<p>Auf der nächsten Seite ist die Ländervorwahl für Schweizer Telefonnummern bereits vorausgewählt. Korrigieren Sie diese Vorwahl falls nötig.</p><p>Im leeren Feld unterhalb der Vorwahl können Sie Ihre <strong>Handynummer ganz normal (beginnend mit 07x) eintragen</strong>.</p><p>Klicken Sie anschliessend auf den Button <strong>SMS an mich</strong> um ein SMS mit einem 6-stelligen Code zu erhalten.</p><figure class=\"image\"><img src=\"/static/cmbjhm4j.w4k.png\"><figcaption>Eingabe der persönlichen Handynummer</figcaption></figure><p>&nbsp;</p>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c'),('08d84007-4605-4dfe-8102-5066a2d6bfb7',6,'Eingabe der Handynummer (Teil 3)','<p>Nach dem vorherigen Schritt erhalten Sie innerhalb einer Minute ein SMS vom Absender Microsoft. Dieses SMS enthält einen 6-stelligen Bestätigungscode.</p><p>Bestätigen Sie nun Ihre Handynummer, indem Sie diesen <strong>Code in das neue Feld eingeben</strong> und anschliessend auf den Button <strong>Überprüfen</strong> klicken.</p><figure class=\"image\"><img src=\"/static/zisdxzun.qav.png\"><figcaption>Eingabe des 6-stelligen Bestätigungscodes</figcaption></figure><p>Sie werden anschliessend auf die Ihnen bereits bekannte Seite weitergeleitet. Dort können Sie optional auch noch Ihre persönliche E-Mail Adresse eintragen.</p>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c'),('08d84007-b177-42d3-87ac-eb5ce10585c6',7,'E-Mail Adresse bestätigen (Teil 1)','<p><i>Falls Sie bereits Ihre Handynummer erfolgreich eingetragen haben, ist das Eintragen Ihrer E-Mail Adresse freiwillig.</i></p><p>Um Ihre E-Mail Adresse einzutragen, klicken Sie auf den <strong>zweiten</strong> Link: <strong>Jetzt einrichten</strong>.</p><figure class=\"image\"><img src=\"/static/hra1ykr4.nvh.png\"><figcaption>Zwei Möglichkeiten zur Sicherung des Accounts</figcaption></figure>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c'),('08d84008-1544-4f77-8ecb-a94449de9f79',8,'E-Mail Adresse bestätigen (Teil 2)','<p>Im leeren Feld können Sie Ihre <strong>E-Mail Adresse eintragen</strong>. Klicken Sie anschliessend auf den Button <strong>E-Mail an mich</strong> um ein E-Mail mit einem 6-stelligen Code zu erhalten.</p><figure class=\"image\"><img src=\"/static/p24sbpyr.n02.png\"><figcaption>E-Mail Adresse eintragen</figcaption></figure>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c'),('08d84008-4bad-4c92-82ee-a2f6d03c531a',9,'Eingabe der E-Mail Adresse (Teil 3)','<p>Nach dem vorherigen Schritt erhalten Sie innerhalb einer Minute ein E-Mail vom Absender Microsoft. Dieses E-Mail enthält einen 6-stelligen Bestätigungscode. Öffnen Sie den Posteingang Ihrer eingegebenen E-Mail Adresse um das E-Mail zu öffnen.</p><p>Bestätigen Sie nun Ihre E-Mail Adresse, indem Sie diesen <strong>Code in das neue Feld eingeben</strong> und anschliessend auf den Button <strong>Überprüfen</strong> klicken.</p><figure class=\"image\"><img src=\"/static/fwa4xoet.x1b.png\"><figcaption>Eingabe des 6-stelligen Bestätigungscodes</figcaption></figure>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c'),('08d84008-9087-43cb-89ab-4ffc97269461',10,'Abschluss','<p>Sie sehen nach der erfolgreichen Bestätigung nun erneut die Übersichtsseite mit der Angabe Ihrer persönlichen Informationen. Kontrollieren Sie bitte, dass <strong>mindestens 1 grünes Häckchen sichtbar ist</strong>.</p><p>Anschliessend können Sie den Prozess mit einem Klick auf den Button <strong>Sieht gut aus</strong> abschliessen und den regulären Anmeldevorgang fortsetzen.</p><figure class=\"image\"><img src=\"/static/fwr2zw12.fqv.png\"></figure>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c'),('08d84008-d8bb-42dd-8cc6-fb5e1c3f1045',11,'Angemeldet bleiben?','<p>Die Frage <i>Angemeldet bleiben?</i> werden Sie wahrscheinlich öfters sehen: Diese erscheint üblicherweise bei jeder neuen Anmeldung. Mit Ihrer Antwort können Sie bestimmen, ob Sie beim nächsten Anmeldeversuch automatisch angemeldet werden sollen (ohne erneute Eingabe von Benutzername und Passwort).</p><p><strong>Empfehlungen:</strong></p><ul><li>Wählen Sie <i><strong>Nein</strong></i>, wenn Sie an einem öffentlichen Computer arbeiten, auf welchen neben Ihnen auch andere Personen Zugriff haben.</li><li>Wählen Sie <i><strong>Ja</strong></i>, wenn Sie an Ihrem privaten Computer arbeiten.</li></ul><p>&nbsp;</p><p>Wenn Sie die Option <i>Diese Meldung nicht mehr anzeigen</i> auswählen, wird dieser Dialog in Zukunft weniger angezeigt.</p><figure class=\"image\"><img src=\"/static/f2powkhf.oyp.png\"><figcaption>Angemeldet bleiben?</figcaption></figure><p>&nbsp;</p>','08d83f63-a6ee-4cdb-8780-e301bdd6e76c');
/*!40000 ALTER TABLE `TutorialSteps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `__EFMigrationsHistory`
--

DROP TABLE IF EXISTS `__EFMigrationsHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId` varchar(95) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__EFMigrationsHistory`
--

LOCK TABLES `__EFMigrationsHistory` WRITE;
/*!40000 ALTER TABLE `__EFMigrationsHistory` DISABLE KEYS */;
INSERT INTO `__EFMigrationsHistory` VALUES ('20200423095319_InitialMigration','3.1.3'),('20200515123330_AddConnectionId','3.1.3'),('20200518190917_AddTargetResultTimestamp','3.1.3'),('20200519044506_NullableCategoryForTarget','3.1.3'),('20200521124138_AddCurrentStageNumberToSession','3.1.3'),('20200522142301_AddRequiresCredentialsToTarget','3.1.3'),('20200811054651_AddNsisScriptToSimpleScriptTarget','3.1.3');
/*!40000 ALTER TABLE `__EFMigrationsHistory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;