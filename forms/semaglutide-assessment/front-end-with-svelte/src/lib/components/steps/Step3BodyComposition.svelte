<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateBMI, bmiCategory } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const bc = assessment.data.bodyComposition;

	const computedBMI = $derived(calculateBMI(bc.heightCm, bc.weightKg));
	const computedCategory = $derived(computedBMI !== null ? bmiCategory(computedBMI) : '');
</script>

<Fieldset legend="Body Composition">
	<p class="hint">Anthropometric measurements for eligibility assessment.</p>

	<div class="field-grid">
		<Field label="Height (cm)" required inputId="heightCm">
			<NumberInput id="heightCm" label="Height" min={50} max={250} step={0.1} required bind:value={bc.heightCm} />
		</Field>
		<Field label="Weight (kg)" required inputId="weightKg">
			<NumberInput id="weightKg" label="Weight" min={20} max={300} step={0.1} required bind:value={bc.weightKg} />
		</Field>
	</div>

	{#if computedBMI !== null}
		<Alert type="info" heading="Calculated BMI">
			<p>{computedBMI.toFixed(1)} ({computedCategory})</p>
		</Alert>
	{/if}

	<Field label="Waist Circumference (cm)" inputId="waistCircumference">
		<NumberInput id="waistCircumference" label="Waist" min={40} max={200} step={0.1} bind:value={bc.waistCircumference} />
	</Field>
	<Field label="Body Fat Percentage (%)" inputId="bodyFatPercent">
		<NumberInput id="bodyFatPercent" label="Body fat" min={3} max={60} step={0.1} bind:value={bc.bodyFatPercent} />
	</Field>
	<Field label="Previous Maximum Weight (kg)" inputId="previousMaxWeight">
		<NumberInput id="previousMaxWeight" label="Previous max weight" min={20} max={400} step={0.1} bind:value={bc.previousMaxWeight} />
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
