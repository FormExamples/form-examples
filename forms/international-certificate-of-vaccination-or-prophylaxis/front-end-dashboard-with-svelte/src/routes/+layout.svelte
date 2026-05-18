<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="min-h-screen bg-yellow-50 text-stone-900">
  <header class="bg-yellow-400 border-b-4 border-yellow-700 px-6 py-4">
    <h1 class="text-lg font-bold">ICVP review dashboard</h1>
    <p class="text-sm">Issued International Certificates of Vaccination or Prophylaxis</p>
  </header>
  {@render children?.()}
</div>
