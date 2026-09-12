import { writable, derived } from "svelte/store";

export type SupportedLang = "ID" | "EN" | "AR";

export interface TranslationDict {
  topbar: {
    address: string;
    phone: string;
    email: string;
  };
  nav: {
    home: string;
    funding: string;
    financing: string;
    products: string;
    groupSolutions: string;
    groupTools: string;
    groupCompany: string;
    groupMedia: string;
    aggregator: string;
    aggregatorDesc: string;
    calculators: string;
    calculatorsDesc: string;
    kyc: string;
    kycDesc: string;
    about: string;
    profile: string;
    profileDesc: string;
    team: string;
    teamDesc: string;
    blog: string;
    blogDesc: string;
    faq: string;
    login: string;
    apply: string;
  };
  chat: {
    title: string;
    subtitle: string;
    button: string;
    placeholder: string;
    welcome: string;
    send: string;
  };
  footer: {
    aboutText: string;
    copyright: string;
  };
}

export const translations: Record<SupportedLang, TranslationDict> = {
  ID: {
    topbar: {
      address: "PT Namia Finansial Teknologi — Menara MTH Lantai 10",
      phone: "(+62) 21 8378 2337",
      email: "salam@namia.id"
    },
    nav: {
      home: "Beranda",
      funding: "Pendanaan",
      financing: "Pembiayaan",
      products: "Produk & Layanan",
      groupSolutions: "Layanan Pembiayaan",
      groupTools: "Fitur & Ekosistem",
      groupCompany: "Perusahaan",
      groupMedia: "Informasi & Media",
      aggregator: "Katalog Aggregator",
      aggregatorDesc: "Komparasi produk & mitra P2P",
      calculators: "Kalkulator Finansial",
      calculatorsDesc: "Simulasi cicilan, imbal hasil & DSR",
      kyc: "Simulasi Pengajuan",
      kycDesc: "Formulir e-KYC digital praktis",
      about: "Tentang Kami",
      profile: "Profil & Legalitas",
      profileDesc: "Visi, misi & izin resmi OJK",
      team: "Dewan Pengawas & Tim",
      teamDesc: "DPS DSN-MUI & direksi manajemen",
      blog: "Blog & Edukasi",
      blogDesc: "Artikel fiqih muamalah & berita",
      faq: "FAQ & Kontak",
      login: "Masuk Mitra",
      apply: "Ajukan Pembiayaan"
    },
    chat: {
      title: "Namia Virtual Assistant",
      subtitle: "Online • Responsif Syariah",
      button: "Tanya Namia",
      placeholder: "Ketik pertanyaan Anda seputar Namia...",
      welcome: "Assalamu'alaikum! Selamat datang di Namia Syariah. Ada yang bisa kami bantu seputar pendanaan atau pembiayaan syariah hari ini?",
      send: "Kirim"
    },
    footer: {
      aboutText: "Namia adalah platform P2P financing & investasi produktif syariah berizin OJK yang menghubungkan pendana dengan pelaku usaha produktif secara adil, amanah, dan tanpa riba.",
      copyright: "Hak Cipta Dilindungi Undang-Undang."
    }
  },
  EN: {
    topbar: {
      address: "PT Namia Finansial Teknologi — Menara MTH 10th Floor",
      phone: "(+62) 21 8378 2337",
      email: "salam@namia.id"
    },
    nav: {
      home: "Home",
      funding: "Funding",
      financing: "Financing",
      products: "Products & Tools",
      groupSolutions: "Financing Services",
      groupTools: "Features & Ecosystem",
      groupCompany: "Company",
      groupMedia: "Information & Media",
      aggregator: "Aggregator Catalog",
      aggregatorDesc: "Compare P2P partners & products",
      calculators: "Financial Calculators",
      calculatorsDesc: "Installment, ROI & DSR simulations",
      kyc: "Apply Financing",
      kycDesc: "Practical digital e-KYC application",
      about: "About Us",
      profile: "Profile & Regulation",
      profileDesc: "Vision, mission & OJK license",
      team: "Sharia Board & Team",
      teamDesc: "DSN-MUI DPS & management team",
      blog: "Blog & Education",
      blogDesc: "Islamic muamalah articles & news",
      faq: "FAQ & Contact",
      login: "Partner Login",
      apply: "Apply Financing"
    },
    chat: {
      title: "Namia Virtual Assistant",
      subtitle: "Online • Sharia Responsive",
      button: "Ask Namia",
      placeholder: "Type your inquiry about Namia...",
      welcome: "Peace be upon you! Welcome to Namia Syariah. How can we help you regarding Islamic funding or financing today?",
      send: "Send"
    },
    footer: {
      aboutText: "Namia is an OJK-licensed Sharia P2P financing and productive investment platform connecting ethical funders with productive businesses transparently and riba-free.",
      copyright: "All Rights Reserved."
    }
  },
  AR: {
    topbar: {
      address: "شركة ناميا للتكنولوجيا المالية — برج إم تي إتش الدور العاشر",
      phone: "(+62) 21 8378 2337",
      email: "salam@namia.id"
    },
    nav: {
      home: "الرئيسية",
      funding: "الاستثمار والتمويل",
      financing: "طلب التمويل",
      products: "المنتجات والخدمات",
      groupSolutions: "خدمات التمويل",
      groupTools: "الميزات والمنظومة",
      groupCompany: "عن الشركة",
      groupMedia: "المعلومات والإعلام",
      aggregator: "كتالوج المقارنة",
      aggregatorDesc: "مقارنة عروض التمويل التشاركي",
      calculators: "الحاسبة المالية",
      calculatorsDesc: "محاكاة الأقساط ونسب الأرباح",
      kyc: "طلب التمويل الإلكتروني",
      kycDesc: "إجراءات إعرف عميلك الرقمية",
      about: "عن المنصة",
      profile: "الملف والتراخيص",
      profileDesc: "الرؤية والرسالة وتراخيص هيئة الخدمات المالية",
      team: "هيئة الرقابة الشرعية",
      teamDesc: "هيئة الرقابة ومجلس الإدارة",
      blog: "المدونة والتثقيف",
      blogDesc: "فقه المعاملات المالية والمقالات",
      faq: "الأسئلة والتواصل",
      login: "دخول الشركاء",
      apply: "تقديم الطلب"
    },
    chat: {
      title: "المساعد الآلي لمنصة ناميا",
      subtitle: "متصل • استجابة متوافقة مع الشريعة",
      button: "اسأل ناميا",
      placeholder: "اكتب استفسارك عن خدمات ناميا...",
      welcome: "السلام عليكم ورحمة الله وبركاته! أهلاً بكم في منصة ناميا للتمويل التشاركي الإسلامي. كيف يمكننا خدمتكم اليوم؟",
      send: "إرسال"
    },
    footer: {
      aboutText: "منصة ناميا هي منصة تمويل تشاركي إسلامي واستثمار إنتاجي معتمدة من هيئة الخدمات المالية الإندونيسية OJK تربط بين المستثمرين ورواد الأعمال بنزاهة وخلو تام من الربا.",
      copyright: "جميع الحقوق محفوظة."
    }
  }
};

function getInitialLang(): SupportedLang {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("namia_lang") as SupportedLang;
      if (saved && (saved === "ID" || saved === "EN" || saved === "AR")) {
        return saved;
      }
    } catch {
      // ignore storage access errors
    }
  }
  return "ID";
}

export const currentLanguage = writable<SupportedLang>(getInitialLang());

export function setLanguage(lang: SupportedLang) {
  currentLanguage.set(lang);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("namia_lang", lang);
    } catch {
      // ignore storage access errors
    }
    if (document.documentElement) {
      document.documentElement.lang = lang === "ID" ? "id" : lang === "EN" ? "en" : "ar";
      document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
    }
  }
}

// Derived store providing active translation dictionary
export const t = derived(currentLanguage, ($lang) => translations[$lang]);
