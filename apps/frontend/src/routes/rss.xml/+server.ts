import type { RequestHandler } from './$types';
import { defaultBlogPosts } from '$lib/cms';
import { API_BASE_URL, NAMIA_API_KEY } from '$lib/api';

export const GET: RequestHandler = async ({ url }) => {
  const origin = url.origin;

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

  const buildDate = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Namia Syariah — Sindikasi Berita &amp; Literasi Keuangan Syariah</title>
    <link>${origin}</link>
    <description>Warta pembiayaan P2P syariah, edukasi muamalah, tips bisnis UMKM, dan publikasi resmi platform Namia Syariah.</description>
    <language>id-ID</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${origin}/images/home/logofintechsyariah.png</url>
      <title>Namia Syariah</title>
      <link>${origin}</link>
    </image>
${blogPosts
  .map((post) => {
    const postDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : buildDate;
    const postUrl = `${origin}/blog?id=${post.id}`;
    const desc = typeof post.excerpt === 'string' && post.excerpt ? post.excerpt : (post.summary || '');
    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${postDate}</pubDate>
      <author><![CDATA[${post.author || 'Dewan Redaksi Namia Syariah'}]]></author>
      <category><![CDATA[${post.category || 'Ekonomi Syariah'}]]></category>
      <description><![CDATA[${desc}]]></description>
    </item>`;
  })
  .join('\n')}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800'
    }
  });
};
