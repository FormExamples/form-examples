<script lang="ts">
  import { store } from '$lib/stores/adr.svelte.js';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 1 — Author identification</h2>
  <p class="text-sm text-slate-600 mb-4">Who is writing this ADR.</p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="block">
      <span class="text-sm text-slate-700">Author name</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.author.name} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Email</span>
      <input type="email" class="w-full border rounded px-2 py-1" bind:value={store.data.author.email} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Phone</span>
      <input type="tel" class="w-full border rounded px-2 py-1" bind:value={store.data.author.phone} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Role</span>
      <select class="w-full border rounded px-2 py-1" bind:value={store.data.author.role}>
        <option value="">—</option>
        <option value="architect">Architect</option>
        <option value="principal-engineer">Principal engineer</option>
        <option value="staff-engineer">Staff engineer</option>
        <option value="engineering-manager">Engineering manager</option>
        <option value="cto">CTO</option>
        <option value="product-manager">Product manager</option>
        <option value="security-officer">Security officer</option>
        <option value="compliance-officer">Compliance officer</option>
        <option value="consultant">Consultant</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Organization (free text)</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.author.organizationName} />
    </label>
    <label class="block">
      <span class="text-sm text-slate-700">Team</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={store.data.author.teamName} />
    </label>
  </div>
</section>
