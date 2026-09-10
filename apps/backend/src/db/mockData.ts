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
  interestRateAnnual: number; // or margin rate
  adminFee: number;
  rating: number;
  shariaAccredited: boolean;
  contractType: string;
  features: string[];
  applyUrl: string;
  isFeatured: boolean;
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
  content: string;
  excerpt: string;
  photo: string;
  author: string;
  category: string;
  publishedAt: string;
}

export interface PersonilData {
  id: number;
  fullName: string;
  jobLevel: number;
  jobTitle: string;
  biography: string;
  photo: string;
  department: string;
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
}

export const initialCategories: CategoryData[] = [
  {
    id: 1,
    slug: "p2p-lending",
    name: "P2P Lending Syariah",
    description: "Pembiayaan produktif dan konsumtif berbasis crowdfunding tanpa riba.",
    icon: "Coins"
  },
  {
    id: 2,
    slug: "asuransi-syariah",
    name: "Asuransi Syariah (Takaful)",
    description: "Perlindungan kesehatan, jiwa, dan aset dengan prinsip tolong-menolong (Ta'awun).",
    icon: "ShieldCheck"
  },
  {
    id: 3,
    slug: "paylater-syariah",
    name: "Paylater Syariah",
    description: "Beli sekarang bayar nanti dengan akad jual beli Murabahah dan biaya transparan.",
    icon: "CreditCard"
  },
  {
    id: 4,
    slug: "reksa-dana-syariah",
    name: "Reksa Dana & Sukuk",
    description: "Instrumen investasi pasar uang dan obligasi syariah berizin OJK.",
    icon: "TrendingUp"
  },
  {
    id: 5,
    slug: "pembiayaan-usaha",
    name: "Pembiayaan Modal Kerja",
    description: "Suntikan modal usaha UMKM menggunakan akad bagi hasil Musyarakah / Mudharabah.",
    icon: "Briefcase"
  }
];

