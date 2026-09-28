import {
  type CategoryData,
  type ProductData,
  type StatData,
  type PersonilData,
  type FaqData,
  type BlogPostData,
  type SiteSettings,
  type HeroContent,
  type PhilosophyData,
  type TestimonialData,
  type MissionData,
  type ClientData,
  type SuperviseData,
  type CompanyAwardData,
  type ActivityDocData,
  type BorrowerInfo,
  type InvestorInfo,
  initialActivityDocs,
  initialAwards,
  initialBlogPosts,
  initialBorrowerInfo,
  initialCategories,
  initialClients,
  initialFaqCategories,
  initialFaqs,
  initialHeroContent,
  initialInvestorInfo,
  initialMediaCoverage,
  initialMissions,
  initialPersonil,
  initialPhilosophies,
  initialProducts,
  initialRiskDisclaimers,
  initialSiteSettings,
  initialStats,
  initialSupervise,
  initialTestimonials,
} from "./content-defaults";

export class ContentState {
  categories: CategoryData[] = [];
  products: ProductData[] = [];
  stats: StatData[] = [];
  personil: PersonilData[] = [];
  faqCategories: typeof initialFaqCategories = [];
  faqs: FaqData[] = [];
  blogPosts: BlogPostData[] = [];
  siteSettings: SiteSettings = { ...initialSiteSettings };
  heroContent: HeroContent = { ...initialHeroContent };
  philosophies: PhilosophyData[] = [];
  testimonials: TestimonialData[] = [];
  missions: MissionData[] = [];
  clients: ClientData[] = [];
  supervise: SuperviseData[] = [];
  mediaCoverage: typeof initialMediaCoverage = [];
  awards: CompanyAwardData[] = [];
  activityDocs: ActivityDocData[] = [];
  borrowerInfo: BorrowerInfo = { ...initialBorrowerInfo };
  investorInfo: InvestorInfo = { ...initialInvestorInfo };
  riskDisclaimers: string[] = [...initialRiskDisclaimers];

  counters: Record<string, number> = {};

  constructor(saved?: Record<string, unknown>) {
    this.resetToDefaults();
    for (const key of Object.keys(this))
      Object.assign(this, {
        [key]: structuredClone((this as unknown as Record<string, unknown>)[key]),
      });
    if (saved) {
      for (const key of Object.keys(this)) {
        if (Object.hasOwn(saved, key)) Object.assign(this, { [key]: structuredClone(saved[key]) });
      }
    }
  }

  nextId(collection: "products" | "blogPosts" | "faqs" | "personil" | "testimonials" | "stats") {
    const maximum = this[collection].reduce((max, item) => Math.max(max, item.id), 0);
    const id = Math.max(this.counters[collection] || 0, maximum) + 1;
    this.counters[collection] = id;
    return id;
  }

  get companyInfo() {
    return this.siteSettings;
  }

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
  }
}
