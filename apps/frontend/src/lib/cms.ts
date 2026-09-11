import { writable, get } from "svelte/store";
import { API_BASE_URL, NAMIA_API_KEY } from "./api";

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

export interface PhilosophyData {
  id: number;
  title: string;
  arabicTitle: string;
  description: string;
  icon: string;
  badge: string;
}

export interface StatData {
  id: number;
  title?: string;
  amount?: string;
  unit?: string;
  icon: string;
  subtitle?: string;
  sublabel?: string;
  sub?: string;
  metricKey?: string;
  label?: string;
  value?: string;
  category?: string;
  order?: number;
}

export interface ProductData {
  id: number;
  categoryId?: number;
  categorySlug?: string;
  name: string;
  provider?: string;
  logo: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTenorMonths: number;
  maxTenorMonths: number;
  interestRateAnnual: number;
  adminFee?: number;
  rating?: number;
  shariaAccredited?: boolean;
  contractType: string;
  features: string[];
  applyUrl: string;
  isFeatured?: boolean;
  targetAudience?: "borrower" | "investor" | "both";
  slug?: string;
  tagline?: string;
  status?: string;
}

export interface TestimonialData {
  id: number;
  name: string;
  role: string;
  businessName: string;
  avatar: string;
  content: string;
  rating: number;
  type?: "borrower" | "investor";
  fundedAmount?: string;
}

export interface PersonilData {
  id: number;
  fullName?: string;
  fullname: string;
  jobLevel?: number; // 1: DPS, 2: Komisaris, 3: Direksi, 4: Manajemen
  job_level: number;
  jobTitle?: string;
  job_title: string;
  biography: string;
  photo: string;
  department?: string;
  education?: string;
}

export interface BlogPostData {
  id: number;
  slug: string;
  title: string;
  content: string | string[];
  excerpt: string;
  photo?: string;
  coverImage?: string;
  imageUrl?: string;
  image?: string;
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
  tags?: string[];
}

export interface FaqData {
  id: number;
  categoryId?: number;
  categoryName?: string;
  isInvestor?: number;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  q?: string;
  a?: string;
}

export interface ClientData {
  id: number;
  name: string;
  picture?: string;
  logo?: string;
  category?: string;
}

export interface SuperviseData {
  id: number;
  name: string;
  image?: string;
  logo?: string;
  role?: string;
}

export interface MissionData {
  id: number;
  title: string;
  content: string;
  icon: string;
  color: string;
}

export interface CompanyAwardData {
  id: number;
  name: string;
  image: string;
  description?: string;
  desc?: string;
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
}

// Fallback initial state so page renders instantaneously with zero FOEC
export const defaultSiteSettings: SiteSettings = {
  brandName: "Namia Syariah",
  companyName: "PT Namia Finansial Teknologi",
  tagline: "Smart Growth, Halal Impact",
  subtagline: "Platform Finansial & P2P Financing Syariah berbasis Fiqih Muamalah untuk pertumbuhan riil, berkeadilan, dan berkelanjutan.",
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
      "Sahabat Namia, lahirnya Namia Syariah berakar dari filosofi An-Namaa' (النَّمَاء) — yakni pertumbuhan yang riil, subur, berdaya guna, dan sarat keberkahan.",
      "Melalui moto 'Smart Growth, Halal Impact', Namia Syariah berkomitmen mengeliminasi praktik riba, spekulasi (gharar), dan ketidakadilan finansial.",
      "Wassalamu'alaikum warahmatullahi wabarakatuh."
    ]
  }
};

export const defaultHeroContent: HeroContent = {
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

export const defaultPhilosophies: PhilosophyData[] = [
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
    arabicTitle: "'Adalah wa La Riba (العدالة ولا رiba)",
    description: "Tanpa bunga majemuk, tanpa denda beranak pinak, dan tanpa akad ganda yang menjebak. Seluruh keuntungan disepakati transparan.",
    icon: "Scale",
    badge: "Transparansi Penuh"
  },
  {
    id: 3,
    title: "Dampak Berkah Sosial",
    arabicTitle: "Atsar Al-Barakah (أثر البركة)",
    description: "Setiap pembiayaan ditujukan untuk menggerakkan roda UMKM, membuka lapangan kerja baru, dan memberdayakan komunitas pengusaha.",
    icon: "HeartHandshake",
    badge: "Sosial & Berdaya"
  },
  {
    id: 4,
    title: "Kepatuhan Syariah Mutlak",
    arabicTitle: "Al-Imtitsal Asy-Syar'i (الامتثال الشرعي)",
    description: "Diawasi langsung oleh Dewan Pengawas Syariah tersertifikasi DSN-MUI dan berizin OJK untuk menjamin kemurnian fiqih muamalah.",
    icon: "ShieldCheck",
    badge: "Diawasi DPS & OJK"
  }
];