export const initialProducts: ProductData[] = [
  {
    id: 1,
    categoryId: 1,
    categorySlug: "p2p-lending",
    name: "Syarfi Murabahah Retail",
    provider: "PT Syarfi Teknologi Finansial",
    logo: "/images/home/syarfi-logo.png",
    description: "Pembiayaan pembelian barang inventaris dan modal kerja usaha mikro syariah.",
    minAmount: 2000000,
    maxAmount: 50000000,
    minTenorMonths: 3,
    maxTenorMonths: 24,
    interestRateAnnual: 8.5,
    adminFee: 50000,
    rating: 4.9,
    shariaAccredited: true,
    contractType: "Murabahah",
    features: [
      "Tanpa Denda Keterlambatan",
      "Proses Cepat 1x24 Jam",
      "Akad Jual Beli Jelas",
      "Terdaftar & Diawasi DSN-MUI"
    ],
    applyUrl: "/onboarding?prod=1",
    isFeatured: true
  },
  {
    id: 2,
    categoryId: 1,
    categorySlug: "p2p-lending",
    name: "Alami Invoice Financing",
    provider: "Alami Sharia",
    logo: "/images/clients/annsi.jpg",
    description: "Pembiayaan anjak piutang syariah untuk kelancaran arus kas vendor B2B.",
    minAmount: 50000000,
    maxAmount: 2000000000,
    minTenorMonths: 1,
    maxTenorMonths: 6,
    interestRateAnnual: 11.0,
    adminFee: 250000,
    rating: 4.8,
    shariaAccredited: true,
    contractType: "Wakalah bil Ujrah",
    features: [
      "Plafon Hingga 2 Miliar",
      "Pencairan Cepat",
      "Jaminan Invoice Resmi",
      "Bebas Riba & Gharar"
    ],
    applyUrl: "/onboarding?prod=2",
    isFeatured: true
  },
  {
    id: 3,
    categoryId: 2,
    categorySlug: "asuransi-syariah",
    name: "Takaful Sejahtera Keluarga",
    provider: "Asuransi Takaful Keluarga",
    logo: "/images/clients/bprs-alsalaam.png",
    description: "Perlindungan jiwa dan dana santunan meninggal dunia / cacat dengan dana tabarru'.",
    minAmount: 100000,
    maxAmount: 10000000,
    minTenorMonths: 12,
    maxTenorMonths: 120,
    interestRateAnnual: 0,
    adminFee: 25000,
    rating: 4.7,
    shariaAccredited: true,
    contractType: "Tabarru' & Wakalah",
    features: [
      "Klaim Cepat Tanpa Ribet",
      "Surplus Underwriting Dibagikan",
      "Bebas Investasi Saham Haram",
      "Santunan Rawat Inap Cashless"
    ],
    applyUrl: "/onboarding?prod=3",
    isFeatured: false
  },
  {
    id: 4,
    categoryId: 3,
    categorySlug: "paylater-syariah",
    name: "Syarfi Pay Murabahah",
    provider: "Syarfi Digital Pay",
    logo: "/images/home/syarfi-logo.png",
    description: "Kemudahan belanja kebutuhan pokok dan edukasi dengan skema cicilan syariah flat.",
    minAmount: 500000,
    maxAmount: 15000000,
    minTenorMonths: 1,
    maxTenorMonths: 12,
    interestRateAnnual: 6.0,
    adminFee: 15000,
    rating: 4.6,
    shariaAccredited: true,
    contractType: "Murabahah",
    features: [
      "Margin Transparan di Awal",
      "Bebas Bunga Majemuk",
      "Bisa untuk Transaksi QRIS",
      "Diskon Merchant Mitra"
    ],
    applyUrl: "/onboarding?prod=4",
    isFeatured: true
  },
  {
    id: 5,
    categoryId: 4,
    categorySlug: "reksa-dana-syariah",
    name: "Sucor Sharia Money Market",
    provider: "Sucorinvest Asset Management",
    logo: "/images/clients/simpatindo.jpg",
    description: "Penempatan dana pada instrumen pasar uang syariah dan deposito bank syariah.",
    minAmount: 100000,
    maxAmount: 1000000000,
    minTenorMonths: 1,
    maxTenorMonths: 60,
    interestRateAnnual: 6.2,
    adminFee: 0,
    rating: 4.9,
    shariaAccredited: true,
    contractType: "Wakalah bil Istitsmar",
    features: [
      "Bebas Pajak Keuntungan",
      "Likuiditas Tinggi (T+1)",
      "Portofolio 100% Saham & Sukuk Halal",
      "Rasio Kinerja Stabil"
    ],
    applyUrl: "/onboarding?prod=5",
    isFeatured: true
  },
  {
    id: 6,
    categoryId: 5,
    categorySlug: "pembiayaan-usaha",
    name: "Musyarakah UMKM Berkah",
    provider: "PT Syarfi Teknologi Finansial",
    logo: "/images/home/syarfi-logo.png",
    description: "Kemitraan bagi hasil untuk ekspansi cabang atau pengadaan mesin produksi.",
    minAmount: 20000000,
    maxAmount: 300000000,
    minTenorMonths: 6,
    maxTenorMonths: 36,
    interestRateAnnual: 9.0,
    adminFee: 100000,
    rating: 4.8,
    shariaAccredited: true,
    contractType: "Musyarakah",
    features: [
      "Bagi Hasil Fleksibel Berbasis Revenue",
      "Pendampingan Manajemen Usaha",
      "Pemeriksaan Proyek Lapangan",
      "Laporan Bulanan Transparan"
    ],
    applyUrl: "/onboarding?prod=6",
    isFeatured: false
  }
];

export const initialStats: StatData[] = [
  { id: 1, title: "Dana Tersalurkan", amount: "2.446", unit: "Milyar", icon: "Coins" },
  { id: 2, title: "Pembiayaan Terbantu", amount: "1.034", unit: "Proyek", icon: "CheckCircle" },
  { id: 3, title: "Pengguna Aktif", amount: "1.412", unit: "Nasabah", icon: "Users" },
  { id: 4, title: "Jumlah Akun Aktif", amount: "380", unit: "Akun", icon: "UserCheck" },
  { id: 5, title: "Klien Personal", amount: "122", unit: "Person", icon: "Building" }
];

