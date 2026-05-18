<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen bg-yellow-50 text-stone-900">
  <header class="bg-yellow-400 border-b-4 border-yellow-700 px-6 py-4">
    <h1 class="text-lg font-bold">International Certificate of Vaccination or Prophylaxis</h1>
    <p class="text-sm">WHO IHR 2005 Annex 6 — yellow card</p>
  </header>
  <main class="max-w-3xl mx-auto p-4">
    {@render children?.()}
  </main>
</div>