export const defaultStats: StatData[] = [
  { id: 1, title: "Total Dana Tersalurkan", amount: "Rp 2,45 Triliun", unit: "", icon: "TrendingUp", subtitle: "Sejak awal beroperasi" },
  { id: 2, title: "Tingkat Keberhasilan 90 Hari (TKB90)", amount: "99,82%", unit: "", icon: "ShieldCheck", subtitle: "Kualitas portofolio prima" },
  { id: 3, title: "Mitra Penerima Pembiayaan", amount: "18.420+", unit: "UMKM", icon: "Users", subtitle: "Tersebar di 27 provinsi" },
  { id: 4, title: "Pemberi Dana Aktif", amount: "42.500+", unit: "Mitra", icon: "UserCheck", subtitle: "Investor retail & institusi" },
  { id: 5, title: "Indeks Kepuasan Pengguna", amount: "4,9 / 5,0", unit: "Bintang", icon: "Award", subtitle: "Dari 15.000+ ulasan" }
];

export const defaultProducts: ProductData[] = [
  {
    id: 1,
    categoryId: 1,
    categorySlug: "p2p-lending",
    name: "Pembiayaan Pengadaan Barang (Murabahah)",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/_1_barang.jpg",
    description: "Pembiayaan Jual Beli Barang (Murabahah) untuk pengadaan mesin, bahan baku, perlengkapan toko, dan aset produktif halal.",
    minAmount: 2000000,
    maxAmount: 100000000,
    minTenorMonths: 3,
    maxTenorMonths: 24,
    interestRateAnnual: 8.5,
    adminFee: 50000,
    rating: 4.9,
    shariaAccredited: true,
    contractType: "Murabahah",
    features: [
      "Akad Jual Beli Murabahah Jelas & Transparan",
      "Margin Flat Pasti Tanpa Bunga Berbunga",
      "Barang Langsung Dibelikan Sesuai Kebutuhan",
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
    name: "Kemitraan Modal Usaha (Musyarakah)",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/_3_usaha.jpg",
    description: "Kemitraan permodalan bagi hasil riil untuk ekspansi outlet, peningkatan kapasitas produksi, dan proyek usaha UMKM yang sedang berkembang.",
    minAmount: 10000000,
    maxAmount: 500000000,
    minTenorMonths: 6,
    maxTenorMonths: 36,
    interestRateAnnual: 12.5,
    adminFee: 150000,
    rating: 4.9,
    shariaAccredited: true,
    contractType: "Musyarakah",
    features: [
      "Kemitraan Berkeadilan (Bagi Hasil Riil Sesuai Nisbah)",
      "Plafon Pendanaan Hingga Rp 500 Juta",
      "Pendampingan Manajemen & Mentoring Bisnis",
      "Keterbukaan Laporan Keuangan Berkala"
    ],
    applyUrl: "/borrower",
    isFeatured: true,
    targetAudience: "both"
  },
  {
    id: 3,
    categoryId: 1,
    categorySlug: "p2p-lending",
    name: "Pembiayaan Sewa & Manfaat Jasa (Ijarah)",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/_2_jasa.jpg",
    description: "Pembiayaan sewa manfaat jasa untuk kebutuhan pendidikan, pelatihan profesi karyawan, sewa tempat usaha, dan layanan penting lainnya.",
    minAmount: 2000000,
    maxAmount: 50000000,
    minTenorMonths: 3,
    maxTenorMonths: 18,
    interestRateAnnual: 8.0,
    adminFee: 35000,
    rating: 4.8,
    shariaAccredited: true,
    contractType: "Ijarah",
    features: [
      "Akad Sewa Manfaat Jasa (Ijarah)",
      "Ujrah (Biaya Layanan) Disepakati di Awal",
      "Tanpa Denda Keterlambatan Ribawi",
      "Verifikasi & Persetujuan Dokumen Cepat"
    ],
    applyUrl: "/borrower",
    isFeatured: true,
    targetAudience: "borrower"
  },
  {
    id: 4,
    categoryId: 3,
    categorySlug: "invoice-financing",
    name: "Invoice & PO Financing Syariah",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/_1_barang.jpg",
    description: "Pembiayaan talangan piutang invoice / purchase order resmi untuk menjaga arus kas operasional vendor korporat dan instansi.",
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
      "Pencairan Cepat (2-3 Hari Kerja)",
      "Underwriting Berdasarkan Kredibilitas Payor",
      "Bebas Riba & Tidak Mengganggu Rasio Hutang Bank"
    ],
    applyUrl: "/borrower",
    isFeatured: true,
    targetAudience: "both"
  },
  {
    id: 5,
    categoryId: 4,
    categorySlug: "pembiayaan-sosial",
    name: "Program Hijrah Bebas Riba (Qardh Al-Hasan)",
    provider: "PT Namia Finansial Teknologi",
    logo: "/images/products/p_qardh.jpg",
    description: "Program kemaslahatan khusus pelunasan bergilir jeratan hutang rentenir dan pinjol ilegal tanpa tambahan biaya bunga sepeserpun.",
    minAmount: 1000000,
    maxAmount: 25000000,
    minTenorMonths: 3,
    maxTenorMonths: 24,
    interestRateAnnual: 0.0,
    adminFee: 0,
    rating: 5.0,
    shariaAccredited: true,
    contractType: "Qardh",
    features: [
      "Murni 0% Bunga & 0% Biaya Tambahan",
      "Pembebasan dari Teror Rentenir & Bunga Jahat",
      "Edukasi Finansial Syariah & Pendampingan Hidup",
      "Didukung Komunitas Peduli & Dana Kebajikan"
    ],
    applyUrl: "/borrower",
    isFeatured: true,
    targetAudience: "borrower"
  }
];

