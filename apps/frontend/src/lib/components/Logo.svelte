<script lang="ts">
  interface Props {
    variant?: "dark" | "light" | "white";
    size?: "sm" | "md" | "lg";
    showBadge?: boolean;
    showOjk?: boolean;
    class?: string;
  }

  let {
    variant = "dark",
    size = "md",
    showBadge = true,
    showOjk = false,
    class: className = "",
  }: Props = $props();

  // Size configurations
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-lg tracking-tight",
    md: "text-xl sm:text-2xl tracking-tight",
    lg: "text-2xl sm:text-3xl tracking-tight",
  };

  const badgeSizes = {
    sm: "text-[9px] px-1.5 py-0.2",
    md: "text-[10px] px-2 py-0.5",
    lg: "text-xs px-2.5 py-0.5",
  };
</script>

<div class="inline-flex items-center gap-2.5 select-none {className}">
  <!-- Clean Solid Geometric Namia N Emblem (Web 2.0 Solid Colors, No Gradients) -->
  <div class="relative shrink-0 {iconSizes[size]}">
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="w-full h-full"
    >
      <!-- Rounded Background Squircle -->
      <rect
        width="100"
        height="100"
        rx="16"
        fill={variant === "light" || variant === "white"
          ? "#047857"
          : "#059669"}
      />

      <!-- Left Stem of N -->
      <rect x="22" y="24" width="14" height="52" rx="3" fill="#ffffff" />

      <!-- Ascending Diagonal Ribbon & Sprout Curve -->
      <path
        d="M26 28 C36 40 50 62 66 74 L78 74 C60 56 46 36 34 24 Z"
        fill="#a7f3d0"
      />

      <!-- Right Stem of N -->
      <rect x="64" y="24" width="14" height="52" rx="3" fill="#ffffff" />

      <!-- Radiant Barakah Seed / Growth Dot (An-Namaa') -->
      <circle cx="71" cy="20" r="6" fill="#f59e0b" />
    </svg>
  </div>

  <!-- Wordmark & Badges -->
  <div class="flex flex-col">
    <div class="flex items-center gap-1.5 leading-none">
      <span
        class="font-bold {textSizes[size]} {variant === 'light' ||
        variant === 'white'
          ? 'text-white'
          : 'text-slate-900'}"
      >
        NAMIA
      </span>
      {#if showBadge}
        <span
          class="font-bold uppercase rounded-[3px] {badgeSizes[
            size
          ]} {variant === 'light'
            ? 'bg-emerald-800 text-emerald-100 border border-emerald-700'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-300'}"
        >
          Syariah
        </span>
      {/if}
    </div>

    {#if showOjk}
      <div
        class="flex items-center gap-1 mt-0.5 text-[10px] tracking-wider uppercase font-semibold {variant ===
        'light'
          ? 'text-emerald-200'
          : 'text-slate-600'}"
      >
        <span>Berizin & Diawasi</span>
        <span
          class="font-bold {variant === 'light'
            ? 'text-amber-300'
            : 'text-emerald-800'}">OJK</span
        >
      </div>
    {/if}
  </div>
</div>
