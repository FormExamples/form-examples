<script lang="ts">
  import { store } from '$lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 2 — Organization &amp; context</h2>
  <p class="text-sm text-slate-600 mb-4">The organization context for the decision.</p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="block">
      <span class="text-sm text-slate-700">Organization name</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.organization.name} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Legal name</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.organization.legalName} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Industry</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.organization.industry} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Domain (e.g. example.com)</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.organization.domain} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Country (ISO 3166-1 alpha-2)</span>
      <input
        type="text"
        maxlength="2"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.organization.countryAsIso31661Alpha2}
      />
    </label>
    <label class="block md:col-span-2">
      <span class="text-sm text-slate-700">Description</span>
      <textarea class="w-full border rounded px-2 py-1 font-mono text-sm" rows="3" bind:value={store.data.organization.description}></textarea>
    </label>
  </div>
</section>
