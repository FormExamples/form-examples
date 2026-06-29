<script lang="ts">
  import { formState } from '$stores/formState.svelte';
  const d = formState.data;
</script>

<section class="rounded-lg border border-base-300 bg-base-100 p-4" data-step="10">
  <h2 class="mb-3 text-xl font-semibold text-base-content">10. Score &amp; sign-off</h2>
  <div class="grid grid-cols-2 gap-3">
    <label class="block text-sm text-base-content/80">Progress percent (0–100)<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="number" min="0" max="100" bind:value={d.scores.progressPercent}/></label>
    <label class="block text-sm text-base-content/80">Confidence decile (1–10)<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="number" min="1" max="10" bind:value={d.scores.confidenceDecile}/></label>
    <label class="block text-sm text-base-content/80">Stretch tier
      <select class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.scores.stretchTier}>
        <option value={null}>—</option>
        <option value={1}>1 — committed</option>
        <option value={2}>2 — aspirational</option>
        <option value={3}>3 — moonshot</option>
      </select>
    </label>
    <label class="block text-sm text-base-content/80">Alignment grade (1–5)<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="number" min="1" max="5" bind:value={d.scores.alignmentGrade}/></label>
    <label class="block text-sm text-base-content/80">Impact tier (1–5)<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="number" min="1" max="5" bind:value={d.scores.impactTier}/></label>
    <label class="block text-sm text-base-content/80">SMART quality (0–5)<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="number" min="0" max="5" bind:value={d.scores.smartQuality}/></label>
    <label class="block text-sm text-base-content/80">Pace deviation % (-100..+100)<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" type="number" min="-100" max="100" bind:value={d.scores.paceDeviationPercent}/></label>
    <label class="block text-sm text-base-content/80">Signed by<input class="mt-1 w-full rounded border border-base-300 bg-base-100 p-2" bind:value={d.signature.signed_by}/></label>
  </div>
</section>
