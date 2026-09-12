import fs from "node:fs";
import path from "node:path";
import namiaData from "./namia_data.json";

export interface CategoryData {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface ProductData {
  id: number;
  categoryId: number;
  categorySlug: string;
  name: string;
  provider: string;
  logo: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTenorMonths: number;
  maxTenorMonths: number;
  interestRateAnnual: number; // margin / nisbah rate
  adminFee: number;
  rating: number;
  shariaAccredited: boolean;
  contractType: string;
  features: string[];
  applyUrl: string;
  isFeatured: boolean;
  targetAudience?: "borrower" | "investor" | "both";
}

export interface LeadData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  nik?: string;
  dateOfBirth?: string;
  address?: string;
  employmentType?: string;
  monthlyIncome?: number;
  needCategory?: string;
  targetAmount?: number;
  targetTenorMonths?: number;
  kycStep: number;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface BlogPostData {
  id: number;
  slug: string;
  title: string;
  content: string | string[];
  excerpt: string;
  photo: string;
  author: string;
  authorRole?: string;
  category: string;
  publishedAt: string;
  date?: string;
  readTimeMinutes?: number;
  readTime?: string;
  featured?: boolean;
  summary?: string;
  takeaway?: string;
}

export interface PersonilData {
  id: number;
  fullName: string;
  jobLevel: number; // 1: DPS, 2: Dewan Komisaris, 3: Direksi, 4: Manajemen
  jobTitle: string;
  biography: string;
  photo: string;
  department: string;
  education?: string;
}

export interface FaqData {
  id: number;
  categoryId: number;
  categoryName: string;
  isInvestor: number; // 0: borrower, 1: investor
  question: string;
  answer: string;
}

export interface StatData {
  id: number;
  title: string;
  amount: string;
  unit: string;
  icon: string;
  subtitle?: string;
}

export interface ClientData {
  id: number;
  name: string;
  picture: string;
  category?: string;
}

export interface SuperviseData {
  id: number;
  name: string;
  image: string;
  role?: string;
}

export interface MissionData {
  id: number;
  title: string;
  content: string;
  icon: string;
  color: string;
}

export interface PhilosophyData {
  id: number;
  title: string;
  arabicTitle: string;
  description: string;
  icon: string;
  badge: string;
}

export interface TestimonialData {
  id: number;
  name: string;
  role: string;
  businessName: string;
  avatar: string;
  content: string;
  rating: number;
  type: "borrower" | "investor";
  fundedAmount?: string;
  date?: string;
}

export interface CompanyAwardData {
  id: number;
  name: string;
  image: string;
  description: string;
  org?: string;
}

export interface ActivityDocData {
  id: number;
  photo: string;
  notes: string;
  tag?: string;
  title?: string;
  desc?: string;
}

export interface BorrowerInfo {
  coreValues: Array<{
    title: string;
    desc: string;
    icon: string;
  }>;
  features: Array<{
    icon: string;
    badge: string;
    title: string;
    desc: string;
  }>;
  steps: Array<{
    step: number;
    num: string;
    icon: string;
    title: string;
    desc: string;
  }>;
  requirements: Array<{
    category: string;
    items: string[];
  }>;
}

export interface InvestorInfo {
  heroBadge?: string;
  heroBadgeContract?: string;
  heroTitle?: string;
  heroHighlight?: string;
  heroLead?: string;
  heroReturnRange?: string;
  heroMinInvestment?: string;
  heroTkb90?: string;
  heroShariaCompliance?: string;
  liveDealsTicker?: string[];
  featuredDeal?: {
    title: string;
    borrower: string;
    sector: string;
    targetAmount: string;
    fundedAmount: string;
    fundedPercent: number;
    tenor: string;
    yieldRate: string;
    contract: string;
    rating: string;
    minInvest: string;
    timeLeft: string;
  };
  liveDeals?: Array<{
    id: string;
    title: string;
    borrower: string;
    sector: string;
    targetAmount: string;
    fundedPercent: number;
    tenor: string;
    yieldRate: string;
    contract: string;
    rating: string;
    status: string;
  }>;
  benchmarkRows?: Array<{
    instrument: string;
    yieldRange: string;
    contractType: string;
    riskProfile: string;
    taxRate: string;
    liquidity: string;
    shariaStatus: string;
    isHighlighted?: boolean;
  }>;
  lenderTiers?: Array<{
    level: string;
    name: string;
    minCommitment: string;
    badge: string;
    color: string;
    features: string[];
    isPopular?: boolean;
  }>;
  sectorAllocations?: Array<{
    sector: string;
    percentage: number;
    desc: string;
  }>;
  officialFatwas?: Array<{
    number: string;
    year: string;
    title: string;
    subject: string;
  }>;
  coreValues: Array<{
    title: string;
    desc: string;
    icon: string;
  }>;
  pillars: Array<{
    icon: string;
    badge: string;
    title: string;
    desc: string;
  }>;
  steps: Array<{
    step: number;
    num: string;
    icon: string;
    title: string;
    desc: string;
  }>;
  safetyMeasures: Array<{
    title: string;
    desc: string;
    icon: string;
    badge: string;
  }>;
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
}

export interface HeroContent {
  badgeText: string;
  title: string;
  highlightWord: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  tickerText: string;
  accentQuote: string;
}

export interface SiteSettings {
  brandName: string;
  companyName: string;
  tagline: string;
  subtagline: string;
  address: string;
  addressHtml: string;
  phone: string;
  whatsapp: string;
  fax: string;
  email: string;
  operatingHours: string;
  quote: string;
  quoteOrigin: string;
  website: string;
  socials: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  regulatoryDisclaimer: string;
  ceoWelcome: {
    title: string;
    subtitle: string;
    ceoName: string;
    ceoTitle: string;
    ceoPhoto: string;
    speechDate: string;
    paragraphs: string[];
  };
}

// Initial defaults for Namia Syariah & Smart Growth, Halal Impact
export const initialSiteSettings: SiteSettings = {
  brandName: "Namia Syariah",
  companyName: "PT Namia Finansial Teknologi",
  tagline: "Smart Growth, Halal Impact",
  subtagline: "Platform Finansial & P2P Financing Syariah terdepan berbasis Fiqih Muamalah untuk pertumbuhan riil, berkeadilan, dan berkelanjutan.",
  address: "Menara MTH Lt. 10, Jl. MT Haryono Kav. 23, Jakarta Selatan 12820, Indonesia",
  addressHtml: "<strong>PT Namia Finansial Teknologi</strong><br/>Menara MTH Lantai 10<br/>Jl. MT Haryono Kav 23<br/>Jakarta Selatan 12820, Indonesia",
  phone: "(+62) 21 8378 2337",
  whatsapp: "+6281283782337",
  fax: "(+62) 21 8378 2338",
  email: "salam@namia.id",
  operatingHours: "Senin - Jumat: 08:30 - 17:00 WIB",
  quote: "Sebaik-baik manusia adalah yang paling bermanfaat bagi sesamanya",
  quoteOrigin: "HR. Ahmad & Thabrani",
  website: "https://namia.id",
  socials: {
    facebook: "https://www.facebook.com/namia.id/",
    instagram: "https://www.instagram.com/namia.id/",
    twitter: "https://twitter.com/namia_id",
    linkedin: "https://www.linkedin.com/company/namia-syariah/",
    youtube: "https://www.youtube.com/@namiasyariah"
  },
  regulatoryDisclaimer: "PT Namia Finansial Teknologi (Namia Syariah) berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) serta berada di bawah supervisi Dewan Pengawas Syariah (DPS) terafiliasi DSN-MUI.",
  ceoWelcome: {
    title: "Sambutan Direksi",
    subtitle: "Pesan dari Manajemen PT Namia Finansial Teknologi",
    ceoName: "Ir. Syauki, MBA",
    ceoTitle: "Chief Executive Officer & Founder",
    ceoPhoto: "/images/team/p_syauqi_trim.jpg",
    speechDate: "Jakarta, 2026",
    paragraphs: [
      "Bismillahhirrahmanirrahim. Assalamu'alaikum warahmatullahi wabarakatuh.",
      "Puji syukur kehadirat Allah SWT atas segala nikmat dan karunia-Nya. Shalawat serta salam senantiasa tercurah kepada junjungan kita Rasulullah Muhammad SAW, keluarga, sahabat, dan ummatnya hingga akhir zaman.",
      "Sahabat Namia, lahirnya Namia Syariah (PT Namia Finansial Teknologi) berakar dari filosofi An-Namaa' (النَّمَاء) — yakni pertumbuhan yang riil, subur, berdaya guna, dan sarat keberkahan. Kami percaya bahwa teknologi finansial harus memanusiakan manusia, menjembatani saudara-saudara kita yang membutuhkan permodalan produktif dengan para investor yang mendambakan imbal hasil halal dan berdampak sosial.",
      "Melalui moto 'Smart Growth, Halal Impact', Namia Syariah berkomitmen mengeliminasi praktik riba, spekulasi (gharar), dan ketidakadilan finansial. Seluruh akad kami, baik Murabahah, Musyarakah, Ijarah, maupun Qardh, disusun di bawah bimbingan Dewan Pengawas Syariah DSN-MUI dan senantiasa tunduk pada regulasi OJK.",
      "Mari bersama-sama membangun ekosistem ekonomi syariah yang mandiri, adil, dan membanggakan bagi bangsa dan dunia.",
      "Wassalamu'alaikum warahmatullahi wabarakatuh."
    ]
  }
};

export const initialHeroContent: HeroContent = {
  badgeText: "Platform P2P Financing Syariah Terpercaya",
  title: "Smart Growth, Halal Impact",
  highlightWord: "Halal Impact",
  subtitle: "Akselerasi pendanaan produktif dan investasi syariah berbasis Fiqih Muamalah. Menghubungkan ribuan pendana etis dengan UMKM tangguh di seluruh Indonesia.",
  primaryCtaText: "Mulai Danai (Investor)",
  primaryCtaUrl: "/investor",
  secondaryCtaText: "Ajukan Pembiayaan",
  secondaryCtaUrl: "/borrower",
  tickerText: "Penyaluran dana bulan ini meningkat +28.4% | TKB90 terjaga prima di 99.82% | 100% Bebas Riba & Denda Eksploitatif",
  accentQuote: "Menumbuhkan aset dengan ketenangan batin dan keberkahan hakiki."
};

export const initialPhilosophies: PhilosophyData[] = [
  {
    id: 1,
    title: "Pertumbuhan Riil",
    arabicTitle: "An-Namaa' (النَّمَاء)",
    description: "Dana mengalir langsung ke aset riil, barang, dan jasa produktif. Bukan spekulasi pasar uang maupun rekayasa finansial semu.",
    icon: "Sprout",
    badge: "Sektor Riil"
  },
  {
    id: 2,
    title: "Keadilan & Bebas Riba",
    arabicTitle: "'Adalah wa La Riba (العدالة ولا ربا)",
    description: "Tanpa bunga majemuk, tanpa denda beranak pinak, dan tanpa akad ganda yang menjebak. Seluruh keuntungan disepakati transparan.",
    icon: "Scale",
    badge: "Transparansi Penuh"
  },
  {
    id: 3,
    title: "Dampak Berkah Sosial",
    arabicTitle: "Atsar Al-Barakah (أثر البركة)",
    description: "Setiap pembiayaan ditujukan untuk menggerakkan roda UMKM, membuka lapangan kerja baru, dan memberdayakan komunitas pengusaha muslim.",
    icon: "HeartHandshake",
    badge: "Sosial & Berdaya"
  },
  {
    id: 4,
    title: "Kepatuhan Syariah",
    arabicTitle: "Al-Imtitsal Asy-Syar'i (الامتثال الشرعي)",
    description: "Diawasi langsung oleh Dewan Pengawas Syariah tersertifikasi DSN-MUI dan berizin OJK untuk menjamin kemurnian fiqih muamalah.",
    icon: "ShieldCheck",
    badge: "Diawasi DPS & OJK"
  }
];

export const initialStats: StatData[] = [
  { id: 1, title: "Total Dana Tersalurkan", amount: "Rp 2,45 Triliun", unit: "", icon: "TrendingUp", subtitle: "Sejak awal beroperasi" },
  { id: 2, title: "Tingkat Keberhasilan 90 Hari (TKB90)", amount: "99,82%", unit: "", icon: "ShieldCheck", subtitle: "Kualitas portofolio prima" },
  { id: 3, title: "Mitra Penerima Pembiayaan", amount: "18.420+", unit: "UMKM", icon: "Users", subtitle: "Tersebar di 27 provinsi" },
  { id: 4, title: "Pemberi Dana Aktif", amount: "42.500+", unit: "Mitra", icon: "UserCheck", subtitle: "Investor retail & institusi" },
  { id: 5, title: "Indeks Kepuasan Pengguna", amount: "4,9 / 5,0", unit: "Bintang", icon: "Award", subtitle: "Dari 15.000+ ulasan" }
];

export const initialMissions: MissionData[] = [
  {
    id: 1,
    title: "Visi Kami",
    content: "Menjadi ekosistem teknologi finansial syariah terdepan di Asia Tenggara yang menghubungkan pendana global dengan potensi riil ekonomi umat secara inklusif dan berkeadilan.",
    icon: "Users",
    color: "#047857"
  },
  {
    id: 2,
    title: "Misi Utama",
    content: "Memanusiakan layanan finansial melalui otomatisasi modern, memperluas akses permodalan halal bagi UMKM, dan memberikan sarana investasi berprinsip syariah yang aman, transparan, dan menguntungkan.",
    icon: "Cog",
    color: "#064E3B"
  },
  {
    id: 3,
    title: "Nilai Dasar (AMANAH)",
    content: "Adil, Maslahat, Amanah, Nyata (Pertumbuhan Riil), Adaptif, dan Harmonis dalam bingkai kepatuhan syariah.",
    icon: "ThumbsUp",
    color: "#D97706"
  }
];

export const initialClients: ClientData[] = [
  { id: 1, name: "Siskem Indonesia", picture: "/images/clients/2_siskem.jpg", category: "Teknologi" },
  { id: 2, name: "Simpatindo", picture: "/images/clients/3_simpatindo.jpg", category: "Distribusi" },
  { id: 3, name: "Kopegtel", picture: "/images/clients/6_kopegtel.jpg", category: "Koperasi" },
  { id: 4, name: "Global Tri Star", picture: "/images/clients/10_global_tri_star.jpg", category: "Logistik" },
  { id: 5, name: "Strivechem", picture: "/images/clients/14_strivechem.jpg", category: "Manufaktur" },
  { id: 6, name: "An Najah Solution", picture: "/images/clients/annsi.jpg", category: "Agribisnis" },
  { id: 7, name: "Awina Sinergi", picture: "/images/clients/awina_sinergi.png", category: "Energi Bersih" },
  { id: 8, name: "BPRS Al Salaam", picture: "/images/clients/bprs-alsalaam.png", category: "Perbankan Syariah" },
  { id: 9, name: "Bukalapak", picture: "/images/clients/bukalapak.png", category: "E-Commerce" },
  { id: 10, name: "Capsugel", picture: "/images/clients/capsugel.jpg", category: "Kesehatan Halal" },
  { id: 11, name: "Bank Permata Syariah", picture: "/images/clients/permata_syariah.jpg", category: "Perbankan Syariah" },
  { id: 12, name: "Pertamina", picture: "/images/clients/pertamina.png", category: "Energi & BUMN" },
  { id: 13, name: "Jamkrida Jakarta", picture: "/images/clients/jamkrida_jakarta.png", category: "Penjaminan Daerah" },
  { id: 14, name: "Qasir POS Syariah", picture: "/images/clients/qasir.png", category: "Fintech Kasir" }
];

export const initialSupervise: SuperviseData[] = [
  { id: 1, name: "Otoritas Jasa Keuangan (OJK)", image: "/images/home/logo-ojk-indonesia.png", role: "Regulator & Pengawas" },
  { id: 2, name: "Asosiasi Fintech Syariah Indonesia (AFSI)", image: "/images/home/logofintechsyariah.png", role: "Asosiasi Resmi" },
  { id: 3, name: "Kementerian Komunikasi dan Informatika", image: "/images/home/logo-kominfo.png", role: "Penyelenggara Sistem Elektronik" },
  { id: 4, name: "Dewan Syariah Nasional Majelis Ulama Indonesia (DSN-MUI)", image: "/images/home/logo-mui-s.png", role: "Dewan Pengawas Syariah" }
];

export const initialMediaCoverage = [
  {
    id: 1,
    name: "The Jakarta Post",
    logo: "/images/mediacover/logo-jakarta-post.png",
    title: "Namia Syariah: Pioneering Ethical Sharia P2P Lending for Indonesian MSMEs",
    description: "Namia Syariah: Pioneering Ethical Sharia P2P Lending for Indonesian MSMEs",
    excerpt: "Platform fintech syariah terkemuka ini membuktikan pertumbuhan pembiayaan inklusif bagi ribuan wirausaha lokal dengan akad muamalah murni tanpa bunga bank.",
    source: "The Jakarta Post",
    date: "14 Agustus 2025",
    url: "https://thejakartapost.com"
  },
  {
    id: 2,
    name: "Kompas",
    logo: "/images/mediacover/logo-kompas.png",
    title: "Langkah Strategis Namia Syariah Salurkan Rp 2,4 Triliun ke Sektor Riil",
    description: "Langkah Strategis Namia Syariah Salurkan Rp 2,4 Triliun ke Sektor Riil",
    excerpt: "Distribusi likuiditas produktif ke 27 provinsi mendorong geliat rantai pasok dan memperkuat ketahanan ratusan UMKM pangan, logistik, dan perdagangan.",
    source: "Harian Kompas",
    date: "22 Oktober 2025",
    url: "https://kompas.id"
  },
  {
    id: 3,
    name: "Republika Online",
    logo: "/images/mediacover/logo-rol.jpg",
    title: "Solusi Cerdas Pembiayaan Tanpa Riba: Modal Kerja Halal untuk Pelaku Usaha",
    description: "Solusi Cerdas Pembiayaan Tanpa Riba: Dari Program Pergi Riba hingga Modal Kerja Halal",
    excerpt: "Membuka akses permodalan etis berbasis kemitraan bagi pedagang pasar, industri kreatif, dan jasa logistik tanpa risiko denda keterlambatan berbunga.",
    source: "Republika Online",
    date: "05 Desember 2025",
    url: "https://republika.co.id"
  }
];

export const initialTestimonials: TestimonialData[] = [
  {
    id: 1,
    name: "Hj. Siti Rahmah",
    role: "Pemilik Usaha",
    businessName: "Rahmah Batik & Fashion, Solo",
    avatar: "/images/team/p_putri_sq.jpeg",
    content: "Alhamdulillah, pembiayaan Murabahah dari Namia Syariah memudahkan pengadaan bahan baku kain saat lonjakan pesanan menjelang Ramadhan. Tidak ada bunga ribawi, harganya pasti, dan berkah bagi seluruh penjahit kami.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 150.000.000",
    date: "10 Sep 2026"
  },
  {
    id: 2,
    name: "Fajar Wicaksono, S.T.",
    role: "Investor Retail Mandiri",
    businessName: "Profesional IT, Jakarta Selatan",
    avatar: "/images/team/p_riki_sq.jpeg",
    content: "Sebagai pendana, ketenangan batin nomor satu. Di Namia Syariah, akadnya jelas (Musyarakah/Mudharabah), proyeknya ada di dunia nyata, dan pengembalian bagi hasilnya sangat kompetitif dibanding instrumen konvensional.",
    rating: 5,
    type: "investor",
    fundedAmount: "Pendana Aktif sejak 2023",
    date: "08 Sep 2026"
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    role: "Direktur Operasional",
    businessName: "PT Sinergi Pangan Nusantara, Karawang",
    avatar: "/images/team/p_krisna_sq.jpeg",
    content: "Invoice Financing dari Namia Syariah membantu kami menjaga likuiditas cash flow supplier pangan tanpa harus menjaminkan aset berat. Proses digitalnya sangat cepat dan transparan.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 650.000.000",
    date: "06 Sep 2026"
  },
  {
    id: 4,
    name: "dr. H. Hendra Gunawan, Sp.A",
    role: "Dokter Spesialis & Angel Investor",
    businessName: "Klinik Pratama Sehat Berkah, Bandung",
    avatar: "/images/team/p_syauqi_sq.jpg",
    content: "Sangat mengapresiasi transparansi rasio TKB90 dan mitigasi risikonya. Portofolio pendanaan saya dialokasikan ke UMKM sektor produktif yang terkurasi ketat oleh tim analis Namia.",
    rating: 5,
    type: "investor",
    fundedAmount: "Pendana Terverifikasi",
    date: "04 Sep 2026"
  },
  {
    id: 5,
    name: "Nurul Hidayati, S.E.",
    role: "Founder & CEO",
    businessName: "CV Berkah Rempah Nusantara, Surabaya",
    avatar: "/images/team/p_putri_sq.jpeg",
    content: "Plafon modal kerja Musyarakah yang kami terima memungkinkan ekspor 3 kontainer rempah ke Timur Tengah tepat waktu. Bagi hasilnya adil dan didampingi langsung oleh account officer syariah.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 280.000.000",
    date: "02 Sep 2026"
  },
  {
    id: 6,
    name: "Ir. Bambang Triyono",
    role: "Komisaris Utama",
    businessName: "PT Surya Energi Mandiri, Tangerang",
    avatar: "/images/team/p_kuseryansyah_sq.jpeg",
    content: "Skema Istishna' & IMBT untuk pengadaan mesin perakitan panel surya sangat solutif. Tidak ada skema denda berbunga yang mencekik, semua klausul akad disetujui bersama secara musyawarah.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 1.200.000.000",
    date: "30 Agu 2026"
  },
  {
    id: 7,
    name: "Sarah Anggraini, M.M.",
    role: "Head of Wealth Management",
    businessName: "Komunitas Muslim Financial Hub, Yogyakarta",
    avatar: "/images/team/p_putri_sq.jpeg",
    content: "Platform P2P syariah paling rapi dan kredibel yang pernah saya ikuti. Laporan bulanan proyek UMKM disajikan lengkap dengan foto lapangan dan neraca laba rugi berkala.",
    rating: 5,
    type: "investor",
    fundedAmount: "Pendana sejak 2022",
    date: "28 Agu 2026"
  },
  {
    id: 8,
    name: "H. Subhan Mansyur",
    role: "Ketua Koperasi",
    businessName: "Koperasi Agro Makmur Gayo, Aceh Tengah",
    avatar: "/images/team/p_asep_sq.jpeg",
    content: "Petani kopi binaan kami di dataran tinggi Gayo kini memiliki akses modal pra-panen dengan akad Salam yang sah. Panen terserap pasar dengan harga pantas tanpa tengkulak.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 450.000.000",
    date: "25 Agu 2026"
  },
  {
    id: 9,
    name: "Muhammad Dimas Rizky",
    role: "Co-Founder",
    businessName: "Kopi Sela Nusantara, Malang",
    avatar: "/images/team/p_ramzi_sq.jpeg",
    content: "Sebagai wirausaha muda, akses perbankan seringkali rumit karena syarat agunan. Namia Syariah hadir dengan penilaian kelayakan usaha berbasis invoice dan transaksi riil. Luar biasa!",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 120.000.000",
    date: "22 Agu 2026"
  },
  {
    id: 10,
    name: "Rina Agustina, S.Farm., Apt.",
    role: "Apoteker & Pemilik",
    businessName: "Apotek Medika Berkah, Semarang",
    avatar: "/images/team/p_putri_sq.jpeg",
    content: "Pengadaan stok obat-obatan esensial dan vitamin di musim penghujan terbantu sekali oleh pembiayaan persediaan Namia. Penjualan apotek kami naik 35% dalam 3 bulan.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 200.000.000",
    date: "19 Agu 2026"
  },
  {
    id: 11,
    name: "Budi Prasetyo, M.T.",
    role: "Principal Software Engineer",
    businessName: "Pendana Retail, BSD Tangerang Selatan",
    avatar: "/images/team/p_riki_sq.jpeg",
    content: "User interface aplikasinya responsif, perhitungan return transparan dan payout bagi hasil setiap tanggal 10 langsung masuk ke rekening escrow tanpa potongan aneh-aneh.",
    rating: 5,
    type: "investor",
    fundedAmount: "Portofolio Aktif 18 Proyek",
    date: "16 Agu 2026"
  },
  {
    id: 12,
    name: "H. Dedi Mulyadi",
    role: "Owner & Pengelola",
    businessName: "Dedi Logistik & Armada Truk, Cirebon",
    avatar: "/images/team/p_krisna_sq.jpeg",
    content: "Penambahan 2 armada truk pendingin melalui skema pembiayaan Ijarah Muntahiyah Bittamlik berjalan mulus. Usaha distribusi hasil laut kami berkembang pesat.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 500.000.000",
    date: "14 Agu 2026"
  },
  {
    id: 13,
    name: "Hj. Mariam Ulfah",
    role: "Pengrajin Tenun Sutra Tradisional",
    businessName: "Sentra Sutra Lagosi, Sengkang Wajo",
    avatar: "/images/team/p_putri_sq.jpeg",
    content: "Menenun kain sutra khas Bugis butuh modal benang berkualitas. Syukur kepada Allah kami dipertemukan dengan Namia Syariah. Pelayanannya ramah, menjunjung adab dan amanah.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 85.000.000",
    date: "11 Agu 2026"
  },
  {
    id: 14,
    name: "Raden Mas Arya Kusuma",
    role: "Konsultan Keuangan Syariah",
    businessName: "Islamic Financial Advisory, Solo",
    avatar: "/images/team/p_endi_dps_sq.jpeg",
    content: "Saya telah mengaudit dan memeriksa skema akad pembiayaan Namia Syariah secara independen. Kesesuaian fatwa DSN-MUI diterapkan konsisten dari pra-akad hingga pelunasan.",
    rating: 5,
    type: "investor",
    fundedAmount: "Pendana Berpengalaman",
    date: "09 Agu 2026"
  },
  {
    id: 15,
    name: "Taufik Ismail, S.Kom.",
    role: "Direktur Utama",
    businessName: "CV Kreasi Logam Mandiri, Sidoarjo",
    avatar: "/images/team/p_fahri_dps_sq.jpeg",
    content: "Mendapat SPK pengadaan komponen pabrik otomotif senilai 1 miliar. Namia Syariah mendanai purchase order tersebut dalam 4 hari kerja. Usaha manufaktur lokal kami terselamatkan.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 340.000.000",
    date: "07 Agu 2026"
  },
  {
    id: 16,
    name: "Aisyah Putri Maharani",
    role: "Brand Founder",
    businessName: "Glow Sharia Herbal Cosmetics, Bekasi",
    avatar: "/images/team/p_putri_sq.jpeg",
    content: "Sebagai brand kecantikan yang bersertifikasi Halal MUI, kami ingin seluruh permodalan juga suci dari riba. Di Namia Syariah kami menemukan mitra finansial yang sevisi.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 225.000.000",
    date: "04 Agu 2026"
  },
  {
    id: 17,
    name: "H. Zulkifli Harahap",
    role: "Distributor Utama Sembako",
    businessName: "Harahap Berkah Niaga, Medan",
    avatar: "/images/team/p_asep_sq.jpeg",
    content: "Perputaran omset beras dan minyak goreng sangat cepat. Pembiayaan modal kerja bergulir dengan skema bagi hasil proporsional sangat membantu perputaran kas gudang.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 850.000.000",
    date: "01 Agu 2026"
  },
  {
    id: 18,
    name: "Eko Wahyudi, CFA",
    role: "Portofolio Strategist & Retail Lender",
    businessName: "Investor Mandiri, Menteng Jakarta Pusat",
    avatar: "/images/team/p_riki_sq.jpeg",
    content: "Tingkat pengembalian bersih rata-rata 14% - 16% per tahun dengan risiko gagal bayar yang sangat terkendali. Diversifikasi portofolio ke puluhan proyek sangat mudah dilakukan.",
    rating: 5,
    type: "investor",
    fundedAmount: "Portofolio Aktif sejak 2024",
    date: "29 Jul 2026"
  },
  {
    id: 19,
    name: "Dewi Lestari Handayani",
    role: "Owner & Eksportir",
    businessName: "Bambu Lestari Eco-Craft, Gianyar Bali",
    avatar: "/images/team/p_putri_sq.jpeg",
    content: "Kami memberdayakan 40 perajin anyaman bambu di pedesaan. Berkat modal kerja syariah, kami bisa memenuhi pesanan hotel ramah lingkungan di mancanegara.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 310.000.000",
    date: "26 Jul 2026"
  },
  {
    id: 20,
    name: "H. M. Firdaus, Lc., M.A.",
    role: "Dosen Ekonomi Islam & Pegiat Wakaf",
    businessName: "Lembaga Edukasi Muamalah, Depok",
    avatar: "/images/team/p_endi_dps_sq.jpeg",
    content: "Model fintech peer-to-peer syariah seperti Namia membuktikan bahwa inovasi teknologi finansial mampu menghidupkan kembali roh ta'awun (tolong-menolong) dan keadilan ekonomi syariat.",
    rating: 5,
    type: "investor",
    fundedAmount: "Pendana Istiqomah",
    date: "22 Jul 2026"
  }
];

export const initialAwards: CompanyAwardData[] = [
  {
    id: 1,
    name: "The Best Sharia Fintech Platform 2025",
    org: "Indonesia Sharia Fintech Forum",
    image: "Trophy",
    description: "Penghargaan prestisius atas inovasi pembiayaan syariah berbasis dampak sosial nyata dan kepatuhan murni."
  },
  {
    id: 2,
    name: "Inovasi Produk Fintech Syariah Terbaik",
    org: "Asosiasi Fintech Syariah Indonesia (AFSI)",
    image: "Medal",
    description: "Apresiasi terhadap kemudahan dan diversifikasi 4 skema akad pembiayaan untuk berbagai sektor riil."
  },
  {
    id: 3,
    name: "Tata Kelola & Kepatuhan Regulasi Prima",
    org: "Fintech Governance Award",
    image: "ShieldCheck",
    description: "Penghargaan kepatuhan tata kelola risiko, audit syariah berkala, dan perlindungan dana konsumen."
  }
];

export const initialActivityDocs: ActivityDocData[] = [
  {
    id: 1,
    photo: "/images/blog/grid/13.jpg",
    notes: "Sosialisasi & Workshop Literasi Finansial Syariah bersama Komunitas UMKM",
    tag: "Edukasi",
    title: "Sosialisasi Finansial Syariah",
    desc: "Edukasi muamalah tanpa riba bersama komunitas wirausaha muslim"
  },
  {
    id: 2,
    photo: "/images/blog/grid/17.jpg",
    notes: "Due Diligence & Verifikasi Lapangan Proyek Pertanian Produktif",
    tag: "Tata Kelola",
    title: "Rapat Kerja & Pengawasan DPS",
    desc: "Audit kepatuhan syariah berkala bersama Dewan Pengawas Syariah DSN-MUI"
  },
  {
    id: 3,
    photo: "/images/blog/grid/1.jpg",
    notes: "Rapat Pleno Dewan Pengawas Syariah & Peninjauan Akad Digital",
    tag: "Penyaluran",
    title: "Penandatanganan Akad Massal",
    desc: "Penyaluran pembiayaan produktif ke sektor UMKM riil Indonesia"
  },
  {
    id: 4,
    photo: "/images/blog/grid/12.jpg",
    notes: "Penandatanganan Kemitraan Strategis Penyaluran Modal Kerja Berkah",
    tag: "Kolaborasi",
    title: "Kemitraan Strategis Fintech",
    desc: "Kolaborasi ekosistem digital bersama asosiasi AFSI & Kementerian Kominfo"
  },
  {
    id: 5,
    photo: "/images/blog/grid/10.jpg",
    notes: "Pelatihan Pembukuan Keuangan dan Digitalisasi UMKM Daerah",
    tag: "Inkubasi",
    title: "Pemberdayaan Pelaku Usaha",
    desc: "Pelatihan pembukuan keuangan dan digitalisasi UMKM daerah"
  },
  {
    id: 6,
    photo: "/images/blog/grid/20.jpg",
    notes: "Penyaluran Dana Kebajikan bagi Pelaku Usaha Terjerat Riba",
    tag: "Sosial",
    title: "Bakti Sosial & Qardhul Hasan",
    desc: "Penyaluran dana kebajikan bagi masyarakat yang membutuhkan bantuan"
  }
];

export const initialBorrowerInfo: BorrowerInfo = {
  coreValues: [
    { title: "Halal", desc: "100% prinsip syariah diawasi Dewan Pengawas Syariah DSN-MUI.", icon: "CheckCircle2" },
    { title: "Aman", desc: "Dikelola profesional keuangan dan teknologi dari kampus terbaik dunia.", icon: "ShieldCheck" },
    { title: "Mudah", desc: "Proses pengajuan 100% online tanpa birokrasi berbelit.", icon: "Sparkles" },
    { title: "Cepat", desc: "Verifikasi kelayakan digital cepat dan pencairan tepat waktu.", icon: "Zap" },
    { title: "Barakah", desc: "Mendorong kemaslahatan bersama dan pertumbuhan nyata UMKM nasional.", icon: "Coins" }
  ],
  features: [
    {
      icon: "/images/icons/features/p_syariah.png",
      badge: "Kepatuhan Syariah",
      title: "100% Bebas Riba & Denda Bunga",
      desc: "Murni tanpa riba, maisir, gharar, atau denda bunga berjalan. Semua transaksi didasari akad muamalah sah yang disetujui DSN-MUI."
    },
    {
      icon: "/images/icons/features/p_cepat.png",
      badge: "Aplikasi Simpel",
      title: "Proses Cepat & 100% Digital",
      desc: "Pengajuan pembiayaan online kapan saja, unggah dokumen legalitas usaha tanpa perlu antre fisik di kantor cabang."
    },
    {
      icon: "/images/icons/features/p_nobunga.png",
      badge: "Transparansi Biaya",
      title: "Margin & Ujrah Terjangkau",
      desc: "Margin keuntungan transparan dan disepakati di muka. Tidak ada biaya siluman ataupun potongan yang merugikan peminjam."
    },
    {
      icon: "/images/icons/features/p_return.png",
      badge: "Skema Fleksibel",
      title: "Plafon s/d Rp 2 Miliar & Tenor Fleksibel",
      desc: "Kapasitas pembiayaan proporsional disesuaikan dengan kebutuhan riil perputaran modal dan siklus arus kas usaha Anda."
    },
    {
      icon: "/images/icons/features/p_risk.png",
      badge: "Kemitraan Nyata",
      title: "Pendampingan Bisnis & Akses Ekosistem",
      desc: "Dukungan konsultasi pengembangan bisnis serta kesempatan berjejaring dengan ekosistem halal Namia Group."
    }
  ],
  steps: [
    { step: 1, num: "01", icon: "UserCheck", title: "Daftar Akun & E-KYC", desc: "Registrasi akun Penerima Pembiayaan (Borrower) dan verifikasi identitas penanggung jawab usaha online dalam 5 menit." },
    { step: 2, num: "02", icon: "FileUp", title: "Unggah Dokumen Usaha", desc: "Lengkapi data profil bisnis, legalitas (NIB/SIUP/NPWP), dan mutasi rekening koran operasional 3-6 bulan terakhir." },
    { step: 3, num: "03", icon: "ClipboardCheck", title: "Review & Underwriting", desc: "Tim analis risiko melakukan penilaian kelayakan usaha (5C) dan memberikan penawaran struktur plafon serta tenor terbaik." },
    { step: 4, num: "04", icon: "LayoutGrid", title: "Penayangan Proyek", desc: "Proyek pembiayaan ditayangkan di katalog aggregator agar ribuan pendana syariah terverifikasi dapat mendanai bersama." },
    { step: 5, num: "05", icon: "HandCoins", title: "Akad & Pencairan Dana", desc: "Penandatanganan perjanjian akad syariah secara digital tersertifikasi, dan modal langsung dicairkan ke rekening usaha Anda." },
    { step: 6, num: "06", icon: "TrendingUp", title: "Tumbuh & Angsuran", desc: "Gunakan modal untuk akselerasi bisnis Anda dan lakukan pembayaran angsuran berkala sesuai jadwal akad yang disepakati." }
  ],
  requirements: [
    {
      category: "Kriteria Kelayakan Usaha",
      items: [
        "Usaha berbadan hukum (PT/CV) atau usaha perorangan produktif yang sah.",
        "Telah beroperasi aktif secara berkesinambungan minimal selama 1 (satu) tahun.",
        "Memiliki rekam jejak arus kas (cashflow) positif dan rekening bank aktif.",
        "Bergerak di sektor industri halal dan tidak bertentangan dengan syariat Islam."
      ]
    },
    {
      category: "Dokumen yang Diperlukan",
      items: [
        "KTP Penanggung Jawab / Direksi & Kartu Keluarga (KK).",
        "Nomor Pokok Wajib Pajak (NPWP) pribadi dan/atau badan usaha.",
        "Legalitas Usaha: NIB (Nomor Induk Berusaha), Izin Usaha, Akta & SK Kemenkumham (PT/CV).",
        "Rekening koran operasional usaha 3 hingga 6 bulan terakhir.",
        "Laporan keuangan sederhana atau catatan penjualan 1 tahun terakhir.",
        "Salinan Purchase Order (PO) / SPK / Faktur Tagihan (khusus Invoice Financing)."
      ]
    }
  ]
};

export const initialInvestorInfo: InvestorInfo = {
  heroBadge: "PLATFORM P2P FINANCING SYARIAH BERIZIN OJK",
  heroBadgeContract: "MUDHARABAH & MUSYARAKAH",
  heroTitle: "Tumbuhkan Aset dengan",
  heroHighlight: "Imbal Hasil Halal & Berkah",
  heroLead: "Salurkan pendanaan langsung ke proyek UMKM produktif pilihan. Nikmati imbal hasil kompetitif hingga 18% p.a. dengan transparansi akad syariah tanpa riba, diawasi langsung oleh DSN-MUI.",
  heroReturnRange: "12% - 18%",
  heroMinInvestment: "Rp 1.000.000",
  heroTkb90: "98.4%",
  heroShariaCompliance: "100% Sah",
  ctaTitle: "Siap Memulai Pendanaan Syariah?",
  ctaSubtitle: "Buka akun Anda dalam 3 menit dan pilih proyek UMKM produktif dengan imbal hasil berkah.",
  ctaButtonText: "Katalog Proyek Aktif",
  ctaButtonUrl: "/aggregator",
  liveDealsTicker: [
    "🟢 [DEAL TERPILIH] Pengadaan Bahan Baku Tekstil Ramadhan - PT Berkah Garment (Murabahah) • Terkumpul 88% (Sisa Rp 30 Jt) • Margin 16.5% p.a.",
    "🟢 [DEAL BARU] Ekspansi Rantai Pasok Pangan Sembako - CV Barokah Agro (Supply Chain) • Terkumpul 65% • Margin 14.8% p.a.",
    "🟢 [DISTRIBUSI DIVIDEN] Pembagian Bagi Hasil 128 Proyek Berjalan Telah Ditransfer ke Escrow Akun Lender",
    "🟢 [STATISTIK RESMI] TKB90 Terjaga di 98.4% • Rp 148+ Miliar Telah Disalurkan ke Sektor Riil UMKM Indonesia"
  ],
  featuredDeal: {
    title: "Pengadaan Bahan Baku Tekstil & Benang Katun Musim Raya",
    borrower: "PT Berkah Busana Mandiri",
    sector: "Industri Manufaktur & Tekstil",
    targetAmount: "Rp 250.000.000",
    fundedAmount: "Rp 220.000.000",
    fundedPercent: 88,
    tenor: "3 Bulan (Pelunasan Sekaligus)",
    yieldRate: "16.5% p.a.",
    contract: "Murabahah Pengadaan",
    rating: "AAA (Invoice Backed)",
    minInvest: "Rp 1.000.000",
    timeLeft: "2 Hari 14 Jam"
  },
  liveDeals: [
    {
      id: "NM-2026-081",
      title: "Pengadaan Seragam & Perlengkapan Sekolah Ramadhan",
      borrower: "CV Mitra Edukasi Nasional",
      sector: "Garmen & Konveksi",
      targetAmount: "Rp 180.000.000",
      fundedPercent: 92,
      tenor: "3 Bulan",
      yieldRate: "16.0% p.a.",
      contract: "Murabahah",
      rating: "AAA",
      status: "Hampir Penuh"
    },
    {
      id: "NM-2026-082",
      title: "Penyediaan Bahan Baku Minyak Goreng & Beras Grosir",
      borrower: "PT Pangan Berkah Sejahtera",
      sector: "FMCG & Sembako",
      targetAmount: "Rp 350.000.000",
      fundedPercent: 74,
      tenor: "2 Bulan",
      yieldRate: "14.5% p.a.",
      contract: "Supply Chain",
      rating: "AA+",
      status: "Pendanaan Aktif"
    },
    {
      id: "NM-2026-083",
      title: "Ekspansi Gerai Farmasi & Obat Resep Daerah",
      borrower: "CV Medika Syariah Mandiri",
      sector: "Kesehatan & Farmasi",
      targetAmount: "Rp 120.000.000",
      fundedPercent: 85,
      tenor: "6 Bulan",
      yieldRate: "17.2% p.a.",
      contract: "Musyarakah",
      rating: "AA",
      status: "Pendanaan Aktif"
    },
    {
      id: "NM-2026-084",
      title: "Sewa Mesin Cetak Packaging Ramah Lingkungan",
      borrower: "PT Kreasi Pack Nusantara",
      sector: "Manufaktur Kemasan",
      targetAmount: "Rp 220.000.000",
      fundedPercent: 60,
      tenor: "6 Bulan",
      yieldRate: "15.0% p.a.",
      contract: "Ijarah",
      rating: "A+",
      status: "Pendanaan Aktif"
    }
  ],
  benchmarkRows: [
    {
      instrument: "Namia Syariah P2P Financing",
      yieldRange: "12.0% - 18.0% p.a.",
      contractType: "Akad Muamalah (Bagi Hasil / Margin)",
      riskProfile: "Terukur (5C Credit Scoring & Agunan)",
      taxRate: "PPh Final 15%",
      liquidity: "3 - 12 Bulan (Cepat Berputar)",
      shariaStatus: "100% Sah & Diawasi DSN-MUI",
      isHighlighted: true
    },
    {
      instrument: "Deposito Mudharabah Bank Syariah",
      yieldRange: "4.0% - 6.5% p.a.",
      contractType: "Akad Mudharabah Mutlaqah",
      riskProfile: "Sangat Rendah (Dijamin LPS s/d 2M)",
      taxRate: "PPh Final 20%",
      liquidity: "1 - 12 Bulan (Terkunci)",
      shariaStatus: "Sah Syariah"
    },
    {
      instrument: "Sukuk Ritel / SBSN Negara",
      yieldRange: "6.0% - 6.6% p.a.",
      contractType: "Akad Ijarah / Wakalah",
      riskProfile: "Bebas Risiko Gagal Bayar (APBN)",
      taxRate: "PPh Final 10%",
      liquidity: "3 - 5 Tahun (Jangka Panjang)",
      shariaStatus: "Sah Syariah"
    },
    {
      instrument: "Deposito Bank Konvensional",
      yieldRange: "3.5% - 4.5% p.a.",
      contractType: "Bunga Pinjaman (Riba Bank)",
      riskProfile: "Rendah (Dijamin LPS)",
      taxRate: "PPh Final 20%",
      liquidity: "1 - 12 Bulan (Terkunci)",
      shariaStatus: "Haram (Riba Fadhl & Nasi'ah)"
    },
    {
      instrument: "Tabungan Rekening Biasa",
      yieldRange: "0.2% - 1.0% p.a.",
      contractType: "Bunga Rekening",
      riskProfile: "Rendah",
      taxRate: "PPh Final 20%",
      liquidity: "Setiap Saat",
      shariaStatus: "Rugi Tergerus Inflasi (Riil Negatif)"
    }
  ],
  lenderTiers: [
    {
      level: "Tier 1",
      name: "Lender Ritel Mandiri",
      minCommitment: "Rp 1.000.000",
      badge: "BRONZE MEMBER",
      color: "from-slate-700 to-slate-800",
      features: [
        "Akses Penuh Seluruh Prospektus Terverifikasi",
        "Distribusi Imbal Hasil Bulanan Otomatis",
        "Dashboard Portofolio & Laporan Real-Time",
        "Kalkulator Simulasi Finansial Mandiri"
      ]
    },
    {
      level: "Tier 2",
      name: "Lender Prioritas",
      minCommitment: "Rp 25.000.000",
      badge: "SILVER INVESTOR",
      color: "from-emerald-800 to-teal-900",
      isPopular: true,
      features: [
        "Fitur Auto-Allocation Prioritas (Tanpa Rebutan Kuota)",
        "Early-Bird 24 Jam Akses Proyek Rating AAA",
        "Dedicated Customer Support via WhatsApp Priority",
        "Rekapitulasi Dokumen Pajak & Bukti Potong SPT",
        "Undangan Eksklusif Diskusi Fiqih Muamalah Bulanan"
      ]
    },
    {
      level: "Tier 3",
      name: "Lender Institusi & Korporasi",
      minCommitment: "Rp 100.000.000",
      badge: "GOLD INSTITUTIONAL",
      color: "from-amber-800 to-yellow-950",
      features: [
        "Dedicated Relationship Manager (RM) Syariah Pribadi",
        "Akses Private Bourse / Large Scale Deals Khusus",
        "Custom Escrow Sub-Account Terintegrasi Host-to-Host",
        "Opsi Penjaminan Asuransi Pembiayaan 100%",
        "Kunjungan Audit Fisik Langsung ke Mitra UMKM"
      ]
    }
  ],
  sectorAllocations: [
    { sector: "Manufaktur & Tekstil Sandang", percentage: 35, desc: "Penyediaan benang, kain katun, konveksi seragam, garmen ekspor" },
    { sector: "FMCG & Rantai Pasok Pangan", percentage: 28, desc: "Distribusi sembako grosir, beras, minyak nabati, produk konsumer" },
    { sector: "Layanan Kesehatan & Farmasi", percentage: 22, desc: "Pengadaan alat kesehatan klinik, apotek jaringan, obat generik" },
    { sector: "Jasa Logistik & Manufaktur Kemasan", percentage: 15, desc: "Armada cold chain, mesin cetak kemasan ramah lingkungan" }
  ],
  officialFatwas: [
    { number: "No. 117/DSN-MUI/II/2018", year: "2018", title: "Layanan Pembiayaan Berbasis Teknologi Informasi", subject: "Landasan operasional platform P2P Financing Syariah di Indonesia" },
    { number: "No. 04/DSN-MUI/IV/2000", year: "2000", title: "Akad Murabahah", subject: "Jual beli komoditas riil dengan transparansi harga pokok dan margin" },
    { number: "No. 07/DSN-MUI/IV/2000", year: "2000", title: "Akad Mudharabah", subject: "Kemitraan penanaman modal usaha dengan nisbah bagi hasil murni" },
    { number: "No. 08/DSN-MUI/IV/2000", year: "2000", title: "Akad Musyarakah", subject: "Penyertaan modal kerja bersama untuk proyek produktif" },
    { number: "No. 112/DSN-MUI/IX/2017", year: "2017", title: "Akad Ijarah", subject: "Pembiayaan sewa manfaat atas aset fisik operasional usaha" }
  ],
  coreValues: [
    { title: "Halal", desc: "100% prinsip syariah diawasi Dewan Pengawas Syariah DSN-MUI.", icon: "CheckCircle2" },
    { title: "Aman", desc: "Dikelola profesional keuangan dan teknologi dari kampus terbaik dunia.", icon: "ShieldCheck" },
    { title: "Mudah", desc: "Proses pengajuan 100% online tanpa birokrasi berbelit.", icon: "Sparkles" },
    { title: "Cepat", desc: "Verifikasi kelayakan digital cepat dan pencairan tepat waktu.", icon: "Zap" },
    { title: "Barakah", desc: "Mendorong kemaslahatan bersama dan pertumbuhan nyata UMKM nasional.", icon: "Coins" }
  ],
  pillars: [
    {
      icon: "/images/icons/features/p_syariah.png",
      badge: "Kepatuhan Syariah",
      title: "100% Prinsip Syariah Murni",
      desc: "Bebas dari riba, maisir, dan gharar. Setiap transaksi didasari akad muamalah sah yang disetujui Dewan Pengawas Syariah DSN-MUI."
    },
    {
      icon: "/images/icons/features/p_return.png",
      badge: "Imbal Hasil Riil",
      title: "Bagi Hasil Kompetitif s/d 18% p.a.",
      desc: "Keuntungan riil yang proporsional langsung dari hasil margin dan laba operasional proyek UMKM di sektor industri produktif."
    },
    {
      icon: "/images/icons/features/p_risk.png",
      badge: "Mitigasi Risiko",
      title: "Credit Scoring 5C & Seleksi Ketat",
      desc: "Uji kelayakan mendalam atas karakter dan kapabilitas mitra usaha, pengikatan agunan fidusia, serta proteksi mitigasi risiko terukur."
    },
    {
      icon: "/images/icons/features/p_easy.png",
      badge: "Inklusif & Digital",
      title: "Mulai dari Rp 1.000.000",
      desc: "Aksesibilitas mudah bagi investor pemula hingga institusi. Distribusi bagi hasil otomatis masuk langsung ke rekening akun Anda."
    },
    {
      icon: "/images/icons/features/p_risk.png",
      badge: "Kepastian Hukum",
      title: "Kekuatan Hukum Riil",
      desc: "Perjanjian perdata sah yang mengikat dan berkekuatan hukum penuh sesuai perundang-undangan Negara Republik Indonesia."
    }
  ],
  steps: [
    { step: 1, num: "01", icon: "UserCheck", title: "Registrasi & E-KYC", desc: "Daftar akun Pendana (Lender), verifikasi identitas KTP dan foto wajah (liveness test) dalam waktu 3 menit." },
    { step: 2, num: "02", icon: "Wallet", title: "Deposit Dana Escrow", desc: "Top up saldo dompet akun Anda melalui Virtual Account Bank Syariah resmi (terpisah dari aset operasional Namia)." },
    { step: 3, num: "03", icon: "SearchCheck", title: "Pilih Proyek UMKM", desc: "Pelajari prospektus, analisis risiko kredit, margin imbal hasil, serta akad muamalah pada katalog pendanaan." },
    { step: 4, num: "04", icon: "FileText", title: "Akad & Penyaluran", desc: "Lakukan konfirmasi Ijab Qabul digital tersertifikasi, dana Anda langsung disalurkan ke mitra peminjam dana." },
    { step: 5, num: "05", icon: "HandCoins", title: "Terima Bagi Hasil", desc: "Dapatkan pengembalian pokok dan imbal hasil nisbah berkala langsung ke dompet akun Anda secara tepat waktu." }
  ],
  safetyMeasures: [
    { title: "Supervisi DPS DSN-MUI & OJK", desc: "Setiap skema akad diverifikasi secara ketat agar murni syariah dan sesuai regulasi POJK.", icon: "ShieldCheck", badge: "Legal & Syar'i" },
    { title: "Underwriting 5C Komprehensif", desc: "Penilaian karakter, kapasitas pembayaran, modal, kondisi usaha, dan agunan fidusia.", icon: "CheckCircle2", badge: "Penyaringan Ketat" },
    { title: "Rekening Escrow Terpisah", desc: "Dana Anda disimpan di akun penampung perbankan syariah terkemuka, tidak bercampur kas internal.", icon: "Building2", badge: "Perlindungan Dana" },
    { title: "Asuransi Penjaminan Pembiayaan", desc: "Opsi proteksi risiko gagal bayar bekerja sama dengan lembaga penjaminan syariah bereputasi.", icon: "Lock", badge: "Proteksi Portofolio" }
  ]
};

export const initialRiskDisclaimers: string[] = [
  "Layanan Pendanaan Bersama Berbasis Teknologi Informasi Syariah merupakan kesepakatan perdata antara Pemberi Dana (Lender) dan Penerima Pembiayaan (Borrower).",
  "Penyelenggara (PT Namia Finansial Teknologi) bertindak sebagai fasilitator platform teknologi yang mempertemukan Pemberi Dana dengan Penerima Pembiayaan berdasarkan prinsip-prinsip syariah Islam.",
  "Risiko kredit atau gagal bayar berada sepenuhnya pada Pemberi Dana. Tidak ada lembaga atau badan pemerintah yang bertanggung jawab atas kerugian finansial yang timbul dari kesepakatan perdata ini.",
  "Pemberi Dana yang belum memiliki pengetahuan memadai mengenai sistem pendanaan ini disarankan untuk tidak memanfaatkan layanan sebelum memahami risiko dan karakteristik instrumen.",
  "Penerima Pembiayaan wajib mempertimbangkan kemampuan pembayaran dan perputaran arus kas usaha secara matang guna mencegah risiko default atau ketidakmampuan memenuhi kewajiban akad.",
  "Setiap transaksi didasari oleh akad muamalah syariah yang sah (Murabahah, Musyarakah, Mudharabah, Ijarah, Qardh) dan diawasi oleh Dewan Pengawas Syariah (DPS) DSN-MUI.",
  "Penyelenggara tidak pernah meminta transfer dana ke rekening pribadi atas nama perorangan. Seluruh transaksi resmi disalurkan melalui Virtual Account Escrow perbankan syariah berizin OJK.",
  "Penyelenggara menerapkan standar keamanan data dan informasi bersertifikasi ISO 27001 serta tunduk pada Undang-Undang Perlindungan Data Pribadi (UU PDP).",
  "Informasi yang disajikan pada situs web dan aplikasi Namia Syariah tidak dapat ditafsirkan sebagai bentuk penawaran efek publik atau jaminan keuntungan mutlak tanpa risiko."
];

export const initialCategories: CategoryData[] = [
  {
    id: 1,
    slug: "p2p-lending",
    name: "P2P Financing Syariah",
    description: "Pembiayaan produktif dan pengadaan modal kerja bebas riba berbasis gotong royong.",
    icon: "Coins"
  },
  {
    id: 2,
    slug: "pembiayaan-usaha",
    name: "Pembiayaan Modal Kerja & UMKM",
    description: "Suntikan ekspansi usaha dengan kemitraan bagi hasil riil (Musyarakah & Mudharabah).",
    icon: "Briefcase"
  },
  {
    id: 3,
    slug: "invoice-financing",
    name: "Invoice & PO Financing",
    description: "Anjak piutang syariah untuk kelancaran cash flow vendor dan pengusaha B2B.",
    icon: "TrendingUp"
  },
  {
    id: 4,
    slug: "pembiayaan-sosial",
    name: "Pembiayaan Sosial & Qardh",
    description: "Pinjaman kebajikan tanpa margin untuk pembebasan dari jeratan riba dan kebutuhan darurat.",
    icon: "HeartHandshake"
  },
  {
    id: 5,
    slug: "asuransi-syariah",
    name: "Asuransi Takaful",
    description: "Perlindungan tolong menolong keluarga dan usaha berbasis prinsip ta'awun dan tabarru'.",
    icon: "Shield"
  },
  {
    id: 6,
    slug: "paylater-syariah",
    name: "Paylater Syariah",
    description: "Kemudahan transaksi belanja kebutuhan usaha dengan akad Qardh dan Ujrah tanpa denda berbunga.",
    icon: "CreditCard"
  },
  {
    id: 7,
    slug: "reksa-dana-syariah",
    name: "Sukuk & Reksa Dana",
    description: "Investasi portofolio efek syariah dan sukuk proyek riil dengan bagi hasil berkala.",
    icon: "LineChart"
  }
];

export const initialProducts: ProductData[] = [
  {
    id: 1,
    categoryId: 1,
    categorySlug: "p2p-lending",
    name: "Pembiayaan Pengadaan Barang & Inventaris",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/namia_murabahah_goods.jpg",
    description: "Pengadaan mesin produksi, perlengkapan toko, bahan baku halal, dan alat kerja UMKM dengan akad jual beli transparan, harga perolehan pasti, dan angsuran tetap tanpa riba.",
    minAmount: 5000000,
    maxAmount: 250000000,
    minTenorMonths: 3,
    maxTenorMonths: 24,
    interestRateAnnual: 8.5,
    adminFee: 50000,
    rating: 4.9,
    shariaAccredited: true,
    contractType: "Murabahah",
    features: [
      "Akad Jual Beli Murabahah Murni Tanpa Bunga",
      "Barang & Aset Dibelikan Langsung Sesuai Kebutuhan",
      "Cicilan Flat Tetap Hingga Akhir Tenor",
      "Diawasi Dewan Pengawas Syariah DSN-MUI"
    ],
    applyUrl: "/borrower",
    isFeatured: true,
    targetAudience: "borrower"
  },
  {
    id: 2,
    categoryId: 2,
    categorySlug: "pembiayaan-usaha",
    name: "Kemitraan Modal Usaha & Ekspansi UMKM",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/namia_musyarakah_partner.jpg",
    description: "Penyertaan modal kemitraan produktif untuk pembukaan cabang baru, peningkatan kapasitas pabrik, dan proyek usaha UMKM bertumbuh dengan nisbah bagi hasil riil berkeadilan.",
    minAmount: 20000000,
    maxAmount: 1000000000,
    minTenorMonths: 6,
    maxTenorMonths: 36,
    interestRateAnnual: 12.5,
    adminFee: 150000,
    rating: 4.9,
    shariaAccredited: true,
    contractType: "Musyarakah",
    features: [
      "Kemitraan Berkeadilan (Bagi Hasil Riil Sesuai Nisbah)",
      "Plafon Pendanaan Hingga Rp 1 Miliar",
      "Pendampingan Manajemen & Mentoring Keuangan",
      "Pencairan Bertahap Berbasis Milestone Proyek"
    ],
    applyUrl: "/borrower",
    isFeatured: true,
    targetAudience: "borrower"
  },
  {
    id: 3,
    categoryId: 3,
    categorySlug: "invoice-financing",
    name: "Invoice & PO Financing Syariah (Anjak Piutang)",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/namia_invoice_financing.jpg",
    description: "Talangan likuiditas arus kas jangka pendek berbasis Purchase Order (PO) atau tagihan invoice resmi korporasi dan instansi terverifikasi agar operasional vendor tetap lancar.",
    minAmount: 25000000,
    maxAmount: 2000000000,
    minTenorMonths: 1,
    maxTenorMonths: 6,
    interestRateAnnual: 11.0,
    adminFee: 250000,
    rating: 4.9,
    shariaAccredited: true,
    contractType: "Wakalah bil Ujrah",
    features: [
      "Plafon Likuiditas Hingga Rp 2 Miliar",
      "Pencairan Kilat 2 - 3 Hari Kerja",
      "Underwriting Berdasarkan Kredibilitas Payor Resmi",
      "Sesuai Fatwa DSN-MUI No. 67 tentang Anjak Piutang"
    ],
    applyUrl: "/borrower",
    isFeatured: true,
    targetAudience: "borrower"
  },
  {
    id: 4,
    categoryId: 1,
    categorySlug: "sewa-aset",
    name: "Pembiayaan Sewa Manfaat & Aset (IMBT)",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/namia_imbt_leasing.jpg",
    description: "Pembiayaan sewa tempat usaha, ruko komersial, armada kendaraan logistik, dan utilitas produktif dengan opsi pengalihan kepemilikan aset menjadi milik UMKM di akhir masa sewa.",
    minAmount: 10000000,
    maxAmount: 300000000,
    minTenorMonths: 6,
    maxTenorMonths: 36,
    interestRateAnnual: 8.0,
    adminFee: 75000,
    rating: 4.8,
    shariaAccredited: true,
    contractType: "Ijarah Muntahiya Bittamlik",
    features: [
      "Akad Ijarah Muntahiya Bittamlik (IMBT)",
      "Opsi Pengalihan Kepemilikan Aset di Akhir Tenor",
      "Ujrah Sewa Disepakati di Awal Tanpa Fluktuasi",
      "Bebas Denda Keterlambatan Ribawi"
    ],
    applyUrl: "/borrower",
    isFeatured: true,
    targetAudience: "borrower"
  },
  {
    id: 5,
    categoryId: 5,
    categorySlug: "pendanaan-investor",
    name: "Pendanaan Proyek Produktif UMKM (Lender)",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/namia_mudharabah_lender.jpg",
    description: "Wadah bagi para pendana (investor ritel & institusi) untuk menyalurkan dana ke proyek UMKM produktif pilihan dengan imbal hasil bagi hasil riil, transparan, dan terproteksi mitigasi risiko.",
    minAmount: 1000000,
    maxAmount: 500000000,
    minTenorMonths: 3,
    maxTenorMonths: 12,
    interestRateAnnual: 14.5,
    adminFee: 0,
    rating: 5.0,
    shariaAccredited: true,
    contractType: "Mudharabah Muqayyadah",
    features: [
      "Bagi Hasil Riil Kompetitif Ekuivalen 12% - 18% p.a.",
      "UMKM Terverifikasi Uji Tuntas Finansial & Karakter (5C)",
      "Mitigasi Risiko & Proteksi Asuransi Pembiayaan",
      "Monitoring Kinerja Portofolio Secara Real-Time"
    ],
    applyUrl: "/investor",
    isFeatured: true,
    targetAudience: "investor"
  },
  {
    id: 6,
    categoryId: 6,
    categorySlug: "supply-chain",
    name: "Pembiayaan Ekosistem Rantai Pasok (Supply Chain)",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/namia_supply_chain.jpg",
    description: "Pembiayaan terintegrasi bagi jaringan distributor, agen, dan sub-dealer UMKM dalam satu rantai pasok terverifikasi dengan limit bergulir untuk menjamin kelancaran perputaran barang.",
    minAmount: 50000000,
    maxAmount: 1500000000,
    minTenorMonths: 1,
    maxTenorMonths: 3,
    interestRateAnnual: 9.5,
    adminFee: 100000,
    rating: 4.9,
    shariaAccredited: true,
    contractType: "Murabahah & Wakalah",
    features: [
      "Plafon Bergulir (Revolving Credit Line) Otomatis",
      "Persetujuan Cepat untuk Repeat Order Terverifikasi",
      "Koneksi Ekosistem Terintegrasi Distributor & Agen",
      "Mendukung Ketahanan Rantai Pasok Pangan & Ritel"
    ],
    applyUrl: "/borrower",
    isFeatured: true,
    targetAudience: "both"
  }
];

export const initialPersonil: PersonilData[] = [
  {
    id: 1,
    fullName: "DR. Endy M. Astiwara, MA, FIIS",
    jobLevel: 1,
    jobTitle: "Ketua Dewan Pengawas Syariah (DPS)",
    biography: "Doktor Ekonomi Syariah UIN Syarif Hidayatullah Jakarta dan pemegang sertifikasi Ahli Syariah Pasar Modal (ASPM). Beliau telah berpengalaman lebih dari 15 tahun mengawasi kepatuhan fiqih muamalah pada berbagai institusi perbankan dan pasar modal syariah nasional.",
    photo: "/images/team/p_endi_dps_sq.jpeg",
    department: "Dewan Pengawas Syariah",
    education: "Doktor Ekonomi Syariah UIN Syarif Hidayatullah Jakarta & ASPM"
  },
  {
    id: 2,
    fullName: "H. M. Fachry Maulana, MM",
    jobLevel: 1,
    jobTitle: "Anggota Dewan Pengawas Syariah (DPS)",
    biography: "Alumnus Institut Teknologi Bandung (ITB) dan Magister Manajemen. Mengantongi sertifikasi BSMR/LSPP Level III serta Credit Skill Analytic Certificate Omega USA. Berpengalaman 15+ tahun di industri perbankan syariah.",
    photo: "/images/team/p_fahri_dps_sq.jpeg",
    department: "Dewan Pengawas Syariah",
    education: "Magister Manajemen, Alumnus ITB & BSMR Level III"
  },
  {
    id: 3,
    fullName: "Ramzi A. Zuhdi, SE, MS",
    jobLevel: 2,
    jobTitle: "Komisaris Utama (President Commissioner)",
    biography: "Alumnus Fakultas Ekonomi Universitas Gadjah Mada dan Iowa State University (USA). Berpengalaman sebagai pengawas bank di Bank Indonesia selama lebih dari 30 tahun serta menjabat komisaris di berbagai lembaga perbankan syariah terkemuka.",
    photo: "/images/team/p_ramzi_sq.jpeg",
    department: "Dewan Komisaris",
    education: "Iowa State University (USA) & Universitas Gadjah Mada"
  },
  {
    id: 4,
    fullName: "Kuseryansyah",
    jobLevel: 2,
    jobTitle: "Komisaris (Commissioner)",
    biography: "Alumnus Universitas Padjadjaran Bandung dan IPMI International Business School. Memiliki rekam jejak lebih dari 22 tahun di sektor Industri Keuangan Non-Bank (IKNB) dan ekosistem asosiasi fintech Indonesia.",
    photo: "/images/team/p_kuseryansyah_sq.jpeg",
    department: "Dewan Komisaris",
    education: "IPMI International Business School & Universitas Padjadjaran"
  },
  {
    id: 5,
    fullName: "Ir. Syauki, MBA",
    jobLevel: 3,
    jobTitle: "Direktur Utama (Chief Executive Officer)",
    biography: "Lulusan Institut Teknologi Bandung (ITB) dan meraih gelar MBA dari Nanyang Technological University (NTU Singapore). Berpengalaman lebih dari dua dekade memimpin inovasi teknologi, ventura fintech, dan kewirausahaan sosial.",
    photo: "/images/team/p_syauqi_sq.jpg",
    department: "Direksi",
    education: "MBA NTU Singapore & Institut Teknologi Bandung (ITB)"
  },
  {
    id: 6,
    fullName: "Krisna S. Gunawan, MSc",
    jobLevel: 3,
    jobTitle: "Direktur Teknologi & Operasional (CTO/COO)",
    biography: "Alumnus ITB, University of Twente, dan Queensland University of Technology. Memimpin arsitektur sistem informasi berkecepatan tinggi, tata kelola keamanan ISO 27001, dan transformasi digital Namia Syariah.",
    photo: "/images/team/p_krisna_sq.jpeg",
    department: "Direksi",
    education: "Queensland Univ of Tech, Univ of Twente, ITB"
  },
  {
    id: 7,
    fullName: "Wuliandari Tri Putri, SP",
    jobLevel: 4,
    jobTitle: "Head of Underwriting & Sharia Financing",
    biography: "Alumni Institut Pertanian Bogor dengan pengalaman luas dalam penilaian kelayakan kredit, analisis risiko UMKM, dan kepatuhan penyaluran pembiayaan syariah.",
    photo: "/images/team/p_putri_sq.jpeg",
    department: "Manajemen Eksekutif",
    education: "Institut Pertanian Bogor (IPB)"
  },
  {
    id: 8,
    fullName: "Maulana Riki Alamsyah, SE",
    jobLevel: 4,
    jobTitle: "Head of Investor Relations & Institutional Funding",
    biography: "Sarjana Akuntansi dengan pengalaman lebih dari 8 tahun dalam pengelolaan portofolio pendana institusi, perbankan syariah, dan instrumen crowdfunding berkah.",
    photo: "/images/team/p_riki_sq.jpeg",
    department: "Manajemen Eksekutif",
    education: "Sarjana Akuntansi Universitas Terkemuka"
  },
  {
    id: 9,
    fullName: "Asep Athoilah",
    jobLevel: 4,
    jobTitle: "Office Management & Operations Staff",
    biography: "Berpengalaman dalam tata kelola administrasi operasional harian kantor, logistik perlengkapan, dan pendukung tata kelola administrasi perkantoran yang disiplin dan profesional.",
    photo: "/images/team/p_asep_sq.jpeg",
    department: "Manajemen Eksekutif",
    education: "Universitas Indonesia"
  }
];

export const initialFaqCategories = namiaData.categories || [
  { id: 1, name: "Umum & Syariah", description: "Pertanyaan seputar legalitas dan prinsip syariah", isInvestor: 0 },
  { id: 2, name: "Penerima Pembiayaan (Borrower)", description: "Panduan pengajuan dan persyaratan dana", isInvestor: 0 },
  { id: 3, name: "Pendana (Investor / Lender)", description: "Panduan investasi dan imbal hasil", isInvestor: 1 }
];

export const initialFaqs: FaqData[] = (namiaData.faqs || []).map((f: any) => ({
  id: f.id,
  categoryId: f.categoryId,
  categoryName: f.categoryName || "Umum",
  isInvestor: f.isInvestor ?? 0,
  question: f.question,
  answer: f.answer
}));

export const initialBlogPosts: BlogPostData[] = [
  {
    id: 1,
    slug: "memahami-perbedaan-riba-dan-margin-murabahah",
    title: "Memahami Perbedaan Mendasar Antara Riba dan Margin Murabahah",
    excerpt: "Banyak masyarakat masih menganggap pembiayaan syariah sama saja dengan kredit konvensional. Padahal dari sisi substansi akad...",
    author: "DR. Endy M. Astiwara, MA",
    authorRole: "Ketua Dewan Pengawas Syariah",
    date: "28 Feb 2026",
    category: "Fiqih Muamalah",
    readTime: "5 menit baca",
    photo: "/images/blog/grid/1.jpg",
    featured: true,
    summary: "Membongkar miskonsepsi umum masyarakat mengenai perbedaan fundamental antara sistem bunga (riba nasi'ah) pada perbankan konvensional dengan margin keuntungan riil pada akad jual beli Murabahah.",
    takeaway: "Murabahah adalah perniagaan riil dengan barang yang nyata dan risiko yang ditanggung bersama, bukan memperjualbelikan uang dengan uang.",
    publishedAt: "2026-02-28T10:00:00.000Z",
    readTimeMinutes: 5,
    content: [
      "Dalam perdebatan mengenai ekonomi syariah, salah satu pertanyaan yang paling sering diajukan masyarakat adalah: 'Mengapa cicilan syariah terkesan mirip dengan pinjaman bank konvensional?' Pertanyaan ini wajar muncul karena keduanya sama-sama menghasilkan kewajiban pembayaran angsuran bulanan dalam jumlah nominal tertentu.",
      "Namun, kesamaan bentuk luar (zhahir) tidak serta-merta mencerminkan kesamaan hakikat akad (substansi). Dalam perbankan konvensional, transaksi yang terjadi adalah pinjam-meminjam uang (qardh) di mana pemberi pinjaman mensyaratkan adanya kelebihan pengembalian atas pokok hutang. Inilah hakikat Riba Nasi'ah yang secara tegas diharamkan oleh Allah Ta'ala dalam Al-Qur'an surat Al-Baqarah ayat 275: 'Padahal Allah telah menghalalkan jual beli dan mengharamkan riba.'",
      "Sebaliknya, dalam akad Murabahah di Namia Syariah, transaksi yang terjadi adalah murni jual beli (al-bai'). Namia Syariah bertindak sebagai penyedia atau pembeli aset riil yang dibutuhkan oleh nasabah (misalnya bahan baku usaha, mesin produksi, atau armada operasional). Setelah barang tersebut sah dimiliki, barulah barang dijual kembali kepada nasabah dengan harga perolehan ditambah margin keuntungan wajar yang disepakati secara transparan di awal.",
      "Keuntungan yang diperoleh lembaga syariah adalah laba dagang atas kepemilikan aset yang berisiko, bukan bunga atas hutang uang. Apabila nasabah mengalami keterlambatan pembayaran karena kesulitan yang sah, lembaga syariah tidak boleh mengenakan denda bunga berjalan (compound interest) yang memperkaya pihak pemodal atas penderitaan nasabah."
    ]
  },
  {
    id: 2,
    slug: "tips-mengajukan-pembiayaan-umkm-lolos-analisis-risiko",
    title: "5 Tips Mengajukan Pembiayaan Modal Usaha UMKM Agar Cepat Lolos Analisis Risiko",
    excerpt: "Bagi pelaku UMKM yang ingin memperluas kapasitas produksi, pengajuan pembiayaan seringkali terkendala oleh kelengkapan administrasi...",
    author: "Wuliandari Tri Putri, SP",
    authorRole: "Head of Underwriting & Credit Risk",
    date: "25 Feb 2026",
    category: "Tips Bisnis & UMKM",
    readTime: "4 menit baca",
    photo: "/images/blog/grid/2.jpg",
    featured: false,
    summary: "Panduan praktis bagi wirausahawan dan pemilik UMKM dalam menyiapkan dokumen legalitas, pembukuan keuangan, dan proyeksi arus kas agar proses persetujuan pembiayaan berjalan lancar.",
    takeaway: "Kunci utama persetujuan pembiayaan adalah pemisahan rekening pribadi dan usaha, serta transparansi mutasi keuangan.",
    publishedAt: "2026-02-25T09:30:00.000Z",
    readTimeMinutes: 4,
    content: [
      "Salah satu kendala terbesar yang dihadapi pelaku usaha mikro, kecil, dan menengah (UMKM) saat membutuhkan tambahan modal kerja adalah proses verifikasi dan analisis risiko (underwriting) yang seringkali memakan waktu atau bahkan berujung penolakan.",
      "Di Namia Syariah, proses underwriting dirancang secara prudent namun tetap ramah UMKM. Penilaian kami tidak semata-mata bertumpu pada jaminan kebendaan (collateral), melainkan lebih mengutamakan kelayakan usaha dan integritas karakter pemilik usaha (character and capacity).",
      "Berikut lima langkah strategis yang perlu dipersiapkan sebelum mengajukan pembiayaan:",
      "1. Pisahkan Keuangan Pribadi dan Rekening Operasional Usaha: Rekening koran yang rapi dan mencerminkan transaksi perniagaan murni mempermudah penaksiran omzet riil.",
      "2. Rapikan Legalitas Usaha (NIB & Izin Edar): Memiliki Nomor Induk Berusaha (NIB) berbasis risiko membuktikan kepatuhan hukum dan kredibilitas bisnis Anda.",
      "3. Siapkan Salinan Purchase Order (PO) atau Kontrak Kerja: Bukti permintaan pasar yang nyata adalah faktor pendorong terkuat disetujuinya pembiayaan invoice financing.",
      "4. Transparansi Riwayat Kredit (SLIK OJK): Pastikan riwayat kolektibilitas perbankan Anda dalam kategori lancar (Kolek 1) tanpa catatan gagal bayar macet.",
      "5. Rencana Penggunaan Dana yang Jelas: Uraikan secara presisi untuk apa modal tersebut digunakan dan bagaimana siklus perputaran dananya menghasilkan laba."
    ]
  },
  {
    id: 3,
    slug: "potensi-sukuk-ritel-sebagai-investasi-aman-bebas-riba",
    title: "Potensi Sukuk Ritel & P2P Lending: Solusi Investasi Halal dengan Imbal Hasil Riil",
    excerpt: "Instrumen investasi berbasis syariah semakin diminati generasi muda. Pahami bagaimana diversifikasi portofolio pada pembiayaan proyek UMKM...",
    author: "Maulana Riki Alamsyah, SE",
    authorRole: "Head of Investor Relations",
    date: "20 Feb 2026",
    category: "Investasi Syariah",
    readTime: "6 menit baca",
    photo: "/images/blog/grid/3.jpg",
    featured: false,
    summary: "Eksplorasi instrumen investasi syariah modern seperti Sukuk Wakalah dan P2P Lending produktif yang menawarkan imbal hasil kompetitif berlandaskan proyek riil.",
    takeaway: "Investasi syariah tidak hanya memberikan return finansial yang kompetitif, tetapi juga dampak sosial yang nyata bagi perputaran ekonomi umat.",
    publishedAt: "2026-02-20T14:15:00.000Z",
    readTimeMinutes: 6,
    content: [
      "Bagi masyarakat muslim modern, menumbuhkan kekayaan bukan semata tentang mengejar angka persentase return tertinggi, melainkan memastikan bahwa setiap rupiah keuntungan yang diperoleh halal, bersih, dan menentramkan jiwa.",
      "Dalam beberapa tahun terakhir, instrumen P2P Financing Syariah dan Sukuk Wakalah mengalami lonjakan minat yang signifikan dari kalangan investor ritel maupun korporasi. Alasan utamanya adalah adanya underlying asset atau proyek riil yang mendasari setiap pendanaan.",
      "Berbeda dengan instrumen pasar uang konvensional yang kerap kali sarat dengan spekulasi, pendanaan syariah di Namia mendistribusikan modal langsung ke sektor riil: pengadaan komoditas pertanian, pengerjaan proyek pengadaan pemerintah (e-katalog), hingga modernisasi mesin industri tekstil.",
      "Dengan proyeksi imbal hasil bersih (nisbah bagi hasil) berkisar antara 12% hingga 18% per tahun, pendana tidak hanya mendapatkan imbal hasil yang jauh melampaui inflasi, melainkan turut menjadi bagian dari roda penggerak kemandirian ekonomi nasional."
    ]
  },
  {
    id: 4,
    slug: "mengenal-akad-musyarakah-mutanaqisah-pembiayaan-aset",
    title: "Mengenal Akad Musyarakah Mutanaqisah (MMQ) untuk Kepemilikan Aset Produktif",
    excerpt: "Bagaimana akad kemitraan kepemilikan berkurang (MMQ) memberikan solusi kepemilikan alat berat dan properti usaha tanpa sistem denda...",
    author: "H. M. Fachry Maulana, MM",
    authorRole: "Anggota Dewan Pengawas Syariah",
    date: "14 Feb 2026",
    category: "Fiqih Muamalah",
    readTime: "5 menit baca",
    photo: "/images/blog/grid/4.jpg",
    featured: false,
    summary: "Kupas tuntas mekanisme akad Musyarakah Mutanaqisah dalam pengadaan aset modal kerja seperti properti komersial, ruko, dan kendaraan operasional.",
    takeaway: "MMQ adalah solusi kemitraan adil di mana porsi kepemilikan aset secara bertahap beralih 100% menjadi milik pengusaha seiring pembayaran sewa dan pembelian porsi modal.",
    publishedAt: "2026-02-14T08:00:00.000Z",
    readTimeMinutes: 5,
    content: [
      "Musyarakah Mutanaqisah (MMQ) secara terminologi fiqih adalah bentuk syirkah (kemitraan) di mana salah satu pihak berjanji untuk membeli porsi kepemilikan pihak lainnya secara bertahap hingga kepemilikan aset tersebut beralih seutuhnya.",
      "Skema ini sangat ideal diterapkan untuk pengadaan aset berharga tinggi (capital expenditure) bagi pelaku bisnis, seperti pembelian tempat usaha (ruko), armada logistik, atau mesin industri berskala besar.",
      "Mekanismenya sangat elegan dan berkeadilan: Namia Syariah dan pengusaha bersama-sama mengumpulkan modal untuk membeli aset tersebut. Sebagai contoh, pengusaha menyertakan 20% modal dan Namia menyertakan 80% modal. Aset kemudian disewakan (ijarah) kepada pengusaha untuk operasional usahanya.",
      "Setiap bulan, pengusaha membayar biaya sewa atas pemanfaatan aset tersebut sekaligus membeli sebagian porsi kepemilikan milik Namia. Seiring berjalannya waktu, porsi Namia menyusut dari 80% menjadi 60%, 40%, 20%, hingga akhirnya 0%, dan aset tersebut secara mutlak menjadi milik penuh sang pengusaha tanpa adanya riba ataupun penalti zalim."
    ]
  }
];

const CMS_STORAGE_FILE = path.join(import.meta.dir, "cms_state.json");

// Persistent Database State Manager with Auto-Save
export class MockDatabase {
  categories: CategoryData[] = [];
  products: ProductData[] = [];
  leads: LeadData[] = [];
  stats: StatData[] = [];
  personil: PersonilData[] = [];
  faqCategories: any[] = [];
  faqs: FaqData[] = [];
  blogPosts: BlogPostData[] = [];
  siteSettings: SiteSettings = { ...initialSiteSettings };
  heroContent: HeroContent = { ...initialHeroContent };
  philosophies: PhilosophyData[] = [];
  testimonials: TestimonialData[] = [];
  missions: MissionData[] = [];
  clients: ClientData[] = [];
  supervise: SuperviseData[] = [];
  mediaCoverage: any[] = [];
  awards: CompanyAwardData[] = [];
  activityDocs: ActivityDocData[] = [];
  borrowerInfo: BorrowerInfo = { ...initialBorrowerInfo };
  investorInfo: InvestorInfo = { ...initialInvestorInfo };
  riskDisclaimers: string[] = [...initialRiskDisclaimers];