export const initialPersonil: PersonilData[] = [
  {
    id: 1,
    fullName: "DR. Endy M. Astiwara",
    jobLevel: 1,
    jobTitle: "Sharia Supervisory Board (DPS)",
    biography: "Doktor dari UIN Syarif Hidayatullah Jakarta, Ahli Syariah Pasar Modal. Telah aktif sebagai Dewan Pengawas Syariah dan Penasihat Syariah pada berbagai lembaga keuangan syariah di Indonesia.",
    photo: "/images/team/p_endi_dps_sq.jpeg",
    department: "Pengawas Syariah"
  },
  {
    id: 2,
    fullName: "Ramzi A. Zuhdi",
    jobLevel: 2,
    jobTitle: "President Commissioner",
    biography: "Fakultas Ekonomi UGM dan Iowa State University. Berpengalaman sebagai pengawas bank di Bank Indonesia lebih dari 30 tahun dan komisaris perbankan syariah.",
    photo: "/images/team/p_ramzi_sq.jpeg",
    department: "Dewan Komisaris"
  },
  {
    id: 3,
    fullName: "Kuseryansyah",
    jobLevel: 2,
    jobTitle: "Commissioner",
    biography: "Alumni Universitas Padjadjaran Bandung dan IPMI International Business School. Berpengalaman lebih dari 22 tahun di industri Non-Bank Indonesia.",
    photo: "/images/team/p_kuseryansyah_sq.jpeg",
    department: "Dewan Komisaris"
  },
  {
    id: 4,
    fullName: "Syauki",
    jobLevel: 3,
    jobTitle: "Chief Executive Officer (CEO)",
    biography: "Lulusan Institut Teknologi Bandung dan Nanyang Technological University (Singapore). Berpengalaman 20+ tahun di berbagai sektor technopreneurship.",
    photo: "/images/team/p_syauqi_sq.jpg",
    department: "Direksi"
  },
  {
    id: 5,
    fullName: "Krisna Satria Gunawan",
    jobLevel: 3,
    jobTitle: "Director",
    biography: "Alumni ITB, Nagoya University, University of Twente, dan QUT. Berpengalaman lebih dari 13 tahun pada bidang technopreneurship dan sistem finansial digital.",
    photo: "/images/team/p_krisna_sq.jpeg",
    department: "Direksi"
  },
  {
    id: 6,
    fullName: "Wuliandari Tri Putri",
    jobLevel: 4,
    jobTitle: "Head of Lending & Collection",
    biography: "Lulusan Institut Pertanian Bogor dengan pengalaman perbankan konvensional maupun syariah di bidang pembiayaan dan manajemen risiko.",
    photo: "/images/team/p_putri_sq.jpeg",
    department: "Manajemen Operasional"
  }
];

export const initialFaqCategories = [
  { id: 1, name: "Aplikasi Peminjam", isInvestor: 0, description: "Tata cara pengajuan pinjaman dan dokumen pendukung." },
  { id: 2, name: "Pelunasan & Tenor", isInvestor: 0, description: "Metode pembayaran angsuran dan informasi jatuh tempo." },
  { id: 3, name: "Prinsip Syariah", isInvestor: 0, description: "Penerapan akad Murabahah, Musyarakah, dan Ijarah." },
  { id: 4, name: "Umum Investor", isInvestor: 1, description: "Cara mulai mendanai proyek UMKM pilihan di platform." },
  { id: 5, name: "Bagi Hasil & Imbal", isInvestor: 1, description: "Simulasi nisbah keuntungan dan transparansi bagi hasil." },
  { id: 6, name: "Regulasi & OJK", isInvestor: 1, description: "Keamanan dana investor dan izin resmi otoritas keuangan." }
];

export const initialFaqs: FaqData[] = [
  {
    id: 1,
    categoryId: 1,
    categoryName: "Aplikasi Peminjam",
    isInvestor: 0,
    question: "Dokumen apa sajakah yang dibutuhkan untuk pengajuan pembiayaan?",
    answer: "Untuk perorangan/karyawan: KTP, KK, NPWP, Slip Gaji, dan Rekening Koran 3 bulan terakhir. Untuk pengusaha UMKM: KTP, NPWP, NIB/SIUP, dan Laporan Keuangan 1 tahun terakhir."
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: "Aplikasi Peminjam",
    isInvestor: 0,
    question: "Apa keunggulan konsep Crowdfunding Syariah di Syarfi?",
    answer: "Pembiayaan menghubungkan langsung pemilik dana dengan pengguna dana dengan akad riil (Murabahah jual-beli, Ijarah jasa, Musyarakah usaha) tanpa riba, denda berlipat ganda, ataupun gharar."
  },
  {
    id: 3,
    categoryId: 2,
    categoryName: "Pelunasan & Tenor",
    isInvestor: 0,
    question: "Bagaimana cara melakukan pembayaran angsuran bulanan?",
    answer: "Pembayaran dapat dilakukan melalui Virtual Account Bank Syariah mitra (BSI, Muamalat, BCA Syariah) yang tertera pada dashboard peminjam."
  },
  {
    id: 4,
    categoryId: 4,
    categoryName: "Umum Investor",
    isInvestor: 1,
    question: "Berapa minimal pendanaan untuk menjadi investor?",
    answer: "Investor dapat mulai mendanai proyek UMKM dengan nominal mulai dari Rp 100.000 saja untuk produk ritel atau Rp 1.000.000 untuk invoice financing."
  },
  {
    id: 5,
    categoryId: 5,
    categoryName: "Bagi Hasil & Imbal",
    isInvestor: 1,
    question: "Bagaimana mekanisme pembagian keuntungan investasi?",
    answer: "Keuntungan dibagikan berdasarkan nisbah yang disepakati di awal akad. Hasil investasi akan langsung ditransfer ke saldo dompet investor setiap tanggal pembayaran angsuran mitra."
  },
  {
    id: 6,
    categoryId: 6,
    categoryName: "Regulasi & OJK",
    isInvestor: 1,
    question: "Apakah platform telah berizin dan diawasi oleh OJK?",
    answer: "Platform beroperasi sesuai ketentuan POJK FinTech Lending serta diawasi oleh Dewan Pengawas Syariah yang terafiliasi dengan DSN-MUI."
  }
];

