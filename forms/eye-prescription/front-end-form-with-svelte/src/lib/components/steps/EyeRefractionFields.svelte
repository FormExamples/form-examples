<script lang="ts">
  import type { EyeRefraction } from '$lib/engine/types.js';
  import FormField from '$lib/components/ui/FormField.svelte';
  let { eye = $bindable() }: { eye: EyeRefraction } = $props();
  const input = 'block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';
</script>

<div class="grid grid-cols-1 md:grid-cols-4 gap-x-4">
  <FormField label="Sphere (D)" hint="-30.00 to +30.00, 0.25 steps">
    <input class={input} type="number" step="0.25" min="-30" max="30" bind:value={eye.sphereDiopters} />
  </FormField>
  <FormField label="Cylinder (D)" hint="-10.00 to 0.00 (minus convention)">
    <input class={input} type="number" step="0.25" min="-10" max="0" bind:value={eye.cylinderDiopters} />
  </FormField>
  <FormField label="Axis (°)" hint="1–180 (integer)">
    <input class={input} type="number" step="1" min="1" max="180" bind:value={eye.axisDegrees} />
  </FormField>
  <div></div>
</div>
<h3 class="text-sm font-semibold text-slate-600 mt-2 mb-2">Prism (optional)</h3>
<div class="grid grid-cols-1 md:grid-cols-4 gap-x-4">
  <FormField label="Horizontal Δ">
    <input class={input} type="number" step="0.25" min="0" max="20" bind:value={eye.prismHorizontalDiopters} />
  </FormField>
  <FormField label="Base">
    <select class={input} bind:value={eye.baseHorizontal}>
      <option value="">—</option><option value="in">In</option><option value="out">Out</option>
    </select>
  </FormField>
  <FormField label="Vertical Δ">
    <input class={input} type="number" step="0.25" min="0" max="20" bind:value={eye.prismVerticalDiopters} />
  </FormField>
  <FormField label="Base">
    <select class={input} bind:value={eye.baseVertical}>
      <option value="">—</option><option value="up">Up</option><option value="down">Down</option>
    </select>
  </FormField>
</div>
