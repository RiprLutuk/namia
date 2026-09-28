import { Elysia, t } from "elysia";
import { type ContentRepository } from "../repositories/content";

import { InvestorInfoSchema } from "../schemas/investor";
import { AuthService, requireUser } from "../services/auth";
import { isMutation } from "../middleware/security";
import { validateContent, cdata } from "../domain/content-safety";
import { FaqQuerySchema, BlogQuerySchema } from "../schemas/content";

export const createContentController = (repository: ContentRepository, auth: AuthService) =>
  new Elysia({ prefix: "/api/content" })
    .onBeforeHandle(async ({ request, body }) => {
      if (isMutation(request.method)) {
        requireUser(await auth.user(request), ["admin"]);
        validateContent(body);
      }
    })
    // -------------------------------------------------------------
    // 0. AGGREGATED PUBLIC CONTENT (For Instant 1-Trip Page Hydration)
    // -------------------------------------------------------------
    .get(
      "/all",
      ({ set }) =>
        repository.read((content) => {
          set.headers["cache-control"] = "public, max-age=30, stale-while-revalidate=120";
          return {
            success: true,
            data: {
              siteSettings: content.siteSettings,
              heroContent: content.heroContent,
              philosophies: content.philosophies,
              stats: content.stats,
              categories: content.categories,
              products: content.products,
              testimonials: content.testimonials,
              missions: content.missions,
              clients: content.clients,
              supervise: content.supervise,
              mediaCoverage: content.mediaCoverage,
              awards: content.awards,
              activityDocs: content.activityDocs,
              team: {
                shariaBoard: content.personil.filter((p) => p.jobLevel === 1),
                commissioners: content.personil.filter((p) => p.jobLevel === 2),
                directors: content.personil.filter((p) => p.jobLevel === 3),
                management: content.personil.filter((p) => p.jobLevel === 4),
              },
              faqs: content.faqs,
              faqCategories: content.faqCategories,
              blogPosts: content.blogPosts,
              borrowerInfo: content.borrowerInfo,
              investorInfo: content.investorInfo,
              riskDisclaimers: content.riskDisclaimers,
            },
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get full aggregated public content for single-trip frontend hydration",
        },
      },
    )

    // -------------------------------------------------------------
    // 0a. EARLY-WEB RSS 2.0 SYNDICATION FEED & LIVE METRICS
    // -------------------------------------------------------------
    .get(
      "/rss",
      ({ set }) =>
        repository.read((content) => {
          set.headers["content-type"] = "application/xml; charset=utf-8";
          const posts = content.blogPosts || [];
          const itemsXml = posts
            .map(
              (p) => `    <item>
      <title><![CDATA[${cdata(p.title)}]]></title>
      <link>https://namia.id/blog?id=${p.id}</link>
      <guid>https://namia.id/blog?id=${p.id}</guid>
      <pubDate>${new Date(p.publishedAt || Date.now()).toUTCString()}</pubDate>
      <category><![CDATA[${cdata(p.category || "Fintech Syariah")}]]></category>
      <description><![CDATA[${cdata(p.excerpt || p.content?.slice(0, 200) || "")}]]></description>
    </item>`,
            )
            .join("\n");

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
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Generate authentic RSS 2.0 XML syndication feed",
        },
      },
    )

    .get(
      "/live-stats",
      ({ set }) =>
        repository.read((content) => {
          set.headers["cache-control"] = "public, max-age=10, stale-while-revalidate=30";
          return {
            success: true,
            data: {
              status: "UNAVAILABLE",
              message: "Statistik operasional belum tersedia; sumber transaksi belum tersambung.",
            },
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary:
            "Get live real-time platform statistics for early-2000s ticker and metrics ribbon",
        },
      },
    )

    // -------------------------------------------------------------
    // 0b. BORROWER & INVESTOR WORKFLOWS & DISCLAIMERS
    // -------------------------------------------------------------
    .get(
      "/borrower",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.borrowerInfo,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get borrower workflows, steps, requirements, and features",
        },
      },
    )

    .get(
      "/investor",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.investorInfo,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get investor pillars, steps, security guarantees, and benefits",
        },
      },
    )

    .put(
      "/investor",
      ({ body }) =>
        repository.write((content) => {
          content.investorInfo = {
            ...content.investorInfo,
            ...body,
          };
          return {
            success: true,
            message: "Investor content updated successfully",
            data: content.investorInfo,
          };
        }),
      {
        body: t.Partial(InvestorInfoSchema),
        detail: {
          tags: ["Content & Info"],
          summary: "Update investor info, hero, pillars, steps, and security guarantees",
        },
      },
    )

    .get(
      "/disclaimers",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.riskDisclaimers,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get 9 mandatory fintech risk disclosures",
        },
      },
    )

    // -------------------------------------------------------------
    // 1. SITE SETTINGS & BRAND IDENTITY
    // -------------------------------------------------------------
    .get(
      "/site-settings",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.siteSettings,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get global site branding, contact, legal disclosures, and CEO speech",
        },
      },
    )

    .put(
      "/site-settings",
      ({ body }) =>
        repository.write((content) => {
          content.siteSettings = {
            ...content.siteSettings,
            ...body,
            socials: {
              ...content.siteSettings.socials,
              ...(body.socials || {}),
            },
          };
          return {
            success: true,
            message: "Pengaturan situs berhasil diperbarui",
            data: content.siteSettings,
          };
        }),
      {
        body: t.Partial(
          t.Object({
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
            socials: t.Partial(
              t.Object({
                facebook: t.String(),
                instagram: t.String(),
                twitter: t.String(),
                linkedin: t.String(),
                youtube: t.String(),
              }),
            ),
            regulatoryDisclaimer: t.String(),
          }),
        ),
        detail: {
          tags: ["Content & CMS"],
          summary: "Update site branding, contact information, and disclaimer",
        },
      },
    )

    // -------------------------------------------------------------
    // 2. HERO CONTENT & HIGHLIGHT BANNER
    // -------------------------------------------------------------
    .get(
      "/hero",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.heroContent,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get homepage hero banner headlines, CTA buttons, and tickers",
        },
      },
    )

    .put(
      "/hero",
      ({ body }) =>
        repository.write((content) => {
          content.heroContent = {
            ...content.heroContent,
            ...body,
          };
          return {
            success: true,
            message: "Konten Hero berhasil diperbarui",
            data: content.heroContent,
          };
        }),
      {
        body: t.Partial(
          t.Object({
            badgeText: t.String(),
            title: t.String(),
            highlightWord: t.String(),
            subtitle: t.String(),
            primaryCtaText: t.String(),
            primaryCtaUrl: t.String(),
            secondaryCtaText: t.String(),
            secondaryCtaUrl: t.String(),
            tickerText: t.String(),
            accentQuote: t.String(),
          }),
        ),
        detail: {
          tags: ["Content & CMS"],
          summary: "Update homepage hero banner content and CTA buttons",
        },
      },
    )

    // -------------------------------------------------------------
    // 3. AN-NAMAA' / VALUE PHILOSOPHIES
    // -------------------------------------------------------------
    .get(
      "/philosophies",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.philosophies,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get An-Namaa' value philosophy pillars",
        },
      },
    )

    .put(
      "/philosophies",
      ({ body }) =>
        repository.write((content) => {
          content.philosophies = body;
          return {
            success: true,
            message: "Filosofi An-Namaa' berhasil diperbarui",
            data: content.philosophies,
          };
        }),
      {
        body: t.Array(
          t.Object({
            id: t.Numeric(),
            title: t.String(),
            arabicTitle: t.String(),
            description: t.String(),
            icon: t.String(),
            badge: t.String(),
          }),
        ),
        detail: {
          tags: ["Content & CMS"],
          summary: "Update An-Namaa' philosophy pillars list",
        },
      },
    )

    // -------------------------------------------------------------
    // 4. STATS & PLATFORM METRICS
    // -------------------------------------------------------------
    .get(
      "/stats",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.stats,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get platform performance & disbursement statistics",
        },
      },
    )

    .post(
      "/stats",
      ({ body }) =>
        repository.write((content) => {
          const newStat = {
            id: content.nextId("stats"),
            title: body.title,
            amount: body.amount,
            unit: body.unit || "",
            icon: body.icon || "TrendingUp",
            subtitle: body.subtitle,
          };
          content.stats.push(newStat);
          return {
            success: true,
            message: "Metrik berhasil ditambahkan",
            data: newStat,
          };
        }),
      {
        body: t.Object({
          title: t.String(),
          amount: t.String(),
          unit: t.Optional(t.String()),
          icon: t.Optional(t.String()),
          subtitle: t.Optional(t.String()),
        }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Add new platform performance metric",
        },
      },
    )

    .put(
      "/stats/:id",
      ({ params, body, set }) =>
        repository.write((content) => {
          const statId = Number(params.id);
          const index = content.stats.findIndex((s) => s.id === statId);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "Metrik tidak ditemukan" };
          }
          content.stats[index] = { ...content.stats[index], ...body };
          return {
            success: true,
            message: "Metrik berhasil diperbarui",
            data: content.stats[index],
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        body: t.Partial(
          t.Object({
            title: t.String(),
            amount: t.String(),
            unit: t.String(),
            icon: t.String(),
            subtitle: t.String(),
          }),
        ),
        detail: {
          tags: ["Content & CMS"],
          summary: "Update existing performance metric",
        },
      },
    )

    .delete(
      "/stats/:id",
      ({ params, set }) =>
        repository.write((content) => {
          const statId = Number(params.id);
          const index = content.stats.findIndex((s) => s.id === statId);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "Metrik tidak ditemukan" };
          }
          const [deleted] = content.stats.splice(index, 1);
          return {
            success: true,
            message: "Metrik berhasil dihapus",
            data: deleted,
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Delete performance metric",
        },
      },
    )

    // -------------------------------------------------------------
    // 5. FINANCING PRODUCTS CATALOG
    // -------------------------------------------------------------
    .get(
      "/products",
      ({ query }) =>
        repository.read((content) => {
          let list = [...content.products];

          if (query.category) {
            list = list.filter((p) => p.categorySlug === query.category);
          }
          if (query.targetAudience) {
            list = list.filter(
              (p) =>
                p.targetAudience === query.targetAudience ||
                p.targetAudience === "both" ||
                !p.targetAudience,
            );
          }
          if (query.featured !== undefined) {
            const isFeat = query.featured === "true" || query.featured === "1";
            list = list.filter((p) => p.isFeatured === isFeat);
          }

          return {
            success: true,
            count: list.length,
            data: list,
          };
        }),
      {
        query: t.Optional(
          t.Object({
            category: t.Optional(t.String()),
            targetAudience: t.Optional(t.String()),
            featured: t.Optional(t.String()),
          }),
        ),
        detail: {
          tags: ["Content & Info"],
          summary: "Get dynamic financing products catalog",
        },
      },
    )

    .post(
      "/products",
      ({ body }) =>
        repository.write((content) => {
          const newProduct = {
            ...body,
            id: content.nextId("products"),
            isFeatured: body.isFeatured ?? true,
            shariaAccredited: true,
          };
          content.products.unshift(newProduct);
          return {
            success: true,
            message: "Produk pembiayaan berhasil ditambahkan",
            data: newProduct,
          };
        }),
      {
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
          targetAudience: t.Optional(
            t.Union([t.Literal("borrower"), t.Literal("investor"), t.Literal("both")]),
          ),
        }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Create a new financing product",
        },
      },
    )

    .put(
      "/products/:id",
      ({ params, body, set }) =>
        repository.write((content) => {
          const prodId = Number(params.id);
          const index = content.products.findIndex((p) => p.id === prodId);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "Produk tidak ditemukan" };
          }
          content.products[index] = { ...content.products[index], ...body };
          return {
            success: true,
            message: "Produk berhasil diperbarui",
            data: content.products[index],
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        body: t.Partial(
          t.Object({
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
            targetAudience: t.Union([
              t.Literal("borrower"),
              t.Literal("investor"),
              t.Literal("both"),
            ]),
          }),
        ),
        detail: {
          tags: ["Content & CMS"],
          summary: "Update existing financing product",
        },
      },
    )

    .delete(
      "/products/:id",
      ({ params, set }) =>
        repository.write((content) => {
          const prodId = Number(params.id);
          const index = content.products.findIndex((p) => p.id === prodId);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "Produk tidak ditemukan" };
          }
          const [deleted] = content.products.splice(index, 1);
          return {
            success: true,
            message: "Produk berhasil dihapus",
            data: deleted,
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Delete financing product",
        },
      },
    )

    // -------------------------------------------------------------
    // 6. TESTIMONIALS
    // -------------------------------------------------------------
    .get(
      "/testimonials",
      ({ query }) =>
        repository.read((content) => {
          let list = [...content.testimonials];
          if (query.type) {
            list = list.filter((t) => t.type === query.type);
          }
          return {
            success: true,
            count: list.length,
            data: list,
          };
        }),
      {
        query: t.Optional(
          t.Object({
            type: t.Optional(t.String()),
          }),
        ),
        detail: {
          tags: ["Content & Info"],
          summary: "Get verified borrower & investor testimonials",
        },
      },
    )

    .post(
      "/testimonials",
      ({ body }) =>
        repository.write((content) => {
          const newTestimonial = {
            ...body,
            id: content.nextId("testimonials"),
            rating: body.rating ?? 5,
          };
          content.testimonials.unshift(newTestimonial);
          return {
            success: true,
            message: "Testimoni berhasil ditambahkan",
            data: newTestimonial,
          };
        }),
      {
        body: t.Object({
          name: t.String(),
          role: t.String(),
          businessName: t.String(),
          avatar: t.String(),
          content: t.String(),
          rating: t.Optional(t.Numeric()),
          type: t.Union([t.Literal("borrower"), t.Literal("investor")]),
          fundedAmount: t.Optional(t.String()),
        }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Create a new testimonial",
        },
      },
    )

    .delete(
      "/testimonials/:id",
      ({ params, set }) =>
        repository.write((content) => {
          const testId = Number(params.id);
          const index = content.testimonials.findIndex((t) => t.id === testId);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "Testimoni tidak ditemukan" };
          }
          const [deleted] = content.testimonials.splice(index, 1);
          return {
            success: true,
            message: "Testimoni berhasil dihapus",
            data: deleted,
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Delete testimonial",
        },
      },
    )

    // -------------------------------------------------------------
    // 7. BOARD & EXECUTIVE TEAM (PERSONIL)
    // -------------------------------------------------------------
    .get(
      "/team",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: {
              shariaBoard: content.personil.filter((p) => p.jobLevel === 1),
              commissioners: content.personil.filter((p) => p.jobLevel === 2),
              directors: content.personil.filter((p) => p.jobLevel === 3),
              management: content.personil.filter((p) => p.jobLevel === 4),
              all: content.personil,
            },
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get organization personnel, commissioners, and DPS",
        },
      },
    )

    .post(
      "/team",
      ({ body }) =>
        repository.write((content) => {
          const newMember = {
            ...body,
            id: content.nextId("personil"),
          };
          content.personil.push(newMember);
          return {
            success: true,
            message: "Anggota tim berhasil ditambahkan",
            data: newMember,
          };
        }),
      {
        body: t.Object({
          fullName: t.String(),
          jobLevel: t.Numeric(),
          jobTitle: t.String(),
          biography: t.String(),
          photo: t.String(),
          department: t.String(),
        }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Add personil or board member",
        },
      },
    )

    .put(
      "/team/:id",
      ({ params, body, set }) =>
        repository.write((content) => {
          const id = Number(params.id);
          const index = content.personil.findIndex((p) => p.id === id);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "Anggota tim tidak ditemukan" };
          }
          content.personil[index] = { ...content.personil[index], ...body };
          return {
            success: true,
            message: "Data anggota tim berhasil diperbarui",
            data: content.personil[index],
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        body: t.Partial(
          t.Object({
            fullName: t.String(),
            jobLevel: t.Numeric(),
            jobTitle: t.String(),
            biography: t.String(),
            photo: t.String(),
            department: t.String(),
          }),
        ),
        detail: {
          tags: ["Content & CMS"],
          summary: "Update team member details",
        },
      },
    )

    .delete(
      "/team/:id",
      ({ params, set }) =>
        repository.write((content) => {
          const id = Number(params.id);
          const index = content.personil.findIndex((p) => p.id === id);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "Anggota tim tidak ditemukan" };
          }
          const [deleted] = content.personil.splice(index, 1);
          return {
            success: true,
            message: "Anggota tim berhasil dihapus",
            data: deleted,
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Delete team member",
        },
      },
    )

    // -------------------------------------------------------------
    // 8. FAQ CATEGORIES & FAQ LIST
    // -------------------------------------------------------------
    .get(
      "/faqs",
      ({ query }) =>
        repository.read((content) => {
          let list = [...content.faqs];

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
              (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
            );
          }

          return {
            success: true,
            categories: content.faqCategories,
            count: list.length,
            data: list,
          };
        }),
      {
        query: FaqQuerySchema,
        detail: {
          tags: ["Content & Info"],
          summary: "Get categorized FAQs for borrowers and investors",
        },
      },
    )

    .post(
      "/faqs",
      ({ body }) =>
        repository.write((content) => {
          const newFaq = {
            ...body,
            id: content.nextId("faqs"),
          };
          content.faqs.push(newFaq);
          return {
            success: true,
            message: "FAQ berhasil ditambahkan",
            data: newFaq,
          };
        }),
      {
        body: t.Object({
          categoryId: t.Numeric(),
          categoryName: t.String(),
          isInvestor: t.Numeric(),
          question: t.String(),
          answer: t.String({ maxLength: 10000, pattern: "^[^<>]*$" }),
        }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Create a new FAQ item",
        },
      },
    )

    .put(
      "/faqs/:id",
      ({ params, body, set }) =>
        repository.write((content) => {
          const faqId = Number(params.id);
          const index = content.faqs.findIndex((f) => f.id === faqId);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "FAQ tidak ditemukan" };
          }
          content.faqs[index] = { ...content.faqs[index], ...body };
          return {
            success: true,
            message: "FAQ berhasil diperbarui",
            data: content.faqs[index],
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        body: t.Partial(
          t.Object({
            categoryId: t.Numeric(),
            categoryName: t.String(),
            isInvestor: t.Numeric(),
            question: t.String(),
            answer: t.String({ maxLength: 10000, pattern: "^[^<>]*$" }),
          }),
        ),
        detail: {
          tags: ["Content & CMS"],
          summary: "Update existing FAQ item",
        },
      },
    )

    .delete(
      "/faqs/:id",
      ({ params, set }) =>
        repository.write((content) => {
          const faqId = Number(params.id);
          const index = content.faqs.findIndex((f) => f.id === faqId);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "FAQ tidak ditemukan" };
          }
          const [deleted] = content.faqs.splice(index, 1);
          return {
            success: true,
            message: "FAQ berhasil dihapus",
            data: deleted,
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Delete FAQ item",
        },
      },
    )

    // -------------------------------------------------------------
    // 9. BLOG POSTS & EDUCATIONAL GUIDES
    // -------------------------------------------------------------
    .get(
      "/blogs",
      ({ query }) =>
        repository.read((content) => {
          let posts = [...content.blogPosts];

          if (query.category) {
            posts = posts.filter((p) => p.category.toLowerCase() === query.category?.toLowerCase());
          }

          if (query.search) {
            const q = query.search.toLowerCase();
            posts = posts.filter((p) => {
              const titleMatch = p.title.toLowerCase().includes(q);
              const contentStr = Array.isArray(p.content) ? p.content.join(" ") : p.content || "";
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
            data: paged,
          };
        }),
      {
        query: BlogQuerySchema,
        detail: {
          tags: ["Content & Info"],
          summary: "Get educational blog articles",
        },
      },
    )

    .get(
      "/blogs/:identifier",
      ({ params, set }) =>
        repository.read((content) => {
          const idOrSlug = params.identifier;
          const post = content.blogPosts.find(
            (p) => p.slug === idOrSlug || p.id.toString() === idOrSlug,
          );

          if (!post) {
            set.status = 404;
            return { success: false, message: "Artikel tidak ditemukan" };
          }

          return {
            success: true,
            data: post,
          };
        }),
      {
        params: t.Object({
          identifier: t.String(),
        }),
        detail: {
          tags: ["Content & Info"],
          summary: "Get single blog article detail",
        },
      },
    )

    .post(
      "/blogs",
      ({ body }) =>
        repository.write((content) => {
          const slug =
            body.slug ||
            body.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
          const newPost = {
            ...body,
            id: content.nextId("blogPosts"),
            slug,
            publishedAt: new Date().toISOString(),
          };
          content.blogPosts.unshift(newPost);
          return {
            success: true,
            message: "Artikel berhasil dipublikasikan",
            data: newPost,
          };
        }),
      {
        body: t.Object({
          title: t.String(),
          slug: t.Optional(t.String()),
          excerpt: t.String(),
          content: t.String(),
          photo: t.String(),
          author: t.String(),
          category: t.String(),
          readTimeMinutes: t.Optional(t.Numeric()),
        }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Create new blog article",
        },
      },
    )

    .put(
      "/blogs/:id",
      ({ params, body, set }) =>
        repository.write((content) => {
          const blogId = Number(params.id);
          const index = content.blogPosts.findIndex((b) => b.id === blogId);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "Artikel tidak ditemukan" };
          }
          content.blogPosts[index] = { ...content.blogPosts[index], ...body };
          return {
            success: true,
            message: "Artikel berhasil diperbarui",
            data: content.blogPosts[index],
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        body: t.Partial(
          t.Object({
            title: t.String(),
            slug: t.String(),
            excerpt: t.String(),
            content: t.String(),
            photo: t.String(),
            author: t.String(),
            category: t.String(),
            readTimeMinutes: t.Numeric(),
          }),
        ),
        detail: {
          tags: ["Content & CMS"],
          summary: "Update existing blog article",
        },
      },
    )

    .delete(
      "/blogs/:id",
      ({ params, set }) =>
        repository.write((content) => {
          const blogId = Number(params.id);
          const index = content.blogPosts.findIndex((b) => b.id === blogId);
          if (index === -1) {
            set.status = 404;
            return { success: false, message: "Artikel tidak ditemukan" };
          }
          const [deleted] = content.blogPosts.splice(index, 1);
          return {
            success: true,
            message: "Artikel berhasil dihapus",
            data: deleted,
          };
        }),
      {
        params: t.Object({ id: t.Numeric() }),
        detail: {
          tags: ["Content & CMS"],
          summary: "Delete blog article",
        },
      },
    )

    // -------------------------------------------------------------
    // 10. PARTNERS, CLIENTS & SUPERVISE
    // -------------------------------------------------------------
    .get(
      "/clients",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.clients,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get authentic client & partner company logos",
        },
      },
    )

    .get(
      "/supervise",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.supervise,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get regulatory & supervisory authority logos (OJK, DSN-MUI, Kominfo, AFSI)",
        },
      },
    )

    .get(
      "/media",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.mediaCoverage,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get media mentions and press coverage",
        },
      },
    )

    .get(
      "/company",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: {
              info: content.siteSettings,
              missions: content.missions,
              clients: content.clients,
              supervise: content.supervise,
              mediaCoverage: content.mediaCoverage,
              awards: content.awards,
              activityDocs: content.activityDocs,
            },
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get full authentic company details, quotes, address, and partner logos",
        },
      },
    )

    .get(
      "/company-info",
      () =>
        repository.read((content) => {
          return {
            success: true,
            data: content.siteSettings,
          };
        }),
      {
        detail: {
          tags: ["Content & Info"],
          summary: "Get company profile, contacts, and regulatory compliance",
        },
      },
    )

    // -------------------------------------------------------------
    // 11. CMS SYSTEM CONTROLS
    // -------------------------------------------------------------
    .post(
      "/reset",
      () =>
        repository.write((content) => {
          content.resetToDefaults();
          return {
            success: true,
            message: "Seluruh data CMS berhasil direset kembali ke standar default Namia Syariah",
            data: {
              siteSettings: content.siteSettings,
              heroContent: content.heroContent,
            },
          };
        }),
      {
        detail: {
          tags: ["Content & CMS"],
          summary: "Reset all CMS content back to initial Namia Syariah baseline",
        },
      },
    );