export const defaultTestimonials: TestimonialData[] = [
  {
    id: 1,
    name: "Hj. Siti Rahmah",
    role: "Pemilik Usaha",
    businessName: "Rahmah Batik & Fashion, Solo",
    avatar: "/images/team/p_putri_sq.jpeg",
    content: "Alhamdulillah, pembiayaan Murabahah dari Namia Syariah memudahkan pengadaan bahan baku kain saat lonjakan pesanan menjelang Ramadhan. Tidak ada bunga ribawi, harganya pasti, dan berkah bagi seluruh penjahit kami.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 150.000.000"
  },
  {
    id: 2,
    name: "Fajar Wicaksono, S.T.",
    role: "Investor Retail Mandiri",
    businessName: "Profesional IT, Jakarta",
    avatar: "/images/team/p_riki_sq.jpeg",
    content: "Sebagai pendana, ketenangan batin nomor satu. Di Namia Syariah, akadnya jelas (Musyarakah/Mudharabah), proyeknya ada di dunia nyata, dan pengembalian bagi hasilnya sangat kompetitif dibanding instrumen konvensional.",
    rating: 5,
    type: "investor",
    fundedAmount: "Pendana Aktif sejak 2023"
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    role: "Direktur Operasional",
    businessName: "PT Sinergi Pangan Nusantara",
    avatar: "/images/team/p_krisna_sq.jpeg",
    content: "Invoice Financing dari Namia Syariah membantu kami menjaga likuiditas cash flow supplier pangan tanpa harus menjaminkan aset berat. Proses digitalnya sangat cepat dan transparan.",
    rating: 5,
    type: "borrower",
    fundedAmount: "Rp 650.000.000"
  }
];

