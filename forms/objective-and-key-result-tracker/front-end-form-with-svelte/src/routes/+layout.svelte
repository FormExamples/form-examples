<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<div class="max-w-4xl mx-auto p-6">
  <header class="mb-6">
    <h1 class="text-3xl font-bold">OKR Tracker</h1>
    <p class="text-sm text-gray-600">One Objective with its 1–5 Key Results.</p>
  </header>
  {@render children()}
</div>
