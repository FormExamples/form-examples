<script lang="ts">
  import { certificateStore } from '$lib/stores/certificate.svelte';
  import { validateCertificate } from '$lib/engine/validation-rules';
  import { severityColor } from '$lib/engine/utils';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  const c = $derived(certificateStore.data);
  const report = $derived(validateCertificate(c));
</script>

<Fieldset legend="Summary & sign-off" description="Live validation preview; the full report is generated on submit.">
  <div class="rounded-lg border border-base-300 bg-base-100 p-4">
    <h3 class="font-semibold text-base-content">Validation preview</h3>
    {#if report.firedRules.length === 0}
      <p class="mt-2 text-success">All checks passed. Certificate is valid.</p>
    {:else}
      <ul class="mt-2 space-y-1 text-sm">
        {#each report.firedRules as r (r.code)}
          <li class="flex items-start gap-2">
            <span class="rounded px-1.5 py-0.5 text-xs font-bold uppercase {severityColor(r.severity)}">
              {r.severity}
            </span>
            <span class="text-base-content/80">[{r.code}] {r.message}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <div class="field">
    <label class="label" for="medicalWaiver">Medical waiver?</label>
    <select id="medicalWaiver" class="select" bind:value={c.medicalWaiver}>
      <option value="">No</option><option value="yes">Yes</option>
    </select>
  </div>
  <div class="field">
    <label class="label" for="waiverReason">Medical waiver reason</label>
    <textarea id="waiverReason" class="text-area-input" rows="3" bind:value={c.medicalWaiverReason}></textarea>
  </div>
  <div class="field">
    <label class="label" for="electronicSignature">Electronic signature (typed)</label>
    <input id="electronicSignature" class="text-input" bind:value={c.electronicSignatureDataUrl} />
  </div>

  <details class="rounded-lg border border-base-300 p-3">
    <summary class="cursor-pointer text-base-content">Per-entry computed validity</summary>
    <ul class="mt-2 list-disc pl-5 text-sm text-base-content/80">
      {#each report.perEntryValidity as v (v.entryIndex)}
        <li>Entry {v.entryIndex}: valid from {v.validFrom || '—'} to {v.validUntil}</li>
      {/each}
    </ul>
  </details>
</Fieldset>
