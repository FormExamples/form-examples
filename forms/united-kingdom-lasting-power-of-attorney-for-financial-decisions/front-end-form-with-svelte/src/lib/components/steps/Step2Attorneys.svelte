<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  import PersonCard from '$lib/components/ui/PersonCard.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 2 &mdash; Attorneys (LP1F section 2)</h2>
  <p class="text-sm text-slate-600 mb-3">
    One or more people (or a single trust corporation) who will make financial decisions for the donor.
    Each attorney must be 18+, not bankrupt, and not subject to a debt relief order. If you appoint
    more than 4 attorneys, attach LPC continuation sheet 1.
  </p>

  <div class="space-y-4">
    {#each store.data.attorneys as a, i (a.person.id)}
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-700">Attorney #{a.ordinal}</h3>
          <button
            type="button"
            class="text-xs text-red-700 hover:underline"
            onclick={() => store.removeAttorney(i)}
          >
            Remove
          </button>
        </div>
        <PersonCard
          bind:person={store.data.attorneys[i].person}
          showTrustCorporation
          showBankruptcyFlags
        />
      </div>
    {/each}
  </div>

  <button
    type="button"
    class="mt-4 px-3 py-2 rounded bg-brand-600 text-white text-sm hover:bg-brand-700"
    onclick={() => store.addAttorney()}
  >
    Add attorney
  </button>
</section>