  nextLeadId = 1;
  nextProductId = 100;
  nextBlogId = 100;
  nextFaqId = 100;
  nextPersonilId = 100;
  nextTestimonialId = 100;

  constructor() {
    this.loadState();
  }

  // Load from disk or initialize with Namia Syariah defaults
  loadState() {
    try {
      if (fs.existsSync(CMS_STORAGE_FILE)) {
        const raw = fs.readFileSync(CMS_STORAGE_FILE, "utf-8");
        const parsed = JSON.parse(raw);

        this.siteSettings = parsed.siteSettings || { ...initialSiteSettings };
        this.heroContent = parsed.heroContent || { ...initialHeroContent };
        this.categories = parsed.categories?.length ? parsed.categories : [...initialCategories];
        this.products = parsed.products?.length ? parsed.products : [...initialProducts];
        this.stats = parsed.stats?.length ? parsed.stats : [...initialStats];
        this.personil = parsed.personil?.length ? parsed.personil : [...initialPersonil];
        this.faqCategories = parsed.faqCategories?.length ? parsed.faqCategories : [...initialFaqCategories];
        this.faqs = parsed.faqs?.length ? parsed.faqs : [...initialFaqs];
        this.blogPosts = parsed.blogPosts?.length ? parsed.blogPosts : [...initialBlogPosts];
        this.philosophies = parsed.philosophies?.length ? parsed.philosophies : [...initialPhilosophies];
        this.testimonials = parsed.testimonials?.length ? parsed.testimonials : [...initialTestimonials];
        this.missions = parsed.missions?.length ? parsed.missions : [...initialMissions];
        this.clients = parsed.clients?.length ? parsed.clients : [...initialClients];
        this.supervise = parsed.supervise?.length ? parsed.supervise : [...initialSupervise];
        this.mediaCoverage = parsed.mediaCoverage?.length ? parsed.mediaCoverage : [...initialMediaCoverage];
        this.awards = parsed.awards?.length ? parsed.awards : [...initialAwards];
        this.activityDocs = parsed.activityDocs?.length ? parsed.activityDocs : [...initialActivityDocs];
        this.borrowerInfo = parsed.borrowerInfo || { ...initialBorrowerInfo };
        this.investorInfo = parsed.investorInfo || { ...initialInvestorInfo };
        this.riskDisclaimers = parsed.riskDisclaimers?.length ? parsed.riskDisclaimers : [...initialRiskDisclaimers];
        this.leads = parsed.leads || [];

        console.log(`[CMS State] Loaded persistent content state from ${CMS_STORAGE_FILE}`);
        return;
      }
    } catch (e) {
      console.warn("[CMS State] Failed loading persistent state, fallback to defaults:", e);
    }

    this.resetToDefaults();
  }

