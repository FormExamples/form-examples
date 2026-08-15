<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import StepCard from '#lib/components/ui/StepCard.svelte';
  import FormField from '#lib/components/ui/FormField.svelte';
  import { fmtDioptres } from '#lib/engine/utils.js';
  const input = 'input w-full';
  const cbLabel = 'flex items-center gap-2 text-sm text-base-content/80';

  const r = $derived(assessment.result);
  const effective = $derived(assessment.data.grade.overrideComplexity || r.complexity);

  function classLabel(c: string): string {
    if (!c || c === 'none') return '—';
    return c.replace(/-/g, ' ');
  }
  function priorityClass(p: string): string {
    if (p === 'high') return 'bg-error text-error-content border-error';
    if (p === 'medium') return 'bg-warning text-warning-content border-warning';
    return 'bg-success text-success-content border-success';
  }
  function complexityClass(c: string): string {
    if (c === 'complex') return 'bg-error text-error-content';
    if (c === 'moderate') return 'bg-warning text-warning-content';
    return 'bg-success text-success-content';
  }
</script>

<StepCard step={11} title="Summary & sign-off" description="Live classification — recomputed as you fill the form above.">
  <div class="rounded border border-primary bg-primary/10 p-4 mb-4 text-sm space-y-1">
    <h3 class="font-semibold text-primary mb-1">Live classification</h3>
    <div><strong>Right eye:</strong>
      <span class="inline-block px-2 py-0.5 mr-1 rounded-full bg-base-100 border border-primary text-xs">{classLabel(r.rightEyeSphereClass)}</span>
      <span class="inline-block px-2 py-0.5 rounded-full bg-base-100 border border-primary text-xs">{classLabel(r.rightEyeCylinderClass)}</span>
    </div>
    <div><strong>Left eye:</strong>
      <span class="inline-block px-2 py-0.5 mr-1 rounded-full bg-base-100 border border-primary text-xs">{classLabel(r.leftEyeSphereClass)}</span>
      <span class="inline-block px-2 py-0.5 rounded-full bg-base-100 border border-primary text-xs">{classLabel(r.leftEyeCylinderClass)}</span>
    </div>
    <div>
      <strong>Presbyopia:</strong> <span class="inline-block px-2 py-0.5 rounded-full bg-base-100 border border-primary text-xs">{classLabel(r.presbyopiaClass)}</span>
      <strong class="ml-3">Anisometropia:</strong> {r.anisometropia === null ? '—' : fmtDioptres(r.anisometropia)} D
      <strong class="ml-3">Prism:</strong> {r.prismPresent ? 'present' : 'none'}
    </div>
    <div>
      <strong>Complexity:</strong>
      <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold {complexityClass(effective)}">{effective}</span>
      {#if assessment.data.grade.overrideComplexity}
        <span class="inline-block px-2 py-0.5 rounded-full bg-base-100 border border-primary text-xs ml-1">overridden from {r.complexity}</span>
      {/if}
    </div>
    <div>
      <strong>Flags ({r.additionalFlags.length}):</strong>
      {#if r.additionalFlags.length === 0}
        <span class="inline-block px-2 py-0.5 rounded-full bg-base-100 border border-primary text-xs">none</span>
      {:else}
        {#each r.additionalFlags as f (f.flagId)}
          <span class="inline-block px-2 py-0.5 mr-1 rounded-full text-xs border {priorityClass(f.priority)}">{f.category}</span>
        {/each}
      {/if}
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <FormField label="Follow-up interval (months)">
      <input class={input} type="number" step="1" min="1" max="60" bind:value={assessment.data.grade.followUpIntervalMonths} />
    </FormField>
    <FormField label="Complexity override">
      <select class={input} bind:value={assessment.data.grade.overrideComplexity}>
        <option value="">Use computed</option>
        <option value="simple">Simple</option>
        <option value="moderate">Moderate</option>
        <option value="complex">Complex</option>
      </select>
    </FormField>
  </div>
  <FormField label="Override reason">
    <textarea class={input} rows="2" bind:value={assessment.data.grade.overrideReason}></textarea>
  </FormField>
  <FormField label="Prescriber notes">
    <textarea class={input} rows="3" bind:value={assessment.data.grade.prescriberNotes}></textarea>
  </FormField>
  <label class={cbLabel}>
    <input type="checkbox" bind:checked={assessment.data.grade.signedAt} />
    I sign this prescription electronically
  </label>

  {#if r.additionalFlags.length > 0}
    <h3 class="text-sm font-semibold text-base-content/70 mt-4 mb-2">Safety flags</h3>
    <ul class="space-y-2">
      {#each r.additionalFlags as f (f.flagId)}
        <li class="border-l-4 pl-3 py-2 rounded {priorityClass(f.priority)}">
          <div class="text-xs uppercase tracking-wide font-semibold opacity-70">{f.category} · {f.priority} · {f.eye}</div>
          <div class="text-sm">{f.description}</div>
          <div class="text-xs italic opacity-80 mt-1">{f.suggestedAction}</div>
        </li>
      {/each}
    </ul>
  {/if}
</StepCard>
