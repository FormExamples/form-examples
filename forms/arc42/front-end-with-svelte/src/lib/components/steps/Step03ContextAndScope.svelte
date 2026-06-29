<script lang="ts">
  import { store } from '$lib/stores/documentation.svelte.js';
  import type { ContextPartner } from '$lib/grading/types.js';

  const MAX_BUSINESS = 8;
  const MAX_TECHNICAL = 8;

  function businessPartners() {
    return store.data.contextPartners.filter((p) => p.kind === 'business');
  }
  function technicalInterfaces() {
    return store.data.contextPartners.filter((p) => p.kind === 'technical');
  }

  function addPartner(kind: 'business' | 'technical') {
    const ordinal = store.data.contextPartners.length + 1;
    store.data.contextPartners = [
      ...store.data.contextPartners,
      { ordinal, kind, name: '', interfaceDescription: '', protocol: '', direction: '' },
    ];
  }

  function removePartnerWhere(kind: ContextPartner['kind'], indexInKind: number) {
    let count = 0;
    store.data.contextPartners = store.data.contextPartners.filter((p) => {
      if (p.kind !== kind) return true;
      return count++ !== indexInKind;
    });
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 3 — Context &amp; Scope</h2>

  <label class="block mb-4">
    <span class="text-sm text-base-content/80">Business context description</span>
    <textarea rows="4" class="w-full border rounded px-2 py-1" bind:value={store.data.businessContextDescription}></textarea>
  </label>

  <!-- Business partners -->
  <div class="mb-6">
    <header class="flex items-center justify-between mb-2">
      <h3 class="text-md font-semibold text-base-content/80">Business context partners (max {MAX_BUSINESS})</h3>
      <button type="button"
              class="text-sm px-2 py-1 rounded bg-base-300 hover:bg-base-300 disabled:opacity-50"
              disabled={businessPartners().length >= MAX_BUSINESS}
              onclick={() => addPartner('business')}>
        Add ({businessPartners().length}/{MAX_BUSINESS})
      </button>
    </header>
    {#each businessPartners() as item, i (i)}
      <div class="border border-base-300 rounded p-3 mb-2">
        <input type="text" placeholder="Name" class="w-full border rounded px-2 py-1 mb-1" bind:value={item.name} />
        <textarea rows="2" placeholder="Interface description" class="w-full border rounded px-2 py-1 mb-1" bind:value={item.interfaceDescription}></textarea>
        <div class="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Protocol" class="border rounded px-2 py-1" bind:value={item.protocol} />
          <select class="border rounded px-2 py-1" bind:value={item.direction}>
            <option value="">Direction —</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
            <option value="bidirectional">Bidirectional</option>
          </select>
        </div>
        <button type="button" class="text-xs text-error mt-2" onclick={() => removePartnerWhere('business', i)}>Remove</button>
      </div>
    {/each}
  </div>

  <label class="block mb-4">
    <span class="text-sm text-base-content/80">Technical context description</span>
    <textarea rows="4" class="w-full border rounded px-2 py-1" bind:value={store.data.technicalContextDescription}></textarea>
  </label>

  <!-- Technical interfaces -->
  <div class="mb-6">
    <header class="flex items-center justify-between mb-2">
      <h3 class="text-md font-semibold text-base-content/80">Technical interfaces (max {MAX_TECHNICAL})</h3>
      <button type="button"
              class="text-sm px-2 py-1 rounded bg-base-300 hover:bg-base-300 disabled:opacity-50"
              disabled={technicalInterfaces().length >= MAX_TECHNICAL}
              onclick={() => addPartner('technical')}>
        Add ({technicalInterfaces().length}/{MAX_TECHNICAL})
      </button>
    </header>
    {#each technicalInterfaces() as item, i (i)}
      <div class="border border-base-300 rounded p-3 mb-2">
        <input type="text" placeholder="Name" class="w-full border rounded px-2 py-1 mb-1" bind:value={item.name} />
        <textarea rows="2" placeholder="Interface description" class="w-full border rounded px-2 py-1 mb-1" bind:value={item.interfaceDescription}></textarea>
        <div class="grid grid-cols-2 gap-2">
          <input type="text" placeholder="Protocol" class="border rounded px-2 py-1" bind:value={item.protocol} />
          <select class="border rounded px-2 py-1" bind:value={item.direction}>
            <option value="">Direction —</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
            <option value="bidirectional">Bidirectional</option>
          </select>
        </div>
        <button type="button" class="text-xs text-error mt-2" onclick={() => removePartnerWhere('technical', i)}>Remove</button>
      </div>
    {/each}
  </div>
</section>
