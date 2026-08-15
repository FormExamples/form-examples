<script lang="ts">
  import { store } from '#lib/stores/lpa.svelte.js';
  import PersonCard from '#lib/components/ui/PersonCard.svelte';
</script>

<section id="step-attorneys">
  <h2 class="text-xl font-semibold mb-2">Step 2 &mdash; Attorneys (LP1F section 2)</h2>
  <p class="text-sm text-base-content/70 mb-3">
    One or more people (or a single trust corporation) who will make financial decisions for the donor.
    Each attorney must be 18+, not bankrupt, and not subject to a debt relief order. If you appoint
    more than 4 attorneys, attach LPC continuation sheet 1.
  </p>

  <div class="space-y-4">
    {#each store.data.attorneys as a, i (a.person.id)}
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-base-content/80">Attorney #{a.ordinal}</h3>
          <button
            type="button"
            class="text-xs text-error hover:underline"
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
    class="mt-4 px-3 py-2 rounded bg-primary text-primary-content text-sm hover:bg-primary"
    onclick={() => store.addAttorney()}
  >
    Add attorney
  </button>
</section>