export const initialBlogPosts: BlogPostData[] = [
  {
    id: 1,
    slug: "memahami-akad-murabahah-fintech-syariah",
    title: "Panduan Memahami Akad Murabahah dalam Fintech Syariah",
    excerpt: "Kenali bagaimana prinsip jual-beli Murabahah menjaga transaksi finansial tetap halal, transparan, dan terbebas dari jeratan riba.",
    content: "Akad Murabahah merupakan salah satu akad yang paling banyak digunakan di industri perbankan dan teknologi finansial syariah. Dalam skema ini, lembaga pembiayaan membeli komoditas atau barang yang dibutuhkan nasabah, kemudian menjualnya kembali kepada nasabah dengan tambahan margin keuntungan yang telah disepakati secara terbuka di awal kontrak.\n\nTidak seperti pinjaman konvensional yang mengenakan bunga majemuk atas pokok hutang, skema Murabahah menetapkan harga jual final yang pasti, sehingga nasabah mengetahui dengan jelas jumlah cicilan yang harus dibayarkan setiap bulan tanpa fluktuasi suku bunga acuan pasar.",
    photo: "/images/blog/2.jpg",
    author: "Tim Riset Syarfi",
    category: "Edukasi Syariah",
    publishedAt: "2026-03-01T10:00:00.000Z"
  },
  {
    id: 2,
    slug: "tips-menghitung-nisbah-bagi-hasil-investasi",
    title: "Tips Menghitung Nisbah Bagi Hasil Investasi Crowdfunding",
    excerpt: "Cara cerdas mengalkulasikan proyeksi imbal hasil akad Musyarakah & Mudharabah untuk portofolio pendanaan Anda.",
    content: "Investasi syariah tidak mengenal istilah 'bunga tetap'. Sebagai gantinya, pendana dan pengelola dana bermitra dengan sistem nisbah bagi hasil. Nisbah adalah rasio persentase pembagian keuntungan riil dari usaha yang didanai.\n\nContohnya, jika nisbah disepakati 70:30 (70% untuk investor dan 30% untuk pengelola usaha), maka berapapun keuntungan bersih yang diperoleh pada periode tersebut akan dibagi secara proporsional sesuai rasio tersebut. Ini menciptakan keadilan finansial di mana kedua belah pihak sama-sama menanggung risiko usaha secara transparan.",
    photo: "/images/blog/3.jpg",
    author: "Krisna Satria Gunawan",
    category: "Panduan Finansial",
    publishedAt: "2026-02-15T09:30:00.000Z"
  },
  {
    id: 3,
    slug: "transformasi-arsitektur-fintech-kecepatan-tinggi",
    title: "Membangun Arsitektur Fintech Modern dengan Bun & ElysiaJS",
    excerpt: "Bagaimana pergeseran dari monolith legacy ke micro-monorepo menghasilkan waktu respons di bawah 15ms dan keamanan data yang ketat.",
    content: "Di era digital, pengguna menuntut kecepatan respons dan transparansi real-time saat membandingkan produk keuangan. Mengganti stack PHP legacy ke Bun runtime, ElysiaJS, dan SvelteKit memberikan lonjakan performa berlipat ganda sekaligus menjamin keandalan type safety melalui Eden Treaty.",
    photo: "/images/blog/4.jpg",
    author: "Syauki",
    category: "Teknologi",
    publishedAt: "2026-01-20T14:15:00.000Z"
  }
];

// In-Memory mutable storage for active runtime
export class MockDatabase {
  categories = [...initialCategories];
  products = [...initialProducts];
  leads: LeadData[] = [];
  stats = [...initialStats];
  personil = [...initialPersonil];
  faqCategories = [...initialFaqCategories];
  faqs = [...initialFaqs];
  blogPosts = [...initialBlogPosts];
  nextLeadId = 1;

  addLead(lead: Omit<LeadData, "id" | "kycStep" | "status" | "createdAt">): LeadData {
    const newLead: LeadData = {
      ...lead,
      id: this.nextLeadId++,
      kycStep: 1,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    this.leads.push(newLead);
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
    return lead;
  }
}

export const mockDb = new MockDatabase();
