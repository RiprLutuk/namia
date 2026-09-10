import { Elysia, t } from "elysia";
import { mockDb } from "../db/mockData";
import { FaqQuerySchema, BlogQuerySchema } from "../schemas/content";

export const contentController = new Elysia({ prefix: "/api/content" })
  // 1. Get company impact statistics
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

  // 2. Get board & executive team (personil)
  .get("/team", () => {
    return {
      success: true,
      data: {
        shariaBoard: mockDb.personil.filter((p) => p.jobLevel === 1),
        commissioners: mockDb.personil.filter((p) => p.jobLevel === 2),
        directors: mockDb.personil.filter((p) => p.jobLevel === 3),
        management: mockDb.personil.filter((p) => p.jobLevel === 4)
      }
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get organization personnel, commissioners, and DPS"
    }
  })

  // 3. Get FAQ categories & FAQ list
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

  // 4. Get blog posts (Edu-Fintech)
  .get("/blogs", ({ query }) => {
    let posts = [...mockDb.blogPosts];

    if (query.category) {
      posts = posts.filter((p) => p.category.toLowerCase() === query.category?.toLowerCase());
    }

    if (query.search) {
      const q = query.search.toLowerCase();
      posts = posts.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    }

    const limit = query.limit ? Number(query.limit) : 10;
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

  // 5. Get blog post by slug or ID
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

  // 6. Get corporate contact and legal disclosures
  .get("/company-info", () => {
    return {
      success: true,
      data: {
        name: "PT Syarfi Teknologi Finansial",
        address: "Menara MTH 10th floor, Jl. MT Haryono Kav 23, Jakarta 12820",
        phone: "(+62) 21 8378 2337",
        fax: "(+62) 21 8378 2338",
        email: "salam@syarfi.id",
        quote: "Sebaik-baik Manusia adalah yang Paling Berguna Bagi Sesamanya",
        quoteOrigin: "HR. Ahmad",
        socials: {
          facebook: "https://www.facebook.com/Syarfi-472466949792782/",
          instagram: "https://www.instagram.com/syarfi.id/",
          twitter: "https://twitter.com/Syarfi_ID"
        },
        regulatoryDisclaimer: "PT Syarfi Teknologi Finansial beroperasi dengan standar kepatuhan regulasi Otoritas Jasa Keuangan (OJK) serta berada di bawah bimbingan dan pengawasan Dewan Pengawas Syariah (DPS) terafiliasi DSN-MUI."
      }
    };
  }, {
    detail: {
      tags: ["Content & Info"],
      summary: "Get company profile, contacts, and regulatory compliance"
    }
  });
