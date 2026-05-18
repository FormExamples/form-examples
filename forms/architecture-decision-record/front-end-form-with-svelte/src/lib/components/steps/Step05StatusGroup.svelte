<script lang="ts">
  import { store } from '$lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 5 — Status &amp; group</h2>
  <p class="text-sm text-slate-600 mb-4">
    Tyree &amp; Akerman §3 &amp; §4: workflow status and architectural category.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="block">
      <span class="text-sm text-slate-700">Slug (URL-safe identifier)</span>
      <input type="text" class="w-full border rounded px-2 py-1" placeholder="use-postgres-for-primary-storage" bind:value={store.data.adr.slug} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Number (sequential, optional)</span>
      <input type="number" class="w-full border rounded px-2 py-1" bind:value={store.data.adr.number} />
    </label>
    <label class="block md:col-span-2">
      <span class="text-sm text-slate-700">Title</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.adr.title} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Decision date</span>
      <input type="date" class="w-full border rounded px-2 py-1" bind:value={store.data.adr.decisionDate} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Status</span>
      <select class="w-full border rounded px-2 py-1" bind:value={store.data.adr.status}>
        <option value="pending">Pending</option>
        <option value="decided">Decided</option>
        <option value="approved">Approved</option>
        <option value="superseded">Superseded</option>
        <option value="deprecated">Deprecated</option>
      </select>
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Group</span>
      <select class="w-full border rounded px-2 py-1" bind:value={store.data.adr.decisionGroup}>
        <option value="">—</option>
        <option value="business">Business</option>
        <option value="data">Data</option>
        <option value="integration">Integration</option>
        <option value="presentation">Presentation</option>
        <option value="security">Security</option>
        <option value="infrastructure">Infrastructure</option>
        <option value="operations">Operations</option>
        <option value="governance">Governance</option>
        <option value="other">Other</option>
      </select>
    </label>
  </div>
</section>
