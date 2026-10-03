import {
  LayoutDashboard,
  Globe,
  Sparkles,
  TrendingUp,
  Package,
  BarChart3,
  BookOpen,
  Users,
  HelpCircle,
  MessageSquare,
} from "lucide-svelte";
export const cmsNavigation = [
  { label: "Ruang kerja", items: [{ id: "overview", label: "Ringkasan", icon: LayoutDashboard }] },
  {
    label: "Halaman website",
    items: [
      { id: "branding", label: "Identitas & kontak", icon: Globe },
      { id: "hero", label: "Beranda", icon: Sparkles },
      { id: "investor", label: "Halaman pendanaan", icon: TrendingUp },
    ],
  },
  {
    label: "Katalog & publikasi",
    items: [
      { id: "products", label: "Produk pembiayaan", icon: Package },
      { id: "stats", label: "Statistik", icon: BarChart3 },
      { id: "articles", label: "Artikel & blog", icon: BookOpen },
      { id: "team", label: "Dewan & tim", icon: Users },
      { id: "faqs", label: "FAQ", icon: HelpCircle },
      { id: "testimonials", label: "Testimoni", icon: MessageSquare },
    ],
  },
] as const;
export type CmsTab = (typeof cmsNavigation)[number]["items"][number]["id"];
