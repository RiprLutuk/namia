import { Elysia, t } from "elysia";
import { mockDb, type ProductData } from "../db/mockData";
import { ProductFilterSchema, CompareProductsSchema } from "../schemas/product";

export const aggregatorController = new Elysia({ prefix: "/api/aggregator" })
  // 1. Get all categories
  .get("/categories", () => {
    return {
      success: true,
      data: mockDb.categories
    };
  }, {
    detail: {
      tags: ["Aggregator"],
      summary: "Get list of financial product categories"
    }
  })

  // 2. Get products with dynamic filtering & sorting
  .get("/products", ({ query }) => {
    let result: ProductData[] = [...mockDb.products];

    // Filter by category slug or id
    if (query.category) {
      result = result.filter(
        (p) => p.categorySlug.toLowerCase() === query.category?.toLowerCase() ||
               p.categoryId.toString() === query.category
      );
    }

    // Filter by keyword search
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) ||
               p.provider.toLowerCase().includes(q) ||
               p.description.toLowerCase().includes(q) ||
               p.contractType.toLowerCase().includes(q)
      );
    }

    // Filter by min / max amount
    if (query.minAmount !== undefined) {
      const min = Number(query.minAmount);
      result = result.filter((p) => p.maxAmount >= min);
    }
    if (query.maxAmount !== undefined) {
      const max = Number(query.maxAmount);
      result = result.filter((p) => p.minAmount <= max);
    }

    // Filter by tenor
    if (query.minTenor !== undefined) {
      const tenor = Number(query.minTenor);
      result = result.filter((p) => p.maxTenorMonths >= tenor);
    }
    if (query.maxTenor !== undefined) {
      const tenor = Number(query.maxTenor);
      result = result.filter((p) => p.minTenorMonths <= tenor);
    }

    // Filter by max margin / interest rate
    if (query.maxRate !== undefined) {
      const maxRate = Number(query.maxRate);
      result = result.filter((p) => p.interestRateAnnual <= maxRate);
    }

    // Filter by sharia accreditation
    if (query.shariaOnly !== undefined && (query.shariaOnly === true || String(query.shariaOnly) === "true")) {
      result = result.filter((p) => p.shariaAccredited);
    }

    // Sorting
    if (query.sortBy) {
      switch (query.sortBy) {
        case "rate_asc":
          result.sort((a, b) => a.interestRateAnnual - b.interestRateAnnual);
          break;
        case "rate_desc":
          result.sort((a, b) => b.interestRateAnnual - a.interestRateAnnual);
          break;
        case "amount_desc":
          result.sort((a, b) => b.maxAmount - a.maxAmount);
          break;
        case "rating_desc":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "popular":
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return {
      success: true,
      count: result.length,
      data: result
    };
  }, {
    query: ProductFilterSchema,
    detail: {
      tags: ["Aggregator"],
      summary: "Filter, search, and sort financial products"
    }
  })

  // 3. Get featured products
  .get("/featured", () => {
    const featured = mockDb.products.filter((p) => p.isFeatured);
    return {
      success: true,
      data: featured
    };
  }, {
    detail: {
      tags: ["Aggregator"],
      summary: "Get highlighted/featured financial products"
    }
  })

  // 4. Get product detail by ID
  .get("/products/:id", ({ params, set }) => {
    const id = Number(params.id);
    const product = mockDb.products.find((p) => p.id === id);
    if (!product) {
      set.status = 404;
      return { success: false, message: "Produk finansial tidak ditemukan" };
    }
    return {
      success: true,
      data: product
    };
  }, {
    params: t.Object({
      id: t.Numeric()
    }),
    detail: {
      tags: ["Aggregator"],
      summary: "Get individual product details"
    }
  })

  // 5. Compare products by list of IDs
  .post("/compare", ({ body, set }) => {
    const ids = body.ids.map(Number);
    if (ids.length < 2) {
      set.status = 400;
      return { success: false, message: "Pilih minimal 2 produk untuk dibandingkan" };
    }
    if (ids.length > 4) {
      set.status = 400;
      return { success: false, message: "Maksimal 4 produk untuk dibandingkan sekaligus" };
    }

    const items = mockDb.products.filter((p) => ids.includes(p.id));
    return {
      success: true,
      comparedCount: items.length,
      data: items
    };
  }, {
    body: CompareProductsSchema,
    detail: {
      tags: ["Aggregator"],
      summary: "Compare multiple financial products side-by-side"
    }
  });
