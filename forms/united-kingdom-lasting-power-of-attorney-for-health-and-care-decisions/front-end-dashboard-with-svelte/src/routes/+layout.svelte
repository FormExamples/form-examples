<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<header class="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
  <h1 class="text-xl font-semibold text-slate-900">LP1H Case-manager dashboard</h1>
  <p class="text-sm text-slate-600">Lasting Power of Attorney for Health and Welfare — Mental Capacity Act 2005</p>
</header>

<main class="mx-auto max-w-6xl px-6 py-8">
  {@render children()}
</main>
