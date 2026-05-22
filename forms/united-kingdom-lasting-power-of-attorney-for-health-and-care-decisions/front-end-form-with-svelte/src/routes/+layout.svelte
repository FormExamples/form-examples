<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<header class="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
  <h1 class="text-xl font-semibold text-slate-900">
    Lasting Power of Attorney for Health and Welfare (LP1H)
  </h1>
  <p class="text-sm text-slate-600">Mental Capacity Act 2005 — England and Wales</p>
</header>

<main class="mx-auto max-w-4xl px-6 py-8">
  {@render children()}
</main>
