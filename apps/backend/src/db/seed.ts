import { client, db, isDbConnected } from "../config/db";
import { categories, products } from "../schemas/product";
import { stats, personil, faqCategories, faqs, blogPosts } from "../schemas/content";
import {
  initialCategories,
  initialProducts,
  initialStats,
  initialPersonil,
  initialFaqCategories,
  initialFaqs,
  initialBlogPosts
} from "./mockData";

export async function runSeed() {
  console.log("Starting database seeding routine...");
  if (!db || !client) {
    console.log("No PostgreSQL client available. Skipping remote DB seed; using in-memory mock store.");
    return;
  }

  try {
    console.log("Checking PostgreSQL database connection...");
    // Test connection with timeout
    await client`SELECT 1`;
    console.log("PostgreSQL connection confirmed. Seeding tables...");

    // 1. Categories
    for (const cat of initialCategories) {
      await db.insert(categories).values({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon
      }).onConflictDoNothing();
    }

    // 2. Products
    for (const p of initialProducts) {
      await db.insert(products).values({
        id: p.id,
        categoryId: p.categoryId,
        name: p.name,
        provider: p.provider,
        logo: p.logo,
        description: p.description,
        minAmount: p.minAmount.toString(),
        maxAmount: p.maxAmount.toString(),
        minTenorMonths: p.minTenorMonths,
        maxTenorMonths: p.maxTenorMonths,
        interestRateAnnual: p.interestRateAnnual.toString(),
        adminFee: p.adminFee.toString(),
        rating: p.rating.toString(),
        shariaAccredited: p.shariaAccredited,
        contractType: p.contractType,
        features: JSON.stringify(p.features),
        applyUrl: p.applyUrl,
        isFeatured: p.isFeatured
      }).onConflictDoNothing();
    }

    console.log("Database seeded successfully with Namia Syariah Fintech products & content!");
  } catch (err) {
    console.warn("Could not seed PostgreSQL (database offline or credentials not set). Defaulting to in-memory store:", err);
  }
}

if (import.meta.main) {
  runSeed().then(() => process.exit(0));
}