  // Save current state to JSON file
  saveState() {
    try {
      const dump = {
        updatedAt: new Date().toISOString(),
        siteSettings: this.siteSettings,
        heroContent: this.heroContent,
        categories: this.categories,
        products: this.products,
        stats: this.stats,
        personil: this.personil,
        faqCategories: this.faqCategories,
        faqs: this.faqs,
        blogPosts: this.blogPosts,
        philosophies: this.philosophies,
        testimonials: this.testimonials,
        missions: this.missions,
        clients: this.clients,
        supervise: this.supervise,
        mediaCoverage: this.mediaCoverage,
        awards: this.awards,
        activityDocs: this.activityDocs,
        borrowerInfo: this.borrowerInfo,
        investorInfo: this.investorInfo,
        riskDisclaimers: this.riskDisclaimers,
        leads: this.leads
      };
      fs.writeFileSync(CMS_STORAGE_FILE, JSON.stringify(dump, null, 2), "utf-8");
    } catch (e) {
      console.error("[CMS State] Failed saving state to file:", e);
    }
  }

  // Reset to initial Namia Syariah defaults
  resetToDefaults() {
    this.siteSettings = { ...initialSiteSettings };
    this.heroContent = { ...initialHeroContent };
    this.categories = [...initialCategories];
    this.products = [...initialProducts];
    this.stats = [...initialStats];
    this.personil = [...initialPersonil];
    this.faqCategories = [...initialFaqCategories];
    this.faqs = [...initialFaqs];
    this.blogPosts = [...initialBlogPosts];
    this.philosophies = [...initialPhilosophies];
    this.testimonials = [...initialTestimonials];
    this.missions = [...initialMissions];
    this.clients = [...initialClients];
    this.supervise = [...initialSupervise];
    this.mediaCoverage = [...initialMediaCoverage];
    this.awards = [...initialAwards];
    this.activityDocs = [...initialActivityDocs];
    this.borrowerInfo = { ...initialBorrowerInfo };
    this.investorInfo = { ...initialInvestorInfo };
    this.riskDisclaimers = [...initialRiskDisclaimers];
    this.saveState();
  }

  // Backward compatibility alias for companyInfo
  get companyInfo() {
    return this.siteSettings;
  }

  // Lead management
  addLead(lead: Omit<LeadData, "id" | "kycStep" | "status" | "createdAt">): LeadData {
    const newLead: LeadData = {
      ...lead,
      id: this.nextLeadId++,
      kycStep: 1,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    this.leads.push(newLead);
    this.saveState();
    return newLead;
  }

  updateLeadKyc(id: number, stepData: Partial<LeadData> & { step: number }): LeadData | null {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) return null;
    Object.assign(lead, stepData);
    lead.kycStep = stepData.step;
    if (stepData.step >= 4) {
      lead.status = "verified";
    }
    this.saveState();
    return lead;
  }
}

export const mockDb = new MockDatabase();