export const defaultMissions: MissionData[] = [
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

export const defaultClients: ClientData[] = [
  { id: 1, name: "Siskem Indonesia", picture: "/images/clients/2_siskem.jpg", category: "Teknologi" },
  { id: 2, name: "Simpatindo", picture: "/images/clients/3_simpatindo.jpg", category: "Distribusi" },
  { id: 3, name: "Kopegtel", picture: "/images/clients/6_kopegtel.jpg", category: "Koperasi" },
  { id: 4, name: "Global Tri Star", picture: "/images/clients/10_global_tri_star.jpg", category: "Logistik" },
  { id: 5, name: "Strivechem", picture: "/images/clients/14_strivechem.jpg", category: "Manufaktur" },
  { id: 6, name: "An Najah Solution", picture: "/images/clients/annsi.jpg", category: "Agribisnis" },
  { id: 7, name: "Awina Sinergi", picture: "/images/clients/awina_sinergi.png", category: "Energi Bersih" },
  { id: 8, name: "BPRS Al Salaam", picture: "/images/clients/bprs-alsalaam.png", category: "Perbankan Syariah" },
  { id: 9, name: "Bukalapak", picture: "/images/clients/bukalapak.png", category: "E-Commerce" },
  { id: 10, name: "Capsugel", picture: "/images/clients/capsugel.jpg", category: "Kesehatan Halal" }
];

export const defaultSupervise: SuperviseData[] = [
  { id: 1, name: "Otoritas Jasa Keuangan (OJK)", image: "/images/home/logo-ojk-indonesia.png", role: "Regulator & Pengawas" },
  { id: 2, name: "Asosiasi Fintech Syariah Indonesia (AFSI)", image: "/images/home/logofintechsyariah.png", role: "Asosiasi Resmi" },
  { id: 3, name: "Kementerian Komunikasi dan Informatika", image: "/images/home/logo-kominfo.png", role: "Penyelenggara Sistem Elektronik" },
  { id: 4, name: "Dewan Syariah Nasional Majelis Ulama Indonesia (DSN-MUI)", image: "/images/home/logo-mui-s.png", role: "Dewan Pengawas Syariah" }
];

export const defaultMediaCoverage = [
  {
    id: 1,
    name: "The Jakarta Post",
    logo: "/images/mediacover/logo-jakarta-post.png",
    title: "Namia Syariah: Pioneering Ethical Sharia P2P Lending for Indonesian MSMEs",
    meta: "The Jakarta Post &middot; Publikasi Finansial",
    source: "The Jakarta Post"
  },
  {
    id: 2,
    name: "Kompas",
    logo: "/images/mediacover/logo-kompas.png",
    title: "Langkah Strategis Namia Syariah Salurkan Rp 2,4 Triliun ke Sektor Riil UMKM",
    meta: "Harian Kompas &middot; Ekonomi Syariah",
    source: "Harian Kompas"
  },
  {
    id: 3,
    name: "Republika Online",
    logo: "/images/mediacover/logo-rol.jpg",
    title: "Solusi Cerdas Pembiayaan Tanpa Riba: Dari Program Pergi Riba hingga Modal Kerja Halal",
    meta: "Republika &middot; Wirausaha Muslim",
    source: "Republika"
  }
];

export const defaultFaqs: FaqData[] = [
  {
    id: 1,
    question: "Apa itu Namia Syariah dan bagaimana cara kerjanya?",
    answer: "Namia Syariah (PT Namia Finansial Teknologi) adalah platform Layanan Pendanaan Bersama Berbasis Teknologi Informasi (LPBBTI) syariah yang mempertemukan penerima pembiayaan (UMKM/individu) dengan para pendana secara langsung tanpa perantara bunga bank (riba).",
    category: "Umum",
    order: 1
  },
  {
    id: 2,
    question: "Apakah transaksi di Namia Syariah halal dan diawasi OJK?",
    answer: "Ya. Namia Syariah telah berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK) serta senantiasa diawasi oleh Dewan Pengawas Syariah (DPS) yang direkomendasikan oleh DSN-MUI untuk menjamin seluruh akad 100% bebas riba, gharar, dan maysir.",
    category: "Kepatuhan Syariah",
    order: 2
  },
  {
    id: 3,
    question: "Akad apa saja yang digunakan dalam pendanaan Namia Syariah?",
    answer: "Kami menggunakan akad-akad muamalah yang sah, antara lain Akad Murabahah (jual-beli dengan margin yang disepakati), Musyarakah (kemitraan bagi hasil), dan Ijarah (sewa guna manfaat aset/jasa).",
    category: "Akad & Syariah",
    order: 3
  },
  {
    id: 4,
    question: "Berapa batas nominal pembiayaan yang dapat diajukan?",
    answer: "Untuk pelaku usaha dan UMKM produktif, pembiayaan yang dapat diajukan mulai dari Rp 10.000.000 hingga Rp 2.000.000.000 dengan tenor fleksibel mulai dari 1 bulan hingga 12 bulan.",
    category: "Pembiayaan",
    order: 4
  }
];

export const defaultPersonil: PersonilData[] = [
  {
    id: 1,
    fullname: "DR. Endy M. Astiwara, MA, FIIS",
    fullName: "DR. Endy M. Astiwara, MA, FIIS",
    job_level: 1,
    jobLevel: 1,
    job_title: "Ketua Dewan Pengawas Syariah (DPS)",
    jobTitle: "Ketua Dewan Pengawas Syariah (DPS)",
    biography: "Doktor Ekonomi Syariah UIN Syarif Hidayatullah Jakarta dan pemegang sertifikasi Ahli Syariah Pasar Modal (ASPM). Berpengalaman 15+ tahun mengawasi kepatuhan fiqih muamalah pada institusi perbankan dan pasar modal syariah nasional.",
    photo: "/images/team/p_endi_dps_sq.jpeg",
    department: "Dewan Pengawas Syariah",
    education: "S3 UIN Syarif Hidayatullah Jakarta"
  },
  {
    id: 2,
    fullname: "H. M. Fachry Maulana, MM",
    fullName: "H. M. Fachry Maulana, MM",
    job_level: 1,
    jobLevel: 1,
    job_title: "Anggota Dewan Pengawas Syariah (DPS)",
    jobTitle: "Anggota Dewan Pengawas Syariah (DPS)",
    biography: "Alumnus Institut Teknologi Bandung (ITB) dan Magister Manajemen. Mengantongi sertifikasi BSMR/LSPP Level III serta Credit Skill Analytic Certificate Omega USA.",
    photo: "/images/team/p_fahri_dps_sq.jpeg",
    department: "Dewan Pengawas Syariah",
    education: "S1 ITB & S2 Magister Manajemen"
  },
  {
    id: 3,
    fullname: "Ramzi A. Zuhdi, SE, MS",
    fullName: "Ramzi A. Zuhdi, SE, MS",
    job_level: 2,
    jobLevel: 2,
    job_title: "Komisaris Utama (President Commissioner)",
    jobTitle: "Komisaris Utama (President Commissioner)",
    biography: "Alumnus Fakultas Ekonomi UGM dan Iowa State University (USA). Berpengalaman sebagai pengawas bank di Bank Indonesia selama lebih dari 30 tahun.",
    photo: "/images/team/p_ramzi_sq.jpeg",
    department: "Dewan Komisaris",
    education: "FE UGM & Iowa State University"
  },
  {
    id: 4,
    fullname: "Kuseryansyah",
    fullName: "Kuseryansyah",
    job_level: 2,
    jobLevel: 2,
    job_title: "Komisaris (Commissioner)",
    jobTitle: "Komisaris (Commissioner)",
    biography: "Alumnus Unpad dan IPMI International Business School. Memiliki rekam jejak lebih dari 22 tahun di sektor Industri Keuangan Non-Bank (IKNB) dan asosiasi fintech.",
    photo: "/images/team/p_kuseryansyah_sq.jpeg",
    department: "Dewan Komisaris",
    education: "Universitas Padjadjaran & IPMI"
  },
  {
    id: 5,
    fullname: "Ir. Syauki, MBA",
    fullName: "Ir. Syauki, MBA",
    job_level: 3,
    jobLevel: 3,
    job_title: "Direktur Utama (Chief Executive Officer)",
    jobTitle: "Direktur Utama (Chief Executive Officer)",
    biography: "Lulusan Teknik Elektro ITB dan MBA dari Nanyang Technological University (NTU Singapore). Berpengalaman lebih dari 20 tahun memimpin inovasi teknologi finansial.",
    photo: "/images/team/p_syauqi_sq.jpg",
    department: "Direksi",
    education: "S1 ITB & MBA NTU Singapore"
  },
  {
    id: 6,
    fullname: "Krisna S. Gunawan, MSc",
    fullName: "Krisna S. Gunawan, MSc",
    job_level: 3,
    jobLevel: 3,
    job_title: "Direktur Teknologi & Operasional (CTO/COO)",
    jobTitle: "Direktur Teknologi & Operasional (CTO/COO)",
    biography: "Alumnus ITB, University of Twente, dan QUT. Memimpin arsitektur sistem informasi berkecepatan tinggi, tata kelola keamanan ISO 27001, dan transformasi digital Namia Syariah.",
    photo: "/images/team/p_krisna_sq.jpeg",
    department: "Direksi",
    education: "ITB, Univ of Twente & QUT"
  },
  {
    id: 7,
    fullname: "Wuliandari Tri Putri, SP",
    fullName: "Wuliandari Tri Putri, SP",
    job_level: 4,
    jobLevel: 4,
    job_title: "Head of Underwriting & Sharia Financing",
    jobTitle: "Head of Underwriting & Sharia Financing",
    biography: "Alumni IPB dengan pengalaman luas dalam penilaian kelayakan kredit, analisis risiko UMKM, dan kepatuhan penyaluran pembiayaan syariah.",
    photo: "/images/team/p_putri_sq.jpeg",
    department: "Manajemen Eksekutif",
    education: "Institut Pertanian Bogor (IPB)"
  },
  {
    id: 8,
    fullname: "Maulana Riki Alamsyah, SE",
    fullName: "Maulana Riki Alamsyah, SE",
    job_level: 4,
    jobLevel: 4,
    job_title: "Head of Investor Relations",
    jobTitle: "Head of Investor Relations",
    biography: "Sarjana Akuntansi dengan pengalaman lebih dari 8 tahun dalam pengelolaan portofolio pendana institusi dan perbankan syariah.",
    photo: "/images/team/p_riki_sq.jpeg",
    department: "Manajemen Eksekutif",
    education: "Sarjana Akuntansi"
  },
  {
    id: 9,
    fullname: "Asep Athoilah",
    fullName: "Asep Athoilah",
    job_level: 4,
    jobLevel: 4,
    job_title: "Office Management & Operations Staff",
    jobTitle: "Office Management & Operations Staff",
    biography: "Berpengalaman dalam tata kelola administrasi operasional harian kantor, logistik perlengkapan, dan pendukung tata kelola administrasi perkantoran yang disiplin dan profesional.",
    photo: "/images/team/p_asep_sq.jpeg",
    department: "Manajemen Eksekutif",
    education: "Universitas Indonesia"
  }
];

export const defaultAwards: CompanyAwardData[] = [
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

export const defaultActivityDocs: ActivityDocData[] = [
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

export const defaultBorrowerInfo: BorrowerInfo = {
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

export const defaultInvestorInfo: InvestorInfo = {
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

export const defaultRiskDisclaimers: string[] = [
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

export const defaultBlogPosts: BlogPostData[] = [
  {
    id: 1,
    slug: "memahami-perbedaan-riba-dan-margin-murabahah",
    title: "Memahami Perbedaan Mendasar Antara Riba dan Margin Murabahah",
    excerpt: "Banyak masyarakat masih menganggap pembiayaan syariah sama saja dengan kredit konvensional. Padahal dari sisi substansi akad...",
    author: "DR. Endy M. Astiwara, MA",
    authorRole: "Ketua Dewan Pengawas Syariah",
    date: "28 Feb 2026",
    category: "Akad Syariah",
    readTime: "5 min read",
    photo: "/images/blog/grid/1.jpg",
    imageUrl: "/images/blog/grid/1.jpg",
    featured: true,
    summary: "Membongkar miskonsepsi umum masyarakat mengenai perbedaan fundamental antara sistem bunga pada perbankan konvensional dengan margin keuntungan riil pada akad jual beli Murabahah.",
    takeaway: "Murabahah adalah perniagaan riil dengan barang nyata dan risiko yang ditanggung bersama, bukan memperjualbelikan uang dengan uang.",
    publishedAt: "2026-02-28T10:00:00.000Z",
    readTimeMinutes: 5,
    content: [
      "Dalam perdebatan mengenai ekonomi syariah, salah satu pertanyaan yang paling sering diajukan masyarakat adalah: 'Mengapa cicilan syariah terkesan mirip dengan pinjaman bank konvensional?' Pertanyaan ini wajar muncul karena keduanya sama-sama menghasilkan kewajiban pembayaran angsuran bulanan dalam jumlah nominal tertentu.",
      "Namun, kesamaan bentuk luar tidak serta-merta mencerminkan kesamaan hakikat akad. Dalam perbankan konvensional, transaksi yang terjadi adalah pinjam-meminjam uang (qardh) di mana pemberi pinjaman mensyaratkan adanya kelebihan pengembalian atas pokok hutang. Inilah hakikat Riba Nasi'ah.",
      "Sebaliknya, dalam akad Murabahah di Namia Syariah, transaksi yang terjadi adalah murni jual beli (al-bai'). Namia Syariah bertindak sebagai penyedia atau pembeli aset riil yang dibutuhkan oleh nasabah. Setelah barang tersebut sah dimiliki, barulah barang dijual kembali kepada nasabah dengan harga perolehan ditambah margin keuntungan wajar yang disepakati secara transparan di awal."
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
    category: "Bisnis UMKM",
    readTime: "4 min read",
    photo: "/images/blog/grid/2.jpg",
    imageUrl: "/images/blog/grid/2.jpg",
    featured: false,
    summary: "Panduan praktis bagi wirausahawan dan pemilik UMKM dalam menyiapkan dokumen legalitas, pembukuan keuangan, dan proyeksi arus kas agar proses persetujuan pembiayaan berjalan lancar.",
    takeaway: "Kunci utama persetujuan pembiayaan adalah pemisahan rekening pribadi dan usaha, serta transparansi mutasi keuangan.",
    publishedAt: "2026-02-25T09:30:00.000Z",
    readTimeMinutes: 4,
    content: [
      "Salah satu kendala terbesar yang dihadapi pelaku usaha mikro, kecil, dan menengah (UMKM) saat membutuhkan tambahan modal kerja adalah proses verifikasi dan analisis risiko yang seringkali memakan waktu.",
      "Di Namia Syariah, proses underwriting dirancang secara prudent namun tetap ramah UMKM. Penilaian kami tidak semata-mata bertumpu pada jaminan kebendaan, melainkan lebih mengutamakan kelayakan usaha dan integritas karakter pemilik usaha."
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
    category: "Sukuk & Investasi",
    readTime: "6 min read",
    photo: "/images/blog/grid/3.jpg",
    imageUrl: "/images/blog/grid/3.jpg",
    featured: false,
    summary: "Edukasi instrumen investasi syariah yang memadukan keamanan akad, transparansi alokasi dana ke sektor produktif, dan potensi imbal hasil kompetitif.",
    takeaway: "Pendanaan syariah menyalurkan modal langsung ke sektor riil yang menghasilkan dampak ekonomi nyata tanpa spekulasi derivatif.",
    publishedAt: "2026-02-20T08:15:00.000Z",
    readTimeMinutes: 6,
    content: [
      "Kesadaran generasi muda Indonesia dalam memilih instrumen investasi yang halal dan etis kian melonjak tajam dalam beberapa tahun terakhir.",
      "Melalui Namia Syariah, para pendana dapat secara langsung memilih proyek atau UMKM yang ingin didanai dengan transparansi penuh atas perputaran dana dan jadwal bagi hasil."
    ]
  }
];

export interface CmsStoreState {
  siteSettings: SiteSettings;
  heroContent: HeroContent;
  philosophies: PhilosophyData[];
  stats: StatData[];
  products: ProductData[];
  testimonials: TestimonialData[];
  missions: MissionData[];
  clients: ClientData[];
  supervise: SuperviseData[];
  mediaCoverage: any[];
  awards: CompanyAwardData[];
  activityDocs: ActivityDocData[];
  borrowerInfo: BorrowerInfo;
  investorInfo: InvestorInfo;
  riskDisclaimers: string[];
  team: PersonilData[];
  faqs: FaqData[];
  blogPosts: BlogPostData[];
  isLoaded: boolean;
  isSyncing: boolean;
  lastSynced: string | null;
  error: string | null;
}

const initialState: CmsStoreState = {
  siteSettings: defaultSiteSettings,
  heroContent: defaultHeroContent,
  philosophies: defaultPhilosophies,
  stats: defaultStats,
  products: defaultProducts,
  testimonials: defaultTestimonials,
  missions: defaultMissions,
  clients: defaultClients,
  supervise: defaultSupervise,
  mediaCoverage: defaultMediaCoverage,
  awards: defaultAwards,
  activityDocs: defaultActivityDocs,
  borrowerInfo: defaultBorrowerInfo,
  investorInfo: defaultInvestorInfo,
  riskDisclaimers: defaultRiskDisclaimers,
  team: defaultPersonil,
  faqs: defaultFaqs,
  blogPosts: defaultBlogPosts,
  isLoaded: false,
  isSyncing: false,
  lastSynced: null,
  error: null
};

// Global Svelte Writable Store for Dynamic Content
export const cmsStore = writable<CmsStoreState>(initialState);

// Helper headers
const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-api-key": NAMIA_API_KEY
});

// Single-trip Aggregated Hydration
export async function fetchCmsContent(customFetch?: typeof fetch | boolean) {
  const fetcher = typeof customFetch === "function" ? customFetch : (typeof window !== "undefined" ? window.fetch : fetch);
  
  cmsStore.update((s) => ({ ...s, isSyncing: true, error: null }));

  try {
    const url = `${API_BASE_URL}/api/content/all`;
    const res = await fetcher(url, {
      headers: getHeaders()
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const json = await res.json();
    if (json.success && json.data) {
      const d = json.data;

      // Normalize team array
      let normalizedTeam: PersonilData[] = defaultPersonil;
      if (d.team) {
        if (Array.isArray(d.team)) {
          normalizedTeam = d.team.map((m: any) => ({
            ...m,
            fullname: m.fullname || m.fullName || "",
            fullName: m.fullName || m.fullname || "",
            job_level: m.job_level ?? m.jobLevel ?? 4,
            jobLevel: m.jobLevel ?? m.job_level ?? 4,
            job_title: m.job_title || m.jobTitle || "",
            jobTitle: m.jobTitle || m.job_title || ""
          }));
        } else if (typeof d.team === "object") {
          const combined = d.team.all || [
            ...(d.team.shariaBoard || []),
            ...(d.team.commissioners || []),
            ...(d.team.directors || []),
            ...(d.team.management || [])
          ];
          normalizedTeam = combined.map((m: any) => ({
            ...m,
            fullname: m.fullname || m.fullName || "",
            fullName: m.fullName || m.fullname || "",
            job_level: m.job_level ?? m.jobLevel ?? 4,
            jobLevel: m.jobLevel ?? m.job_level ?? 4,
            job_title: m.job_title || m.jobTitle || "",
            jobTitle: m.jobTitle || m.job_title || ""
          }));
        }
      }

      cmsStore.update((state) => ({
        ...state,
        siteSettings: d.siteSettings || state.siteSettings,
        heroContent: d.heroContent || state.heroContent,
        philosophies: d.philosophies?.length ? d.philosophies : state.philosophies,
        stats: d.stats?.length ? d.stats : state.stats,
        products: d.products?.length ? d.products : state.products,
        testimonials: d.testimonials?.length ? d.testimonials : state.testimonials,
        missions: d.missions?.length ? d.missions : state.missions,
        clients: d.clients?.length ? d.clients : state.clients,
        supervise: d.supervise?.length ? d.supervise : state.supervise,
        mediaCoverage: d.mediaCoverage || state.mediaCoverage,
        awards: d.awards?.length ? d.awards : state.awards,
        activityDocs: d.activityDocs?.length ? d.activityDocs : state.activityDocs,
        borrowerInfo: d.borrowerInfo || state.borrowerInfo,
        investorInfo: d.investorInfo || state.investorInfo,
        riskDisclaimers: d.riskDisclaimers?.length ? d.riskDisclaimers : state.riskDisclaimers,
        team: normalizedTeam.length ? normalizedTeam : state.team,
        faqs: d.faqs || state.faqs,
        blogPosts: d.blogPosts || state.blogPosts,
        isLoaded: true,
        isSyncing: false,
        lastSynced: new Date().toLocaleTimeString(),
        error: null
      }));
      return json.data;
    }
  } catch (err: any) {
    console.warn("[CMS Store] API sync failed, using default Namia content:", err.message);
    cmsStore.update((s) => ({
      ...s,
      isLoaded: true,
      isSyncing: false,
      error: "Menggunakan data lokal teroptimalisasi (offline fallback)"
    }));
  }
}

// Update Site Settings
export async function updateSiteSettings(data: Partial<SiteSettings>) {
  try {
    cmsStore.update((s) => ({
      ...s,
      siteSettings: {
        ...s.siteSettings,
        ...data,
        socials: { ...s.siteSettings.socials, ...(data.socials || {}) }
      }
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/site-settings`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err: any) {
    console.error("[CMS Store] Failed to update site settings:", err);
    throw err;
  }
}

// Update Hero Content
export async function updateHeroContent(data: Partial<HeroContent>) {
  try {
    cmsStore.update((s) => ({
      ...s,
      heroContent: { ...s.heroContent, ...data }
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/hero`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err: any) {
    console.error("[CMS Store] Failed to update hero content:", err);
    throw err;
  }
}

// Update Philosophies
export async function updatePhilosophies(list: PhilosophyData[]) {
  try {
    cmsStore.update((s) => ({ ...s, philosophies: list }));

    const res = await fetch(`${API_BASE_URL}/api/content/philosophies`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(list)
    });
    return await res.json();
  } catch (err: any) {
    console.error("[CMS Store] Failed to update philosophies:", err);
    throw err;
  }
}

// Products CRUD
export async function createProduct(prod: Omit<ProductData, "id" | "shariaAccredited">) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/content/products`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(prod)
    });
    const json = await res.json();
    if (json.success) {
      cmsStore.update((s) => ({
        ...s,
        products: [json.data, ...s.products]
      }));
    }
    return json;
  } catch (err) {
    console.error("[CMS Store] Failed to create product:", err);
    throw err;
  }
}

export async function updateProduct(id: number, prod: Partial<ProductData>) {
  try {
    cmsStore.update((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, ...prod } : p))
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/products/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(prod)
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to update product:", err);
    throw err;
  }
}

export async function deleteProduct(id: number) {
  try {
    cmsStore.update((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id)
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/products/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to delete product:", err);
    throw err;
  }
}

// Stats CRUD
export async function updateStat(id: number, stat: Partial<StatData>) {
  try {
    cmsStore.update((s) => ({
      ...s,
      stats: s.stats.map((item) => (item.id === id ? { ...item, ...stat } : item))
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/stats/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(stat)
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to update stat:", err);
    throw err;
  }
}

export async function createStat(stat: Omit<StatData, "id">) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/content/stats`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(stat)
    });
    const json = await res.json();
    if (json.success) {
      cmsStore.update((s) => ({
        ...s,
        stats: [...s.stats, json.data]
      }));
    }
    return json;
  } catch (err) {
    console.error("[CMS Store] Failed to create stat:", err);
    throw err;
  }
}

export async function deleteStat(id: number) {
  try {
    cmsStore.update((s) => ({
      ...s,
      stats: s.stats.filter((item) => item.id !== id)
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/stats/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to delete stat:", err);
    throw err;
  }
}

// Blog Posts CRUD
export async function createArticle(article: Omit<BlogPostData, "id" | "publishedAt">) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/content/blogs`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(article)
    });
    const json = await res.json();
    if (json.success) {
      cmsStore.update((s) => ({
        ...s,
        blogPosts: [json.data, ...s.blogPosts]
      }));
    }
    return json;
  } catch (err) {
    console.error("[CMS Store] Failed to create article:", err);
    throw err;
  }
}

export async function updateArticle(id: number, article: Partial<BlogPostData>) {
  try {
    cmsStore.update((s) => ({
      ...s,
      blogPosts: s.blogPosts.map((b) => (b.id === id ? { ...b, ...article } : b))
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/blogs/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(article)
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to update article:", err);
    throw err;
  }
}

export async function deleteArticle(id: number) {
  try {
    cmsStore.update((s) => ({
      ...s,
      blogPosts: s.blogPosts.filter((b) => b.id !== id)
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/blogs/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to delete article:", err);
    throw err;
  }
}

// FAQs CRUD
export async function createFaq(faq: Omit<FaqData, "id">) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/content/faqs`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(faq)
    });
    const json = await res.json();
    if (json.success) {
      cmsStore.update((s) => ({
        ...s,
        faqs: [...s.faqs, json.data]
      }));
    }
    return json;
  } catch (err) {
    console.error("[CMS Store] Failed to create FAQ:", err);
    throw err;
  }
}

export async function updateFaq(id: number, faq: Partial<FaqData>) {
  try {
    cmsStore.update((s) => ({
      ...s,
      faqs: s.faqs.map((f) => (f.id === id ? { ...f, ...faq } : f))
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/faqs/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(faq)
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to update FAQ:", err);
    throw err;
  }
}

export async function deleteFaq(id: number) {
  try {
    cmsStore.update((s) => ({
      ...s,
      faqs: s.faqs.filter((f) => f.id !== id)
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/faqs/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to delete FAQ:", err);
    throw err;
  }
}

// Testimonials CRUD
export async function createTestimonial(test: Omit<TestimonialData, "id">) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/content/testimonials`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(test)
    });
    const json = await res.json();
    if (json.success) {
      cmsStore.update((s) => ({
        ...s,
        testimonials: [json.data, ...s.testimonials]
      }));
    }
    return json;
  } catch (err) {
    console.error("[CMS Store] Failed to create testimonial:", err);
    throw err;
  }
}

export async function deleteTestimonial(id: number) {
  try {
    cmsStore.update((s) => ({
      ...s,
      testimonials: s.testimonials.filter((t) => t.id !== id)
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/testimonials/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to delete testimonial:", err);
    throw err;
  }
}

// Team Personil CRUD
export async function createPersonil(member: Omit<PersonilData, "id">) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/content/team`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(member)
    });
    const json = await res.json();
    if (json.success) {
      cmsStore.update((s) => ({
        ...s,
        team: [...s.team, json.data]
      }));
    }
    return json;
  } catch (err) {
    console.error("[CMS Store] Failed to create personil:", err);
    throw err;
  }
}

export async function updatePersonil(id: number, member: Partial<PersonilData>) {
  try {
    cmsStore.update((s) => ({
      ...s,
      team: s.team.map((t) => (t.id === id ? { ...t, ...member } : t))
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/team/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(member)
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to update personil:", err);
    throw err;
  }
}

export async function deletePersonil(id: number) {
  try {
    cmsStore.update((s) => ({
      ...s,
      team: s.team.filter((t) => t.id !== id)
    }));

    const res = await fetch(`${API_BASE_URL}/api/content/team/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
    return await res.json();
  } catch (err) {
    console.error("[CMS Store] Failed to delete personil:", err);
    throw err;
  }
}

// Reset back to Namia Defaults
export async function resetCmsDefaults() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/content/reset`, {
      method: "POST",
      headers: getHeaders()
    });
    const json = await res.json();
    if (json.success) {
      await fetchCmsContent();
    }
    return json;
  } catch (err) {
    console.error("[CMS Store] Failed to reset defaults:", err);
    throw err;
  }
}

export const resetCmsToDefaults = resetCmsDefaults;
