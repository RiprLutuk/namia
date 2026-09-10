-- MySQL dump 10.16  Distrib 10.1.31-MariaDB, for osx10.6 (i386)
--
-- Host: localhost    Database: syarfi_web
-- ------------------------------------------------------
-- Server version	10.1.31-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_documentation`
--

DROP TABLE IF EXISTS `activity_documentation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_documentation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `photo` varchar(96) NOT NULL,
  `notes` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_documentation`
--

LOCK TABLES `activity_documentation` WRITE;
/*!40000 ALTER TABLE `activity_documentation` DISABLE KEYS */;
INSERT INTO `activity_documentation` VALUES (1,'4.jpg','Foto #1'),(2,'5.jpg','Foto #2'),(3,'6.jpg','Foto #3'),(4,'7.jpg','Foto #4');
/*!40000 ALTER TABLE `activity_documentation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `content` text NOT NULL,
  `photo` varchar(128) NOT NULL,
  `id_user` int(11) NOT NULL,
  `date_post` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `blog_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
INSERT INTO `blog` VALUES (1,'Bekerja di Syarfi','Bekerja di Syarfi sangat menyenangkan. Karena bekerja di Syarfi sangat menyenangkan. Bekerja di Syarfi sangat menyenangkan. Karena bekerja di Syarfi sangat menyenangkan. Bekerja di Syarfi sangat menyenangkan. \r\nKarena bekerja di Syarfi sangat menyenangkan. Bekerja di Syarfi sangat menyenangkan. Karena bekerja di Syarfi sangat menyenangkan. Bekerja di Syarfi sangat menyenangkan. Karena bekerja di Syarfi sangat menyenangkan. ','2.jpg',1,'2018-05-31 11:02:31'),(2,'Kerjasama Syarfi dengan Pitchmotions','Syarfi bekerjasama dengan Pitchmotions untuk membangun website perusahaan. Hal ini dilakukan karena Syarfi bekerjasama dengan Pitchmotions. Syarfi bekerjasama dengan Pitchmotions untuk membangun website perusahaan. Hal ini dilakukan karena Syarfi bekerjasama dengan Pitchmotions. \r\nSyarfi bekerjasama dengan Pitchmotions untuk membangun website perusahaan. Hal ini dilakukan karena Syarfi bekerjasama dengan Pitchmotions. Syarfi bekerjasama dengan Pitchmotions untuk membangun website perusahaan. Hal ini dilakukan karena Syarfi bekerjasama dengan Pitchmotions. ','3.jpg',1,'2018-05-31 11:02:39');
/*!40000 ALTER TABLE `blog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `picture` varchar(96) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'Siskem','2_siskem.jpg'),(2,'Simpatindo','3_simpatindo.jpg'),(3,'Kopegtel','6_kopegtel.jpg'),(4,'Global Tri Star','10_global_tri_star.jpg'),(5,'Strivechem','14_strivechem.jpg'),(6,'An Najah Solution','annsi.jpg'),(7,'Awina Sinergi','awina_sinergi.png'),(8,'BPRS Al Salaam','bprs-alsalaam.png'),(9,'Bukalapak','bukalapak.png'),(10,'Capsugel','capsugel.jpg');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comp_awards`
--

DROP TABLE IF EXISTS `comp_awards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comp_awards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(96) NOT NULL,
  `image` varchar(128) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comp_awards`
--

LOCK TABLES `comp_awards` WRITE;
/*!40000 ALTER TABLE `comp_awards` DISABLE KEYS */;
INSERT INTO `comp_awards` VALUES (1,'Pemberi Penghargaan #1','awards_1.jpg','Penghargaan dari Pemberi #1 terkait Syariah Fintech terbaik'),(2,'Pemberi Penghargaan #2','awards_2.jpg','Penghargaan dari Pemberi #2 terkait Produk Fintech terbaik'),(3,'Pemberi Penghargaan #3','awards_3.jpg','Penghargaan dari Pemberi #3 terkait Syariah Fintech terbaik');
/*!40000 ALTER TABLE `comp_awards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comp_documentation`
--

DROP TABLE IF EXISTS `comp_documentation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comp_documentation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `photo` varchar(128) NOT NULL,
  `notes` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comp_documentation`
--

LOCK TABLES `comp_documentation` WRITE;
/*!40000 ALTER TABLE `comp_documentation` DISABLE KEYS */;
/*!40000 ALTER TABLE `comp_documentation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_faqcat` int(11) NOT NULL,
  `question` varchar(512) NOT NULL,
  `answer` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_faqcat` (`id_faqcat`),
  CONSTRAINT `faq_ibfk_1` FOREIGN KEY (`id_faqcat`) REFERENCES `faq_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
INSERT INTO `faq` VALUES (1,1,'Informasi atau dokumen apa sajakah yang dibutuhkan untuk pengajuan pinjaman?','<b>Pertama</b>, dokumen yang dibutuhkan oleh pengguna dana yang bekerja sebagai karyawan adalah :<br/>\r\n    a. KTP pengguna dana<br/>\r\n    b. Kartu keluarga<br/>\r\n    c. NPWP<br/>\r\n    d. SK pengangkatan pegawai / surat keterangan bekerja<br/>\r\n    e. Slip Gaji bulan terakhir<br/>\r\n    f. Rekening Koran 3 bulan terakhir<br/><br/>\r\n<b>Kedua</b>, dokumen yang dibutuhkan oleh pengguna dana yang berwirausaha perorangan :<br/>\r\n    a. KTP pengguna dana<br/>\r\n    b. Kartu keluarga<br/>\r\n    c. NPWP<br/>\r\n    d. Surat izin usaha perdagangan (SIUP)/surat keterangan usaha (SKU)<br/>\r\n    e. Laporan keuangan minimal 1 tahun terakhir namun akan diutamakan jika dapat memberikan laporan keuangan 2 tahun terakhir<br/>\r\n    f. Rekening Koran 3 bulan terakhir<br/><br/>\r\n<b>Ketiga</b>, dokumen yg dibutuhkan oleh pengguna dana yang bekerja professional:<br/>\r\n    a. KTP pengguna dana<br/>\r\n    b. Kartu keluarga<br/>\r\n    c. NPWP<br/>\r\n    d. Surat izin praktek<br/>\r\n    e. Laporan keuangan minimal 1 tahun terakhir namun akan diutamakan jika dapat memberikan laporan keuangan 2 tahun terakhir / slip gaji bila bekerja<br/>\r\n    f. Rekening koran 3 bulan terakhir<br/><br/>\r\n<b>Keempat</b>, dokumen yang dibutuhkan oleh pengguna dana yang berbadan hukum :<br/>\r\n    a. KTP Direktur Utama<br/>\r\n    b. NPWP Direktur Utama<br/>\r\n    c. Legalitas perusahaan <br/>\r\n    d. NPWP Perusahaan<br/>\r\n    e. Laporan keuangan minimal 1 tahun terakhir, namun akan diutamakan jika dapat memberikan laporan keuangan 2 tahun terakhir.<br/>'),(2,1,'Apa itu Pembiayaan Syarfi?','Pembiayaan dengan konsep Crowdfunding Syariah yang menghubungkan antara pemilik dana dengan pengguna dana dengan produk - produknya seperti : pembiayaan barang,jasa,usaha dan social.'),(3,1,'Berapa lama proses untuk mendapatkan pembiayaan Syarfi?','Proses analisis, seleksi, dan persetujuan oleh Syarfi akan memakan waktu maksimal 4 hari kerja setelah seluruh persyaratan dokumen dinyatakan lengkap, yang selanjutnya akan melalui masa penawaran/crowdfunding selama maksimal 14 hari.'),(4,1,'Berapa Biaya Administrasi yang dikenakan oleh Syarfi?','Biaya yang dikenakan oleh Syarfi adalah2-6% dari jumlah total pembiayaan '),(5,1,'Dapatkah melakukan pembiayaan baru apabila pembiayaan saya sebelumnya di Syarfi belum lunas?','Pembiayaan sebelumnya harus dilunasi terlebih dahulu'),(6,1,'Apakah ada biaya pendaftaran untuk mengajukan aplikasi pembiayaan di Syarfi?','Tidak ada biaya pendaftaran ketika hendak mengajukan aplikasi baik itu untuk investasi maupun pembiayaan.'),(7,2,'Bagaimanakah perhitungan pelunasan hutang?','Pelunasan dihitung berdasarkan jumlah pembiayaan, tenor dan margin yang disepakati.'),(8,2,'Apakah saya wajib memilik pinjaman pribadi/ Personal Guarantor  (PG)?','Tidak diperlukan memiliki pinjaman pribadi.'),(9,2,'Kapan cicilan pelunasan hutang dimulai?','Cicilan dimulai pada saat tanggal akad ditandatangani di bulan berikutnya.'),(10,2,'Bisakah kita membayar angsuran sebelum tanggal pembayaran yang ditentukan?','Tentu saja bisa'),(11,2,'Untuk pelayanan pasca persetujuan pembayaran, bagaimana cara penerima pembiayaan menghubungi Syarfi?','Penerima pembayaran dapat menghubungi syarfi melalui contact person CS yang terdapat di website syarfi atau no telephone CS Syarfi.'),(12,3,'Biaya apa saja yang dikenakan?','Biaya yang dikenakan adalah biaya administrasi dan biaya asuransi.'),(13,3,'Apakah pengguna dana dapat melakukan pelunasan dipercepat?','Ya tentu saja. Syarfi akan mendukung jika pengguna dana dapat melakukan pelunasan dipercepat.'),(14,3,'Apakah akan dikenakan biaya bila melakukan pelunasan dipercepat?','Tidak, yang dihitung adalah hanya sisa pokoknya saja.'),(15,4,'Apa kegiatan usaha Syarfi?','Syarfi merupakan platform digital yang mempertemukan antara Pemberi Dana (investor) dengan Pengguna Dana (Borrower)'),(16,4,'Bagaimana Syarfi menilai kelayakan pembiayaan?','Syarfi melakukan analisis, seleksi, dan persetujuan terhadap seluruh calon pengguna dana beserta pembiayaan yang dilakukan dengan sistem credit scoring modern, sehingga hanya pembiayaan yang berkualitas tinggi yang  akan ditawarkan kepada pemilik dana.'),(17,5,'Bagaimana cara mendaftarkan diri menjadi Investor?','Silahkan mendaftarakan diri di website Syarfi atau di aplikasi mobile Syarfi.'),(18,5,'Apakah saya bisa mendaftar sebagai Investor dan Pengguna Dana, atau sebagai mitra, secara bersamaan?','Setiap akun yang terdaftar dapat menjadi pemilik danaatau pengguna dana atau mitra secara besamaan dalam platform Syarfi'),(19,5,'Bagaimana agar saya mendapat bantuan untuk proses pendaftaran?','Jika borrower atau investor mengalami kesulitan dalam proses pendaftaran silahkan menghubungi CS live kami.'),(20,5,'Apa saja syarat untuk menjadi pemilik dana?','Anda harus berusia minimal 18 tahun. Warga Negara Indonesia dan asing diperbolehkan untuk menjadi pemilik dana, terlepas dari lokasi tempat tinggal Anda.Untuk mendukung pencegahan money laundering yang dilakukan oleh pemerintah, Anda diharuskan untuk memberikan data KTP / Passport.'),(21,5,'Biaya apa saja yang dikenakan kepada pemilik dana?','Selama pendaftaran, Syarfi tidak mengenai biaya pendaftaran. Biaya sebesar 1% hanya akan dikenakan setiap Anda menerima repayment atas pendanaan yang anda lakukan.'),(22,6,'Bagaimana cara saya memulai pendanaan UKM?','Pendanaan dapat di mulai dengan melalukan investasi sebesar Rp. 500.000,-, Anda dapat memulai aktivitas pendanaan UKM. Untuk melihat pilihan UKM yang sedang dalam proses pengumpulan dana, silahkan login ke akun Syarfi dan klik menu \"Market Place Investor\".'),(23,6,'Kemanakah pendanaan saya disalurkan?','Anda akan mendanai UKM yang sudah di nilai potensial yang di Indonesia. Pinjaman yang diberikan akan digunakan untuk kegiatan bisnis, seperti talangan modal usaha, dan uang muka untuk proyek baru. Detail pembiayaan dapat dilihat pada halaman “market place investor”.'),(24,6,'Apakah saya dapat mengetahui UKM mana yang saya pinjamkan?','Bisa, kami dapat memberikan informasi jenis usaha dan performanya.'),(25,6,'Berapa nominal pendanaan per pembiayaan?','Nominal pendanaan per pembiayaan adalah sebesar Rp 500.000,-.'),(26,6,'Berapa deposit minimum yang harus diberikan?','Untuk menjadi pemilik dana di Syarfi, minimum anda dapat mendepositkan dana anda sebesar Rp. 500.000,-'),(27,6,'Berapa perkiraan imbal hasil dari pendanaan yang saya lakukan?','Imbal hasil yang diperoleh akan berbeda, bergantung dari jenis pembiayaan yang akan dibiayai.'),(28,6,'Apakah pendapatan profit yang saya miliki dikenakan pajak?','Iya PPh pasal 4 ayat (2) dipotong dan disetor oleh perusahaan kami, karena menurut perundang-undangan pajak yang berlaku setiap penambahan pendapatan yang dimiliki wajib pajak akan dikenakan pajak.'),(29,6,'Berapa lama jangka waktu pendanaan/crowdfunding?','Semua pembiayaan akan dipublikasi dan melalui masa pengumpulan dana/crowdfunding selama  maksimal 14 hari. Untuk setiap pembiayaan,, Syarfi akan memberikan notifikasi melalui email kepada pemilik dana mengenai informasi pembiayaan baru. Jika selama masa pengumpulan dana, target dana belum terpenuhi seluruhnya, maka Syarfi akan memberikan pilihan kepada pengguna dana untuk dapat memperpanjang durasi masa pengumpulan dana.  Namun jika setelah melalui penambahan durasi, target dana yang masih belum juga terpenuhi, maka Syarfi akan melakukan analisis lebih lanjut untuk menentukan apakah dana yang telah terkumpul akan disalurkan atau dibatalkan.'),(30,6,'Seberapa aman pendanaan pembiayaan di platform Syarfi?','Syarfi akan melakukan analisis, seleksi, dan persetujuan terhadap seluruh calon pengguna dana beserta pembiayaan yang dilakukan dengan sistem credit scoring modern, sehingga hanya pembiayaan yang berkualitas tinggi yang  akan ditawarkan kepada pemilik dana. \r\nSyarfi juga sangat menjunjung tinggi nilai transparansi dan bebas gharar, dengan mencantumkan informasi seputar pengguna dana serta syarat dan ketentuan pembiayaan di platform Syarfi.\r\nSejak November 2017,Syarfi telah terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK), yang artinya Syarfi telah memenuhi standar pemerintah dari segi sistem elektronik, mitigasi risiko, kelayakan sumber daya manusia, dan infrastruktur operasional lainnya untuk menjalankan bisnis.'),(31,6,'Apa saja resiko yang terdapat dalam pendanaan pembiayaan di platform Syarfi?','Setiap hal yang kita lakukan pasti memiliki resiko baik kecil ataupun besar. Dalam pendanaan pembiayaan Syarfi, resiko bisa dinilai kecil karena kami sangat ketat dalam melakukan penilaian terhadap pengguna dana. Adapun resiko yang muncul diantaranya adalah keterlambatan pembayaran dan kegagalan pembayaran oleh pengguna dana.'),(32,6,'Bagaimana bila Syarfi mengalami kebangkrutan?','Penting untuk diketahui bahwa tidak ada yang abadi di dunia ini. Sebagai contoh yang fenomenal adalah Lehman Brothers yang sudah berusia ratusan tahun dan menjadi korban dari krisis Subprime Mortgage. Jika hal tersebut terjadi kepada kami, kami akan tetap memprioritaskan kewajiban kami semampunya kepada investor.Dan perlu diingat bahwa akad kami kepada investor adalah mudarabah mukayadah yang artinya investor dan perusahaan kami sama sama menanggung untung dan rugi.'),(33,6,'Apa saya dapat membatalkan pendanaan yang telah di proses?','Tidak bisa.'),(34,6,'Mengapa kadang ada jarak waktu antara selesainya proses crowdfunding atau pendanan tuntas berubah menjadi pinjaman aktif?','tidak ada yang terjadi'),(35,7,'Bagaimana cara saya melakukan penarikan dana?','Investor dengan mudah bisa menarik uang mereka dari escrow account dari acount syarfi; fitur informasi mengenai saldo dan instruksi cara menarik uang ini tertera di dashboard setiap investor.'),(36,7,'Apa yang terjadi ketika pelunasan dilakukan lebih awal oleh Lender?','Jika borrower akan melakukan penarikan dana, silahkan melakukan penarikan pada bank Virtual Account yang sudah di tunjuk oleh Syarfi.'),(37,7,'Apa yang terjadi ketika pelunasan terlambat dilakukan oleh Lender?','Tidak ada yang terjadi'),(38,8,'Apakah alternative Investasi dari Syarfi dijamin  atau di asuransikan?','Iya, karena setiap dana yang diberikan untuk diinvestasikan memiliki asuransi Jiwa kredit yang tidak kami informasikan kepada pengguna dana dengan bertujuan untuk tidak disepelekan oleh pengguna dana dalam hal pembayaran angsuran terlebih hal tersebut menyangkut kepentingan pemilik dana, sehingga setiap ada yang macet pembayaran angsurannya, maka pihak asuransi akan memback-up untuk membayar angsuran kepada Pemilik dana.'),(39,8,'Apakah kegiatan operasional Syarfi diatur oleh pemerintah?','Tentu saja, hal ini bisa dilihat pada POJK Nomor 77 tahun 2016, POJK Nomor 12 tahun 2016, POJK Nomor 76 tahun 2016 dan permenkominfo terkait dalam perlindungan data privasi, sehingga seluruhnya kegiatan kami diawasi dan di regulasikan oleh OJK dan Kemenkominfo serta BI dalam hal kegiatan usaha kami.'),(40,9,'Bagaimana cara mendaftarkan diri menjadi pemilik dana?','Syarat menjadi pemilik dana dengan mendaftarkan diri di website syarfi atau di aplikasi mobile Syarfi.'),(41,9,'Apa saja syarat untuk menjadi pemilik dana?','Anda harus berusia minimal 18 tahun. Warga Negara Indonesia dan asing diperbolehkan untuk menjadi pemilik dana, terlepas dari lokasi tempat tinggal Anda.Untuk mendukung pencegahan money laundering yang dilakukan oleh pemerintah, Anda diharuskan untuk memberikan data KTP / Passport.'),(42,9,'Berapa perkiraan imbal hasil dari pendanaan yang saya lakukan?','Imbal hasil yang diperoleh akan berbeda, bergantung dari jenis pembiayaan yang akan dibiayai.'),(43,9,'Kapan saya bisa mengetahui pembayaran di angsuran pembiayaan saya di akun saya?','Pembiayaan angsuran dapat di ketahui dan di mulai ketika pengajuan sudah di terima dan sudah di cairkan.'),(44,10,'Apa itu Invoice Financing Syarfi?','Pembiayaan dengan jaminan invoice, dimana pembiayaan tersebut dapat membantu para pebisnis untuk mendapatkan fleksibilitas lebih dalam dalam mengelola arus kasnya dengan menggunakan akad mudharabah.'),(45,10,'Bagaimana Syarfi menilai kelayakan invoice yang akan dibiayai?','Syarfi akan melakukan pengujian dan analisa yang ketat untuk mengevaluasi setiap pembiayaan invoice financing. Syarfi menggunakan sistem credit scoring modern yang menggabungkan metode institusi keuangan konvensional dengan metode inovatif dan modern, sehingga hanya pembiayaan yang berkualitas yang akan ditawarkan kepada pemilik  dana.  '),(46,10,'Bagaimana saya bisa mendanai Invoice Financing?','Silahkan mendaftarakan diri di website Syarfi atau di aplikasi mobile Syarfi dan pilih pembiayaan Invoice Financing.'),(47,10,'Berapa banyak pilihan tenor yang tersedia?','Tenor yang tersedia untuk pembiayaan invoice ini adalah 1-12 bulan.'),(48,10,'Berapa tingkat pengembalian yang diberikan?','Tingkat pengembalian yang ditawrkan tergantung pada berapa besar nisbah bagi hasil yang ditawarkan oleh pengguna dana.'),(49,10,'Seberapa amankah produk invoice financing ini?','Produk invoice financing ini memiliki kelebihan antara lain sudah terjalin hubungan yang baik antara pemilik dana dengan pihak lainnya (klien/supplier/distributor/lainnya) sehingga dapat menurunkan tingkat resiko. Namun, syarfi tetap akan melakukan penilaian dan pengujian yang ketat terhadap pembiayaan produk invoice financing. Setelah pembiayaan tersebut telah dilaksanakan, Syarfi akan membantu untuk memantau dan mengingatkan pengguna dana untuk melakukan pengembalian pembiayaan secara tepat waktu. Namun yang perlu diperhatikan bahwa resiko keterlambatan  dan kegagalan pembayaran dari pengguna da tetap ada.'),(50,10,'Berapakah pendanaan minimal untuk produk invoice  financing ini?','Pendanaan minimal adalah Rp. 500.000 .'),(51,10,'Apa saja biaya yang dibutuhkan untuk produk invoice financing ini?','Biaya sebesar 1% hanya akan dikenakan setiap Anda menerima repayment atas pendanaan yang anda lakukan.'),(52,11,'Bagaimana proses penandatanganan kontrak untuk Investor?','Penandatanganan dilakukan secara digital, yang akan diinstruksikan ketika sudah disetujui, ketika sudah ditandatangani maka baru perjanjian atau akad bisa diunduh dalam bentuk PDF yang terkunci sehingga tidak bisa diedit atau di convert lagi. Secara hukum hal tersebut dianggap sah mengingat tandatangan digital diatur dalam UU no. 11 tahun 2008 tentang ITE.'),(53,11,'Bagaimana proses penandatanganan kontrak untuk penerima pinjaman?','Penandatanganan dilakukan secara digital, yang akan diinstruksikan ketika sudah disetujui, ketika sudah ditandatangani maka baru perjanjian atau akad bisa diunduh dalam bentuk PDF yang terkunci sehingga tidak bisa diedit atau di convert lagi. Untuk penerima dana disesuaikan dengan produk apa yang pengguna dana ajukan dan sistem hanya menunjukkan klausula khusus dalam akad.'),(54,11,'Seberapa aman informasi pribadi saya?','Kami memahami bahwa menyelesaikan transaksi online membutuhkan tingkat kepercayaan yang cukup tinggi. Kami menangani masalah kepercayaan ini dengan sangat serius dan menempatkannya dalam prioritas tertinggi, untuk memastikan keamanan dan kerahasiaan informasi yang Anda sediakan. Syarfi menggunakan teknologi SSL (lapisan soket aman) standar industri untuk melindungi setiap interaksi Anda dengan kami.'),(55,11,'Bagaimana cara untuk mengubah informasi dalam akun saya?','anda dapat mengubah akun informasi dengan cara masuk ke profile > pilih setting > lalu anda dapat mengubah informasi akun yang anda miliki. Jika sudah pilih tombol save.'),(56,11,'Bagaimana jika saya lupa password?','jika Anda lupa pasword maka anda silahkan click link forgot password, lalu masukkan email anda > click send request > maka secara otomatis kami akan mengirimkan password anda melalui email aktif yang sudah terdaftar di acount syarfi.');
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq_categories`
--

