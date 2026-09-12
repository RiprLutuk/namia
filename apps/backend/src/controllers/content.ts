import { Elysia, t } from "elysia";
import { mockDb } from "../db/mockData";
import { FaqQuerySchema, BlogQuerySchema } from "../schemas/content";

export const contentController = new Elysia({ prefix: "/api/content" })
  // -------------------------------------------------------------
  // 0. AGGREGATED PUBLIC CONTENT (For Instant 1-Trip Page Hydration)
  // -------------------------------------------------------------
  .get("/all", ({ set }) => {
    set.headers["cache-control"] = "public, max-age=30, stale-while-revalidate=120";
    return {
      success: true,
      data: {
        siteSettings: mockDb.siteSettings,
        heroContent: mockDb.heroContent,
        philosophies: mockDb.philosophies,
        stats: mockDb.stats,
        categories: mockDb.categories,
        products: mockDb.products,
        testimonials: mockDb.testimonials,
        missions: mockDb.missions,
        clients: mockDb.clients,
        supervise: mockDb.supervise,
        mediaCoverage: mockDb.mediaCoverage,
        awards: mockDb.awards,
        activityDocs: mockDb.activityDocs,
        team: {
          shariaBoard: mockDb.personil.filter((p) => p.jobLevel === 1),
          commissioners: mockDb.personil.filter((p) => p.jobLevel === 2),
          directors: mockDb.personil.filter((p) => p.jobLevel === 3),
          management: mockDb.personil.filter((p) => p.jobLevel === 4)
        },
        faqs: mockDb.faqs,
        faqCategories: mockDb.faqCategories,
        blogPosts: mockDb.blogPosts,
        borrowerInfo: mockDb.borrowerInfo,
        investorInfo: mockDb.investorInfo,
        riskDisclaimers: mockDb.riskDisclaimers
      }
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get full aggregated public content for single-trip frontend hydration"
    }
  })

  // -------------------------------------------------------------
  // 0a. EARLY-WEB RSS 2.0 SYNDICATION FEED & LIVE METRICS
  // -------------------------------------------------------------
  .get("/rss", ({ set }) => {
    set.headers["content-type"] = "application/xml; charset=utf-8";
    const posts = mockDb.blogPosts || [];
    const itemsXml = posts.map((p) => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>https://namia.id/blog?id=${p.id}</link>
      <guid>https://namia.id/blog?id=${p.id}</guid>
      <pubDate>${new Date(p.publishedAt || Date.now()).toUTCString()}</pubDate>
      <category><![CDATA[${p.category || "Fintech Syariah"}]]></category>
      <description><![CDATA[${p.excerpt || p.content?.slice(0, 200) || ""}]]></description>
    </item>`).join("\n");

    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Namia Syariah — RSS Feed</title>
  <link>https://namia.id</link>
  <description>Edukasi, Literasi Keuangan Syariah, dan Update Pembiayaan UMKM</description>
  <language>id-ID</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="https://namia.id/api/content/rss" rel="self" type="application/rss+xml" />
${itemsXml}
</channel>
</rss>`;
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Generate authentic RSS 2.0 XML syndication feed"
    }
  })

  .get("/live-stats", ({ set }) => {
    set.headers["cache-control"] = "public, max-age=10, stale-while-revalidate=30";
    const now = Date.now();
    const baseFunded = 142850000000;
    const offsetFunded = Math.floor((now % 86400000) / 1000) * 15000;
    return {
      success: true,
      data: {
        totalDisbursed: baseFunded + offsetFunded,
        totalDisbursedFormatted: `Rp ${((baseFunded + offsetFunded) / 1_000_000_000).toFixed(1)} Miliar`,
        activeBorrowers: 1420 + Math.floor((now % 3600000) / 120000),
        activeLenders: 5890 + Math.floor((now % 3600000) / 80000),
        npfRate: "0.00%",
        tkb90: "100%",
        serverUptime: "99.98%",
        status: "OPERATIONAL",
        lastAkadTime: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
      }
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get live real-time platform statistics for early-2000s ticker and metrics ribbon"
    }
  })

  // -------------------------------------------------------------
  // 0b. BORROWER & INVESTOR WORKFLOWS & DISCLAIMERS
  // -------------------------------------------------------------
  .get("/borrower", () => {
    return {
      success: true,
      data: mockDb.borrowerInfo
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get borrower workflows, steps, requirements, and features"
    }
  })

  .get("/investor", () => {
    return {
      success: true,
      data: mockDb.investorInfo
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get investor pillars, steps, security guarantees, and benefits"
    }
  })

  .put("/investor", ({ body }: { body: any }) => {
    mockDb.investorInfo = {
      ...mockDb.investorInfo,
      ...body
    };
    mockDb.saveState();
    return {
      success: true,
      message: "Investor content updated successfully",
      data: mockDb.investorInfo
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Update investor info, hero, pillars, steps, and security guarantees"
    }
  })

  .get("/disclaimers", () => {
    return {
      success: true,
      data: mockDb.riskDisclaimers
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get 9 mandatory fintech risk disclosures"
    }
  })

  // -------------------------------------------------------------
  // 1. SITE SETTINGS & BRAND IDENTITY
  // -------------------------------------------------------------
  .get("/site-settings", () => {
    return {
      success: true,
      data: mockDb.siteSettings
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get global site branding, contact, legal disclosures, and CEO speech"
    }
  })

  .put("/site-settings", ({ body }) => {
    mockDb.siteSettings = {
      ...mockDb.siteSettings,
      ...body,
      socials: {
        ...mockDb.siteSettings.socials,
        ...(body.socials || {})
      }
    };
    mockDb.saveState();
    return {
      success: true,
      message: "Pengaturan situs berhasil diperbarui",
      data: mockDb.siteSettings
    };
  }, {
    body: t.Partial(t.Object({
      brandName: t.String(),
      companyName: t.String(),
      tagline: t.String(),
      subtagline: t.String(),
      address: t.String(),
      addressHtml: t.String(),
      phone: t.String(),
      whatsapp: t.String(),
      fax: t.String(),
      email: t.String(),
      operatingHours: t.String(),
      quote: t.String(),
      quoteOrigin: t.String(),
      website: t.String(),
      socials: t.Partial(t.Object({
        facebook: t.String(),
        instagram: t.String(),
        twitter: t.String(),
        linkedin: t.String(),
        youtube: t.String()
      })),
      regulatoryDisclaimer: t.String()
    })),
    detail: {
      tags: ["Content & CMS"],
      summary: "Update site branding, contact information, and disclaimer"
    }
  })

  // -------------------------------------------------------------
  // 2. HERO CONTENT & HIGHLIGHT BANNER
  // -------------------------------------------------------------
  .get("/hero", () => {
    return {
      success: true,
      data: mockDb.heroContent
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get homepage hero banner headlines, CTA buttons, and tickers"
    }
  })

  .put("/hero", ({ body }) => {
    mockDb.heroContent = {
      ...mockDb.heroContent,
      ...body
    };
    mockDb.saveState();
    return {
      success: true,
      message: "Konten Hero berhasil diperbarui",
      data: mockDb.heroContent
    };
  }, {
    body: t.Partial(t.Object({
      badgeText: t.String(),
      title: t.String(),
      highlightWord: t.String(),
      subtitle: t.String(),
      primaryCtaText: t.String(),
      primaryCtaUrl: t.String(),
      secondaryCtaText: t.String(),
      secondaryCtaUrl: t.String(),
      tickerText: t.String(),
      accentQuote: t.String()
    })),
    detail: {
      tags: ["Content & CMS"],
      summary: "Update homepage hero banner content and CTA buttons"
    }
  })

  // -------------------------------------------------------------
  // 3. AN-NAMAA' / VALUE PHILOSOPHIES
  // -------------------------------------------------------------
  .get("/philosophies", () => {
    return {
      success: true,
      data: mockDb.philosophies
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get An-Namaa' value philosophy pillars"
    }
  })

  .put("/philosophies", ({ body }) => {
    mockDb.philosophies = body;
    mockDb.saveState();
    return {
      success: true,
      message: "Filosofi An-Namaa' berhasil diperbarui",
      data: mockDb.philosophies
    };
  }, {
    body: t.Array(t.Object({
      id: t.Numeric(),
      title: t.String(),
      arabicTitle: t.String(),
      description: t.String(),
      icon: t.String(),
      badge: t.String()
    })),
    detail: {
      tags: ["Content & CMS"],
      summary: "Update An-Namaa' philosophy pillars list"
    }
  })

  // -------------------------------------------------------------
  // 4. STATS & PLATFORM METRICS
  // -------------------------------------------------------------
  .get("/stats", () => {
    return {
      success: true,
      data: mockDb.stats
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get platform performance & disbursement statistics"
    }
  })

  .post("/stats", ({ body }) => {
    const newStat = {
      id: Date.now(),
      title: body.title,
      amount: body.amount,
      unit: body.unit || "",
      icon: body.icon || "TrendingUp",
      subtitle: body.subtitle
    };
    mockDb.stats.push(newStat);
    mockDb.saveState();
    return {
      success: true,
      message: "Metrik berhasil ditambahkan",
      data: newStat
    };
  }, {
    body: t.Object({
      title: t.String(),
      amount: t.String(),
      unit: t.Optional(t.String()),
      icon: t.Optional(t.String()),
      subtitle: t.Optional(t.String())
    }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Add new platform performance metric"
    }
  })

  .put("/stats/:id", ({ params, body, set }) => {
    const statId = Number(params.id);
    const index = mockDb.stats.findIndex((s) => s.id === statId);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "Metrik tidak ditemukan" };
    }
    mockDb.stats[index] = { ...mockDb.stats[index], ...body };
    mockDb.saveState();
    return {
      success: true,
      message: "Metrik berhasil diperbarui",
      data: mockDb.stats[index]
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Partial(t.Object({
      title: t.String(),
      amount: t.String(),
      unit: t.String(),
      icon: t.String(),
      subtitle: t.String()
    })),
    detail: {
      tags: ["Content & CMS"],
      summary: "Update existing performance metric"
    }
  })

  .delete("/stats/:id", ({ params, set }) => {
    const statId = Number(params.id);
    const index = mockDb.stats.findIndex((s) => s.id === statId);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "Metrik tidak ditemukan" };
    }
    const [deleted] = mockDb.stats.splice(index, 1);
    mockDb.saveState();
    return {
      success: true,
      message: "Metrik berhasil dihapus",
      data: deleted
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Delete performance metric"
    }
  })

  // -------------------------------------------------------------
  // 5. FINANCING PRODUCTS CATALOG
  // -------------------------------------------------------------
  .get("/products", ({ query }) => {
    let list = [...mockDb.products];

    if (query.category) {
      list = list.filter((p) => p.categorySlug === query.category);
    }
    if (query.targetAudience) {
      list = list.filter((p) => p.targetAudience === query.targetAudience || p.targetAudience === "both" || !p.targetAudience);
    }
    if (query.featured !== undefined) {
      const isFeat = query.featured === "true" || query.featured === "1";
      list = list.filter((p) => p.isFeatured === isFeat);
    }

    return {
      success: true,
      count: list.length,
      data: list
    };
  }, {
    query: t.Optional(t.Object({
      category: t.Optional(t.String()),
      targetAudience: t.Optional(t.String()),
      featured: t.Optional(t.String())
    })),
    detail: {
      tags: ["Content & Info"],
      summary: "Get dynamic financing products catalog"
    }
  })

  .post("/products", ({ body }) => {
    const newProduct = {
      ...body,
      id: mockDb.nextProductId++,
      isFeatured: body.isFeatured ?? true,
      shariaAccredited: true
    };
    mockDb.products.unshift(newProduct);
    mockDb.saveState();
    return {
      success: true,
      message: "Produk pembiayaan berhasil ditambahkan",
      data: newProduct
    };
  }, {
    body: t.Object({
      categoryId: t.Numeric(),
      categorySlug: t.String(),
      name: t.String(),
      provider: t.String(),
      logo: t.String(),
      description: t.String(),
      minAmount: t.Numeric(),
      maxAmount: t.Numeric(),
      minTenorMonths: t.Numeric(),
      maxTenorMonths: t.Numeric(),
      interestRateAnnual: t.Numeric(),
      adminFee: t.Numeric(),
      rating: t.Numeric(),
      contractType: t.String(),
      features: t.Array(t.String()),
      applyUrl: t.String(),
      isFeatured: t.Optional(t.Boolean()),
      targetAudience: t.Optional(t.Union([t.Literal("borrower"), t.Literal("investor"), t.Literal("both")]))
    }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Create a new financing product"
    }
  })

  .put("/products/:id", ({ params, body, set }) => {
    const prodId = Number(params.id);
    const index = mockDb.products.findIndex((p) => p.id === prodId);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "Produk tidak ditemukan" };
    }
    mockDb.products[index] = { ...mockDb.products[index], ...body };
    mockDb.saveState();
    return {
      success: true,
      message: "Produk berhasil diperbarui",
      data: mockDb.products[index]
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Partial(t.Object({
      name: t.String(),
      provider: t.String(),
      description: t.String(),
      minAmount: t.Numeric(),
      maxAmount: t.Numeric(),
      minTenorMonths: t.Numeric(),
      maxTenorMonths: t.Numeric(),
      interestRateAnnual: t.Numeric(),
      adminFee: t.Numeric(),
      rating: t.Numeric(),
      contractType: t.String(),
      features: t.Array(t.String()),
      applyUrl: t.String(),
      isFeatured: t.Boolean(),
      targetAudience: t.Union([t.Literal("borrower"), t.Literal("investor"), t.Literal("both")])
    })),
    detail: {
      tags: ["Content & CMS"],
      summary: "Update existing financing product"
    }
  })

  .delete("/products/:id", ({ params, set }) => {
    const prodId = Number(params.id);
    const index = mockDb.products.findIndex((p) => p.id === prodId);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "Produk tidak ditemukan" };
    }
    const [deleted] = mockDb.products.splice(index, 1);
    mockDb.saveState();
    return {
      success: true,
      message: "Produk berhasil dihapus",
      data: deleted
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Delete financing product"
    }
  })

  // -------------------------------------------------------------
  // 6. TESTIMONIALS
  // -------------------------------------------------------------
  .get("/testimonials", ({ query }) => {
    let list = [...mockDb.testimonials];
    if (query.type) {
      list = list.filter((t) => t.type === query.type);
    }
    return {
      success: true,
      count: list.length,
      data: list
    };
  }, {
    query: t.Optional(t.Object({
      type: t.Optional(t.String())
    })),
    detail: {
      tags: ["Content & Info"],
      summary: "Get verified borrower & investor testimonials"
    }
  })

  .post("/testimonials", ({ body }) => {
    const newTestimonial = {
      ...body,
      id: mockDb.nextTestimonialId++,
      rating: body.rating ?? 5
    };
    mockDb.testimonials.unshift(newTestimonial);
    mockDb.saveState();
    return {
      success: true,
      message: "Testimoni berhasil ditambahkan",
      data: newTestimonial
    };
  }, {
    body: t.Object({
      name: t.String(),
      role: t.String(),
      businessName: t.String(),
      avatar: t.String(),
      content: t.String(),
      rating: t.Optional(t.Numeric()),
      type: t.Union([t.Literal("borrower"), t.Literal("investor")]),
      fundedAmount: t.Optional(t.String())
    }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Create a new testimonial"
    }
  })

  .delete("/testimonials/:id", ({ params, set }) => {
    const testId = Number(params.id);
    const index = mockDb.testimonials.findIndex((t) => t.id === testId);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "Testimoni tidak ditemukan" };
    }
    const [deleted] = mockDb.testimonials.splice(index, 1);
    mockDb.saveState();
    return {
      success: true,
      message: "Testimoni berhasil dihapus",
      data: deleted
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Delete testimonial"
    }
  })

  // -------------------------------------------------------------
  // 7. BOARD & EXECUTIVE TEAM (PERSONIL)
  // -------------------------------------------------------------
  .get("/team", () => {
    return {
      success: true,
      data: {
        shariaBoard: mockDb.personil.filter((p) => p.jobLevel === 1),
        commissioners: mockDb.personil.filter((p) => p.jobLevel === 2),
        directors: mockDb.personil.filter((p) => p.jobLevel === 3),
        management: mockDb.personil.filter((p) => p.jobLevel === 4),
        all: mockDb.personil
      }
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get organization personnel, commissioners, and DPS"
    }
  })

  .post("/team", ({ body }) => {
    const newMember = {
      ...body,
      id: mockDb.nextPersonilId++
    };
    mockDb.personil.push(newMember);
    mockDb.saveState();
    return {
      success: true,
      message: "Anggota tim berhasil ditambahkan",
      data: newMember
    };
  }, {
    body: t.Object({
      fullName: t.String(),
      jobLevel: t.Numeric(),
      jobTitle: t.String(),
      biography: t.String(),
      photo: t.String(),
      department: t.String()
    }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Add personil or board member"
    }
  })

  .put("/team/:id", ({ params, body, set }) => {
    const id = Number(params.id);
    const index = mockDb.personil.findIndex((p) => p.id === id);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "Anggota tim tidak ditemukan" };
    }
    mockDb.personil[index] = { ...mockDb.personil[index], ...body };
    mockDb.saveState();
    return {
      success: true,
      message: "Data anggota tim berhasil diperbarui",
      data: mockDb.personil[index]
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Partial(t.Object({
      fullName: t.String(),
      jobLevel: t.Numeric(),
      jobTitle: t.String(),
      biography: t.String(),
      photo: t.String(),
      department: t.String()
    })),
    detail: {
      tags: ["Content & CMS"],
      summary: "Update team member details"
    }
  })

  .delete("/team/:id", ({ params, set }) => {
    const id = Number(params.id);
    const index = mockDb.personil.findIndex((p) => p.id === id);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "Anggota tim tidak ditemukan" };
    }
    const [deleted] = mockDb.personil.splice(index, 1);
    mockDb.saveState();
    return {
      success: true,
      message: "Anggota tim berhasil dihapus",
      data: deleted
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Delete team member"
    }
  })

  // -------------------------------------------------------------
  // 8. FAQ CATEGORIES & FAQ LIST
  // -------------------------------------------------------------
  .get("/faqs", ({ query }) => {
    let list = [...mockDb.faqs];

    if (query.isInvestor !== undefined) {
      const isInv = Number(query.isInvestor);
      list = list.filter((f) => f.isInvestor === isInv);
    }

    if (query.categoryId !== undefined) {
      const catId = Number(query.categoryId);
      list = list.filter((f) => f.categoryId === catId);
    }

    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      categories: mockDb.faqCategories,
      count: list.length,
      data: list
    };
  }, {
    query: FaqQuerySchema,
    detail: {
      tags: ["Content & Info"],
      summary: "Get categorized FAQs for borrowers and investors"
    }
  })

  .post("/faqs", ({ body }) => {
    const newFaq = {
      ...body,
      id: mockDb.nextFaqId++
    };
    mockDb.faqs.push(newFaq);
    mockDb.saveState();
    return {
      success: true,
      message: "FAQ berhasil ditambahkan",
      data: newFaq
    };
  }, {
    body: t.Object({
      categoryId: t.Numeric(),
      categoryName: t.String(),
      isInvestor: t.Numeric(),
      question: t.String(),
      answer: t.String()
    }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Create a new FAQ item"
    }
  })

  .put("/faqs/:id", ({ params, body, set }) => {
    const faqId = Number(params.id);
    const index = mockDb.faqs.findIndex((f) => f.id === faqId);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "FAQ tidak ditemukan" };
    }
    mockDb.faqs[index] = { ...mockDb.faqs[index], ...body };
    mockDb.saveState();
    return {
      success: true,
      message: "FAQ berhasil diperbarui",
      data: mockDb.faqs[index]
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Partial(t.Object({
      categoryId: t.Numeric(),
      categoryName: t.String(),
      isInvestor: t.Numeric(),
      question: t.String(),
      answer: t.String()
    })),
    detail: {
      tags: ["Content & CMS"],
      summary: "Update existing FAQ item"
    }
  })

  .delete("/faqs/:id", ({ params, set }) => {
    const faqId = Number(params.id);
    const index = mockDb.faqs.findIndex((f) => f.id === faqId);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "FAQ tidak ditemukan" };
    }
    const [deleted] = mockDb.faqs.splice(index, 1);
    mockDb.saveState();
    return {
      success: true,
      message: "FAQ berhasil dihapus",
      data: deleted
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Delete FAQ item"
    }
  })

  // -------------------------------------------------------------
  // 9. BLOG POSTS & EDUCATIONAL GUIDES
  // -------------------------------------------------------------
  .get("/blogs", ({ query }) => {
    let posts = [...mockDb.blogPosts];

    if (query.category) {
      posts = posts.filter((p) => p.category.toLowerCase() === query.category?.toLowerCase());
    }

    if (query.search) {
      const q = query.search.toLowerCase();
      posts = posts.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const contentStr = Array.isArray(p.content)
          ? p.content.join(" ")
          : p.content || "";
        const contentMatch = contentStr.toLowerCase().includes(q);
        const excerptMatch = (p.excerpt || "").toLowerCase().includes(q);
        return titleMatch || contentMatch || excerptMatch;
      });
    }

    const limit = query.limit ? Number(query.limit) : 20;
    const offset = query.offset ? Number(query.offset) : 0;
    const paged = posts.slice(offset, offset + limit);

    return {
      success: true,
      total: posts.length,
      data: paged
    };
  }, {
    query: BlogQuerySchema,
    detail: {
      tags: ["Content & Info"],
      summary: "Get educational blog articles"
    }
  })

  .get("/blogs/:identifier", ({ params, set }) => {
    const idOrSlug = params.identifier;
    const post = mockDb.blogPosts.find(
      (p) => p.slug === idOrSlug || p.id.toString() === idOrSlug
    );

    if (!post) {
      set.status = 404;
      return { success: false, message: "Artikel tidak ditemukan" };
    }

    return {
      success: true,
      data: post
    };
  }, {
    params: t.Object({
      identifier: t.String()
    }),
    detail: {
      tags: ["Content & Info"],
      summary: "Get single blog article detail"
    }
  })

  .post("/blogs", ({ body }) => {
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newPost = {
      ...body,
      id: mockDb.nextBlogId++,
      slug,
      publishedAt: new Date().toISOString()
    };
    mockDb.blogPosts.unshift(newPost);
    mockDb.saveState();
    return {
      success: true,
      message: "Artikel berhasil dipublikasikan",
      data: newPost
    };
  }, {
    body: t.Object({
      title: t.String(),
      slug: t.Optional(t.String()),
      excerpt: t.String(),
      content: t.String(),
      photo: t.String(),
      author: t.String(),
      category: t.String(),
      readTimeMinutes: t.Optional(t.Numeric())
    }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Create new blog article"
    }
  })

  .put("/blogs/:id", ({ params, body, set }) => {
    const blogId = Number(params.id);
    const index = mockDb.blogPosts.findIndex((b) => b.id === blogId);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "Artikel tidak ditemukan" };
    }
    mockDb.blogPosts[index] = { ...mockDb.blogPosts[index], ...body };
    mockDb.saveState();
    return {
      success: true,
      message: "Artikel berhasil diperbarui",
      data: mockDb.blogPosts[index]
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Partial(t.Object({
      title: t.String(),
      slug: t.String(),
      excerpt: t.String(),
      content: t.String(),
      photo: t.String(),
      author: t.String(),
      category: t.String(),
      readTimeMinutes: t.Numeric()
    })),
    detail: {
      tags: ["Content & CMS"],
      summary: "Update existing blog article"
    }
  })

  .delete("/blogs/:id", ({ params, set }) => {
    const blogId = Number(params.id);
    const index = mockDb.blogPosts.findIndex((b) => b.id === blogId);
    if (index === -1) {
      set.status = 404;
      return { success: false, message: "Artikel tidak ditemukan" };
    }
    const [deleted] = mockDb.blogPosts.splice(index, 1);
    mockDb.saveState();
    return {
      success: true,
      message: "Artikel berhasil dihapus",
      data: deleted
    };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ["Content & CMS"],
      summary: "Delete blog article"
    }
  })

  // -------------------------------------------------------------
  // 10. PARTNERS, CLIENTS & SUPERVISE
  // -------------------------------------------------------------
  .get("/clients", () => {
    return {
      success: true,
      data: mockDb.clients
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get authentic client & partner company logos"
    }
  })

  .get("/supervise", () => {
    return {
      success: true,
      data: mockDb.supervise
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get regulatory & supervisory authority logos (OJK, DSN-MUI, Kominfo, AFSI)"
    }
  })

  .get("/media", () => {
    return {
      success: true,
      data: mockDb.mediaCoverage
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get media mentions and press coverage"
    }
  })

  .get("/company", () => {
    return {
      success: true,
      data: {
        info: mockDb.siteSettings,
        missions: mockDb.missions,
        clients: mockDb.clients,
        supervise: mockDb.supervise,
        mediaCoverage: mockDb.mediaCoverage,
        awards: mockDb.awards,
        activityDocs: mockDb.activityDocs
      }
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get full authentic company details, quotes, address, and partner logos"
    }
  })

  .get("/company-info", () => {
    return {
      success: true,
      data: mockDb.siteSettings
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get company profile, contacts, and regulatory compliance"
    }
  })

  // -------------------------------------------------------------
  // 11. CMS SYSTEM CONTROLS
  // -------------------------------------------------------------
  .post("/reset", () => {
    mockDb.resetToDefaults();
    return {
      success: true,
      message: "Seluruh data CMS berhasil direset kembali ke standar default Namia Syariah",
      data: {
        siteSettings: mockDb.siteSettings,
        heroContent: mockDb.heroContent
      }
    };
  }, {
    detail: {
      tags: ["Content & CMS"],
      summary: "Reset all CMS content back to initial Namia Syariah baseline"
    }
  });

