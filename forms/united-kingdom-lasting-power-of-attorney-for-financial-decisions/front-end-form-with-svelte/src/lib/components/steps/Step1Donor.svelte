<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  import PersonCard from '$lib/components/ui/PersonCard.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 1 &mdash; Donor (LP1F section 1)</h2>
  <p class="text-sm text-slate-600 mb-3">
    The person making the LPA. Must be 18 or older and have mental capacity at the time of signing.
  </p>
  <PersonCard bind:person={store.data.donor} />
</section>
