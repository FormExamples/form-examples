<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  import type { ValidationReport } from '$lib/engine/types';
  let { report }: { report: ValidationReport } = $props();
  const c = $derived(certificateStore.data);
</script>

<div class="space-y-3">
  <h3 class="font-semibold">Validation report</h3>
  {#if report.firedRules.length === 0}
    <p class="text-green-700">All checks passed. Certificate is valid.</p>
  {:else}
    <ul class="list-disc pl-5 text-sm">
      {#each report.firedRules as r}
        <li class:text-red-700={r.severity === 'error'} class:text-orange-600={r.severity === 'warning'}>
          [{r.code}] {r.message}
        </li>
      {/each}
    </ul>
  {/if}

  <label class="block">Medical waiver?
    <select class="border rounded w-full p-2" bind:value={c.medicalWaiver}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </label>
  <label class="block">Medical waiver reason
    <textarea class="border rounded w-full p-2" rows="3" bind:value={c.medicalWaiverReason}></textarea>
  </label>
  <label class="block">Electronic signature (typed)
    <input class="border rounded w-full p-2" bind:value={c.electronicSignatureDataUrl} />
  </label>

  <details class="border rounded p-3">
    <summary class="cursor-pointer">Per-entry computed validity</summary>
    <ul class="list-disc pl-5 text-sm mt-2">
      {#each report.perEntryValidity as v}
        <li>Entry {v.entryIndex}: valid from {v.validFrom || '—'} to {v.validUntil}</li>
      {/each}
    </ul>
  </details>

  <button class="bg-yellow-700 text-white px-4 py-2 rounded" on:click={() => window.print()}>
    Print certificate
  </button>
</div>