DROP TABLE IF EXISTS `faq_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faq_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `description` varchar(256) NOT NULL,
  `is_investor` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq_categories`
--

LOCK TABLES `faq_categories` WRITE;
/*!40000 ALTER TABLE `faq_categories` DISABLE KEYS */;
INSERT INTO `faq_categories` VALUES (1,'Aplikasi','FAQ terkait aplikasi bagi peminjam',0),(2,'Pelunasan','FAQ terkait pelunasan bagi peminjam',0),(3,'Pembiayaan ','FAQ terkait pembiayaan bagi peminjam',0),(4,'Umum','FAQ terkait umum bagi investor',1),(5,'Aplikasi','FAQ terkait aplikasi bagi investor',1),(6,'Pendanaan','FAQ terkait Pendanaan bagi investor',1),(7,'Pelunasan','FAQ terkait pelunasan bagi investor',1),(8,'Regulasi','FAQ terkait regulasi bagi investor',1),(9,'Pertanyaan Umum','FAQ terkait pertanyaan umum bagi investor',1),(10,'Invoice Financing','FAQ terkait invoice financing bagi investor',1),(11,'Administrasi','FAQ terkait administrasi bagi investor',1);
/*!40000 ALTER TABLE `faq_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `main_stats`
--

DROP TABLE IF EXISTS `main_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `main_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(48) NOT NULL,
  `amount` int(10) unsigned NOT NULL,
  `unit` varchar(8) NOT NULL,
  `icon` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_stats`
--

LOCK TABLES `main_stats` WRITE;
/*!40000 ALTER TABLE `main_stats` DISABLE KEYS */;
INSERT INTO `main_stats` VALUES (1,'Dana Tersalurkan',2446,'M','icon-money'),(2,'Pembiayaan Terbantu',1034,'','icon-tag'),(3,'Pengguna Aktif',1412,'','icon-user'),(4,'Jumlah Akun Aktif',380,'','icon-group'),(5,'Jumlah Klien Personal',122,'Person','icon-user');
/*!40000 ALTER TABLE `main_stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_coverage`
--

DROP TABLE IF EXISTS `media_coverage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_coverage` (
  `id` int(11) NOT NULL,
  `media_name` varchar(32) NOT NULL,
  `media_logo` varchar(64) NOT NULL,
  `article` text NOT NULL,
  `link` varchar(192) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_coverage`
--

LOCK TABLES `media_coverage` WRITE;
/*!40000 ALTER TABLE `media_coverage` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_coverage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `missions`
--

DROP TABLE IF EXISTS `missions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `missions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL,
  `content` text NOT NULL,
  `icon` varchar(32) NOT NULL,
  `color` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missions`
--

LOCK TABLES `missions` WRITE;
/*!40000 ALTER TABLE `missions` DISABLE KEYS */;
INSERT INTO `missions` VALUES (1,'Visi','Menjadi perusahaan berkelas dunia pada bidang teknologi finansial berbasis syariah','icon-group','#1abc9c'),(2,'Misi','<ul><li>Memanusiawikan Layanan Finansial</li><li>Memberikan langkah yang mudah untuk memenuhi kebutuhan konsumen</li><li>Memberikan layanan terbaik melalui peningkatan kualitas dalam semua aspek operasional</li></ul>','icon-cog','#34495e'),(3,'Nilai','<ul><li>Ibadah</li><li>Kepercayaan</li><li>Kebahagiaan</li></ul>','icon-thumbs-up','#e74c3c');
/*!40000 ALTER TABLE `missions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personil`
--

DROP TABLE IF EXISTS `personil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personil` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(64) NOT NULL,
  `job_level` int(11) NOT NULL,
  `job_title` varchar(48) NOT NULL,
  `biography` text NOT NULL,
  `photo` varchar(128) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personil.id_user` (`id_user`),
  CONSTRAINT `personil_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personil`
--

LOCK TABLES `personil` WRITE;
/*!40000 ALTER TABLE `personil` DISABLE KEYS */;
INSERT INTO `personil` VALUES (1,'Krisna S. Gunawan',3,'Director','                                      Alumni Institut Teknologi Bandung, Nagoya University, University of Twente dan Queensland University of Technology. Berpengalaman lebih dari 13 tahun pada bidang technopreneurship.                                    ','p_krisna_sq.jpeg',1),(2,'Ramzi A. Zuhdi',2,'President Commissioner','Menyelesaikan studi formal di Fakultas Ekonomi Universitas Gadjah Mada (Jurusan Akuntansi) dan Economic Faculty, Iowa  State University, Ames Iowa USA. Beliau berpengalaman bekerja (umumnya sebagai pengawas bank) di Bank Indonesia selama lebih dari 30 tahun. Beliau juga berpengalaman sebagai Assessor Profesi Perbankan selama 7 tahun dan menjadi Komisaris perbankan syariah di Indonesia selama 8 tahun.','p_ramzi_sq.jpeg',NULL),(3,'Syauki',3,'CEO','Lulusan dari Kimia Institut Teknologi Bandung dan melanjutkan studinya di Nanyang Techonological University (Singapore). Berpengalaman selama lebih dari dua puluh tahun di berbagai perusahaan dan sektor technopreneurship','p_syauqi_sq.jpg',NULL),(4,'Kuseryansyah',2,'Commissioner','Alumni dari Universitas Padjajaran Bandung dan IPMI International Business School. Serta tekah berpengalaman lebih dari 22 tahun di industri Non Bank (Conventional) di Indonesia.','p_kuseryansyah_sq.jpeg',NULL),(8,'Wuliandari Tri Putri',4,'Head of Lending & Collection','Setelah menyelesaikan study di Institut Pertanian Bogor, Putri berkarir pada bidang perbankan di Indonesia selama 2 tahun lebih, baik itu di perbankan kovensional maupun syariah. ','p_putri_sq.jpeg',NULL),(10,'DR. Endy M. Astiwara',1,'Sharia Advisory Board','                                      Dr. Endy M. Astiwara memegang gelar Magister Ekonomi Islam dari Universitas Muhammadiyah Jakarta dan Doktor dari UIN Syarif Hidayatullah Jakarta, juga sejumlah brevet ahli bidang keuangan dalam dan luar negeri, antara lain Ahli Syariah Pasar Modal. Telah aktif sebagai Dewan Pengawas Syariah dan Penasihat Syariah pada beberapa lembaga keuangan syariah di Indonesia sejak tahun 2012.                                    ','p_endi_dps_sq.jpeg',NULL),(11,'H. M. Fachry Maulana',1,'Sharia Advisory Board','<ul>\r\n<li>Alumnus of Bandung Institute of Technology (Indonesia)</li>\r\n<li>15++ years experiences in Indonesian Sharia Banking Industries</li>\r\n<li>BSMR (GARP) / LSPP Certificate Level III</li>\r\n<li>Credit Skill Analytic Certificate from Omega USA (Internationaly Accepted)</li>\r\n</ul>','p_fahri_dps_sq.jpeg',NULL),(12,'Maulana Riki Alamsyah',4,'Head of Investment & Campaign','Merupakan lulusan Politeknik Pos Indonesia pada Bidang Pemasaran dan Program Sarjana STIE STAN Indonesia Mandiri pada Bidang Akuntansi. Selepas itu Riki berkarir di dunia keuangan lebih dari 8 tahun, baik itu di Bank Perkreditan Rakyat maupun di perbankan konvensional.','p_riki_sq.jpeg',NULL),(13,'Asep Athoilah',4,'Office Management Staff','Alumni SMK Administrasi Perkantoran ini, saat ini sedang menempuh kuliah tingkat sarjana di Universitas Mercu Buana Jurusan Management. Walapun demikian, Asep telah berpengalaman bekerja lebih dari 5 tahun pada beberapa perusahaan swasta sebelumnya.','p_asep_sq.jpeg',NULL);
/*!40000 ALTER TABLE `personil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_details`
--

DROP TABLE IF EXISTS `product_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_id` int(11) NOT NULL,
  `urutan` int(11) unsigned NOT NULL,
  `icon` varchar(48) NOT NULL,
  `detail` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `prod_id` (`prod_id`),
  CONSTRAINT `product_details_ibfk_1` FOREIGN KEY (`prod_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_details`
--

LOCK TABLES `product_details` WRITE;
/*!40000 ALTER TABLE `product_details` DISABLE KEYS */;
INSERT INTO `product_details` VALUES (1,1,1,'','Pembiayaan jual beli barang (murobahah) urutan #1'),(2,1,2,'','Pembiayaan jual beli barang (murobahah) urutan #2'),(3,1,3,'','Pembiayaan jual beli barang (murobahah) urutan #3'),(6,2,1,'','Tes 2 #1'),(7,2,2,'','Tes 2 #2');
/*!40000 ALTER TABLE `product_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_name` varchar(48) NOT NULL,
  `image` varchar(64) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Pembiayaan Jual Beli Barang','_1_barang.jpg','Pembiayaan Jual Beli Barang (Murobahah)'),(2,'Pembiayaan Jasa','_2_jasa.jpg','Pembiayaan Jual Beli Barang (Ijarah)'),(3,'Pembiayaan Usaha','_3_usaha.jpg','Pembiayaan Usaha (Musyarokah)'),(4,'Pembiayaan Sosial','_4_sosial.jpg','Pembiayaan Sosial (Qardh al-Hassan)'),(5,'Pembiayaan Pergi Riba','_5_pergiriba.jpg','Pembiayaan Pergi Riba (Qardh)');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_name` varchar(48) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `single_content`
--

DROP TABLE IF EXISTS `single_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `single_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content_name` varchar(64) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `single_content`
--

LOCK TABLES `single_content` WRITE;
/*!40000 ALTER TABLE `single_content` DISABLE KEYS */;
INSERT INTO `single_content` VALUES (1,'company quote','Sebaik-baik Manusia adalah yang Paling Berguna Bagi Sesamanya'),(2,'syarfi_address','<strong>PT. Syarfi Teknologi Finansial</strong>\r\n<br> Menara MTH 10th floor\r\n<br> Jl. MT Haryono Kav 23\r\n<br> Jakarta 12820\r\n<br>'),(3,'syarfi_phone','(+62) 21 8378 2337'),(4,'syarfi_fax','(+62) 21 8378 2338'),(5,'syarfi_email','salam@syarfi.id'),(6,'about_title_id','Dokumentasi Kegiatan Syarfi'),(7,'about_subtitle_id','Dokumentasi Kegiatan PT. Syarfi Teknologi Finansial'),(8,'blog_main_title_en','Syarfi Blog'),(9,'blog_main_sub_en','This Blog contents created by Syarfi team'),(10,'syarfi_facebook','https://www.facebook.com/Syarfi-472466949792782/'),(11,'syarfi_instagram','https://www.instagram.com/syarfi.id/'),(12,'syarfi_twitter','https://twitter.com/Syarfi_ID'),(13,'quote_origin','HR. Ahmad');
/*!40000 ALTER TABLE `single_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social_media`
--

DROP TABLE IF EXISTS `social_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `social_media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `link` varchar(256) NOT NULL,
  `id_personil` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_personil` (`id_personil`),
  CONSTRAINT `social_media_ibfk_1` FOREIGN KEY (`id_personil`) REFERENCES `personil` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_media`
--

LOCK TABLES `social_media` WRITE;
/*!40000 ALTER TABLE `social_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `social_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supervise`
--

DROP TABLE IF EXISTS `supervise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supervise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `image` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervise`
--

LOCK TABLES `supervise` WRITE;
/*!40000 ALTER TABLE `supervise` DISABLE KEYS */;
INSERT INTO `supervise` VALUES (1,'ojk','logo-ojk-indonesia.png'),(2,'asosiasi fintech syariah','logofintechsyariah.png'),(3,'kominfo','logo-kominfo.png'),(4,'mui','logo-mui-s.png');
/*!40000 ALTER TABLE `supervise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(64) NOT NULL,
  `password` varchar(128) NOT NULL,
  `username` varchar(24) NOT NULL,
  `level` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@syarfi.id','a2941009d74d8b549edb773418779200','admin',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-09-06 10:47:13
