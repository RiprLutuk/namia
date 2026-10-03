<script lang="ts">
  import {
    ArrowUpRight,
    Plus,
    BookOpen,
    Package,
    HelpCircle,
    Users,
    ArrowRight,
  } from "lucide-svelte";
  import type { CmsTab } from "./navigation";
  let {
    counts,
    onselect,
    onproduct,
    onarticle,
  }: {
    counts: { products: number; articles: number; faqs: number; team: number };
    onselect: (tab: CmsTab) => void;
    onproduct: () => void;
    onarticle: () => void;
  } = $props();
  const collections = $derived([
    { id: "products" as const, label: "Produk pembiayaan", count: counts.products, icon: Package },
    { id: "articles" as const, label: "Artikel & blog", count: counts.articles, icon: BookOpen },
    { id: "faqs" as const, label: "Jawaban FAQ", count: counts.faqs, icon: HelpCircle },
    { id: "team" as const, label: "Dewan & tim", count: counts.team, icon: Users },
  ]);
</script>

<section class="overview">
  <div class="intro">
    <div>
      <p class="eyebrow">NAMIA / RUANG EDITOR</p>
      <h1>Konten yang jelas.<br />Mitra yang lebih paham.</h1>
      <p>
        Kelola informasi yang membantu mitra mengenal Namia<br class="desktop" /> dan menentukan langkah
        berikutnya.
      </p>
    </div>
    <div class="intro-actions">
      <button onclick={onproduct}><Plus size={16} />Tambah produk</button><button
        class="secondary"
        onclick={onarticle}><BookOpen size={16} />Tulis artikel</button
      >
    </div>
  </div>
  <div class="collection-counts">
    {#each collections as item}<button onclick={() => onselect(item.id)}
        ><div><item.icon size={18} /><ArrowUpRight size={15} /></div>
        <strong>{item.count}</strong><span>{item.label}</span></button
      >{/each}
  </div>
  <div class="workspace-grid">
    <section class="pages">
      <div class="section-title">
        <h2>Halaman website</h2>
        <span>Pilih bagian yang ingin diperbarui</span>
      </div>
      {#each [{ id: "branding" as const, label: "Identitas & kontak", description: "Nama perusahaan, tagline, dan informasi kontak." }, { id: "hero" as const, label: "Beranda", description: "Pesan pembuka, pengumuman, dan ajakan utama." }, { id: "investor" as const, label: "Halaman pendanaan", description: "Informasi pendanaan, alur, dan prinsip syariah." }] as item}<button
          onclick={() => onselect(item.id)}
          ><div>
            <h3>{item.label}</h3>
            <p>{item.description}</p>
          </div>
          <ArrowRight size={17} /></button
        >{/each}
    </section>
    <aside>
      <span class="eyebrow">SEBELUM MENYIMPAN</span>
      <h2>Periksa dari sudut<br />pandang mitra.</h2>
      <p>
        Pastikan informasi akurat, kalimat mudah dipahami, dan tautan mengarah ke halaman yang
        sesuai.
      </p>
      <p>Perubahan tampil di website setelah Anda menekan tombol simpan.</p>
      <a href="/" target="_blank" rel="noopener">Lihat website<ArrowUpRight size={16} /></a>
    </aside>
  </div>
</section>

<style>
  .intro {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    padding: 12px 0 32px;
  }
  .eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.7px;
    color: #4f8169;
  }
  h1 {
    font-family: "Raleway", Arial, sans-serif;
    font-size: 36px;
    line-height: 1.2;
    letter-spacing: -1.1px;
    font-weight: 600;
    color: #183f35;
    margin: 15px 0;
  }
  .intro p:not(.eyebrow) {
    font-size: 13px;
    line-height: 1.8;
    color: #76877d;
  }
  .intro-actions {
    display: grid;
    gap: 10px;
  }
  .intro-actions button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 13px 20px;
    border-radius: 5px;
    font-size: 12px;
    font-weight: 600;
    background: #185d45;
    color: white;
    cursor: pointer;
  }
  .intro-actions .secondary {
    background: #fff;
    color: #315d47;
    border: 1px solid #d5e1d8;
  }
  .collection-counts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid #dce5df;
    border-radius: 8px;
    background: white;
    overflow: hidden;
    margin-bottom: 32px;
  }
  .collection-counts button {
    text-align: left;
    padding: 24px;
    border-right: 1px solid #e4ebe6;
    cursor: pointer;
  }
  .collection-counts button:last-child {
    border: 0;
  }
  .collection-counts button:hover {
    background: #f8fbf9;
  }
  .collection-counts button > div {
    display: flex;
    justify-content: space-between;
    color: #70927c;
  }
  .collection-counts strong {
    display: block;
    font-size: 34px;
    font-weight: 500;
    letter-spacing: -1px;
    margin: 20px 0 4px;
    color: #204f38;
  }
  .collection-counts span {
    font-size: 11px;
    color: #73867a;
  }
  .workspace-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 24px;
  }
  .pages {
    border: 1px solid #dce5df;
    border-radius: 8px;
    background: white;
    padding: 24px;
  }
  .section-title {
    margin-bottom: 16px;
  }
  h2 {
    font-size: 17px;
    font-weight: 600;
    color: #294d3c;
  }
  .section-title span {
    font-size: 11px;
    color: #89988e;
  }
  .pages button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    gap: 15px;
    padding: 20px 0;
    border-top: 1px solid #edf1ee;
    color: #4f7960;
    cursor: pointer;
  }
  .pages h3 {
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 6px;
  }
  .pages p {
    font-size: 11px;
    color: #849389;
  }
  .workspace-grid aside {
    background: #e8f0e9;
    border: 1px solid #d8e3d8;
    border-radius: 8px;
    padding: 28px;
  }
  .workspace-grid aside h2 {
    font-size: 24px;
    line-height: 1.35;
    letter-spacing: -0.5px;
    margin: 15px 0;
  }
  .workspace-grid aside p {
    font-size: 12px;
    line-height: 1.9;
    color: #64806c;
    margin-top: 12px;
  }
  .workspace-grid aside a {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    margin-top: 24px;
    color: #295e3f;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #27845e;
    outline-offset: -3px;
  }
  @media (max-width: 1050px) {
    h1 {
      font-size: 30px;
    }
    .workspace-grid {
      grid-template-columns: 1fr;
    }
    .collection-counts button {
      padding: 18px;
    }
  }
  @media (max-width: 600px) {
    .intro {
      display: block;
    }
    h1 {
      font-size: 28px;
    }
    .intro-actions {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
    }
    .collection-counts {
      grid-template-columns: 1fr 1fr;
    }
    .collection-counts button {
      border-bottom: 1px solid #e4ebe6;
    }
    .collection-counts button:nth-child(2) {
      border-right: 0;
    }
    .desktop {
      display: none;
    }
  }
</style>
