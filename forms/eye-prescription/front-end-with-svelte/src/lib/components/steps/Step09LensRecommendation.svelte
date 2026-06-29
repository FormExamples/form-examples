<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  const input = 'input w-full';
  const cbLabel = 'flex items-center gap-2 text-sm text-base-content/80';
</script>

<StepCard step={9} title="Lens recommendation">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <FormField label="Lens type">
      <select class={input} bind:value={assessment.data.lensRecommendation.lensType}>
        <option value="">—</option>
        <option value="single-vision-distance">Single vision — distance</option>
        <option value="single-vision-near">Single vision — near</option>
        <option value="single-vision-intermediate">Single vision — intermediate</option>
        <option value="bifocal">Bifocal</option>
        <option value="trifocal">Trifocal</option>
        <option value="varifocal">Varifocal / progressive</option>
        <option value="occupational-varifocal">Occupational varifocal</option>
      </select>
    </FormField>
    <FormField label="Material">
      <select class={input} bind:value={assessment.data.lensRecommendation.material}>
        <option value="">—</option>
        <option value="cr-39">CR-39 (1.498)</option>
        <option value="trivex">Trivex (1.532)</option>
        <option value="polycarbonate">Polycarbonate (1.586)</option>
        <option value="mid-index-1.60">Mid-index (1.60)</option>
        <option value="high-index-1.67">High-index (1.67)</option>
        <option value="high-index-1.74">High-index (1.74)</option>
        <option value="glass">Glass</option>
      </select>
    </FormField>
    <FormField label="Refractive index">
      <input class={input} type="number" step="0.001" min="1" max="2" bind:value={assessment.data.lensRecommendation.refractiveIndex} />
    </FormField>
    <FormField label="Aspheric design">
      <label class={cbLabel}>
        <input type="checkbox" bind:checked={assessment.data.lensRecommendation.aspheric} />
        Aspheric
      </label>
    </FormField>
  </div>
  <h3 class="text-sm font-semibold text-base-content/70 mt-4 mb-2">Coatings</h3>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
    <label class={cbLabel}><input type="checkbox" bind:checked={assessment.data.lensRecommendation.coatingAntiReflective} /> Anti-reflective</label>
    <label class={cbLabel}><input type="checkbox" bind:checked={assessment.data.lensRecommendation.coatingScratchResistant} /> Scratch-resistant</label>
    <label class={cbLabel}><input type="checkbox" bind:checked={assessment.data.lensRecommendation.coatingHydrophobic} /> Hydrophobic</label>
    <label class={cbLabel}><input type="checkbox" bind:checked={assessment.data.lensRecommendation.coatingBlueLight} /> Blue-light</label>
    <label class={cbLabel}><input type="checkbox" bind:checked={assessment.data.lensRecommendation.coatingPhotochromic} /> Photochromic</label>
    <label class={cbLabel}><input type="checkbox" bind:checked={assessment.data.lensRecommendation.coatingPolarised} /> Polarised</label>
    <label class={cbLabel}><input type="checkbox" bind:checked={assessment.data.lensRecommendation.coatingUv400} /> UV-400</label>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <FormField label="Tint description"><input class={input} type="text" placeholder="brown / grey / G15" bind:value={assessment.data.lensRecommendation.tintDescription} /></FormField>
    <FormField label="Tint density (%)"><input class={input} type="number" step="5" min="0" max="100" bind:value={assessment.data.lensRecommendation.tintPercent} /></FormField>
  </div>
  <FormField label="Dispenser notes">
    <textarea class={input} rows="2" bind:value={assessment.data.lensRecommendation.dispenserNotes}></textarea>
  </FormField>
</StepCard>
