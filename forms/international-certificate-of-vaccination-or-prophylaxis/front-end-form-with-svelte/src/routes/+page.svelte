<script lang="ts">
  import { goto } from '$app/navigation';

  function start() {
    goto('/certificate/1');
  }
</script>

<section class="space-y-4">
  <h2 class="text-xl font-semibold">Issue a new certificate</h2>
  <p>An eight-step wizard captures the vaccinee identity, the supervising clinician,
     each vaccination entry, and the centre's uniform stamp. The summary panel computes
     per-entry validity and prints the certificate.</p>
  <button class="bg-yellow-700 text-white px-4 py-2 rounded" on:click={start}>Start wizard</button>
</section>
