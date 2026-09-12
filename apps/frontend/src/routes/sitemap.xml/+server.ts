import type { RequestHandler } from './$types';
import { defaultBlogPosts } from '$lib/cms';
import { API_BASE_URL, NAMIA_API_KEY } from '$lib/api';

export const GET: RequestHandler = async ({ url }) => {
  const origin = url.origin;

  // 1. Static public routes with their change frequency and priority
  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
    { path: '/team', priority: '0.8', changefreq: 'monthly' },
    { path: '/blog', priority: '0.9', changefreq: 'daily' },
    { path: '/calculators', priority: '0.8', changefreq: 'monthly' },
    { path: '/contacts', priority: '0.7', changefreq: 'monthly' },
    { path: '/aggregator', priority: '0.8', changefreq: 'weekly' },
    { path: '/onboarding', priority: '0.8', changefreq: 'weekly' },
    { path: '/borrower', priority: '0.8', changefreq: 'weekly' },
    { path: '/investor', priority: '0.8', changefreq: 'weekly' }
  ];

  // 2. Fetch blog posts from backend or fallback to defaultBlogPosts
  let blogPosts = defaultBlogPosts;
  try {
    const res = await fetch(`${API_BASE_URL}/api/content/blogs`, {
      headers: { 'x-api-key': NAMIA_API_KEY }
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        blogPosts = json.data;
      }
    }
  } catch {
    // Fallback to defaultBlogPosts
  }

  const currentDate = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticRoutes
  .map(
    (r) => `  <url>
    <loc>${origin}${r.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
${blogPosts
  .map((b) => {
    const date = b.publishedAt ? new Date(b.publishedAt).toISOString().split('T')[0] : currentDate;
    return `  <url>
    <loc>${origin}/blog?id=${b.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
