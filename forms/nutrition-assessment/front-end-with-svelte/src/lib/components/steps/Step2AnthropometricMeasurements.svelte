<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import {
		calculateBMI,
		bmiCategory,
		calculateWeightLossPercent,
		suggestBmiCategory,
		suggestWeightLossCategory
	} from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const a = assessment.data.anthropometricMeasurements;
	const screen = assessment.data.nutritionalScreening;

	// Recompute derived values and auto-prefill MUST screening suggestions.
	$effect(() => {
		a.bmi = calculateBMI(a.weightKg, a.heightCm);
		a.weightLossPercent = calculateWeightLossPercent(a.weightLossKg, a.usualWeightKg);
		if (a.bmi !== null && screen.bmiCategory === '') {
			screen.bmiCategory = suggestBmiCategory(a.bmi);
		}
		if (a.weightLossPercent !== null && screen.weightLossCategory === '') {
			screen.weightLossCategory = suggestWeightLossCategory(a.weightLossPercent);
		}
	});
</script>

<Fieldset legend="Anthropometric Measurements">
	<p class="hint">
		Current weight, height, recent weight change, and other body-composition measures.
	</p>

	<div class="field-grid field-grid-3">
		<Field label="Current weight (kg)" inputId="weightKg">
			<NumberInput id="weightKg" label="Current weight" min={1} max={400} step={0.1} bind:value={a.weightKg} />
		</Field>
		<Field label="Height (cm)" inputId="heightCm">
			<NumberInput id="heightCm" label="Height" min={50} max={250} step={0.1} bind:value={a.heightCm} />
		</Field>
		<Field label="BMI" description="Auto-calculated">
			{#if a.bmi}
				<p class="readout-value">{a.bmi} <span class="readout-muted">({bmiCategory(a.bmi)})</span></p>
			{:else}
				<p class="readout-value readout-muted">—</p>
			{/if}
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="Usual stable weight (kg)" inputId="usualWeightKg">
			<NumberInput id="usualWeightKg" label="Usual stable weight" min={1} max={400} step={0.1} bind:value={a.usualWeightKg} />
		</Field>
		<Field label="Unplanned weight loss (kg, last 3-6 months)" inputId="weightLossKg">
			<NumberInput id="weightLossKg" label="Unplanned weight loss" min={0} max={200} step={0.1} bind:value={a.weightLossKg} />
		</Field>
		<Field label="Weight loss %" description="Auto-calculated">
			{#if a.weightLossPercent !== null}
				<p class="readout-value">{a.weightLossPercent}% <span class="readout-muted">of usual weight</span></p>
			{:else}
				<p class="readout-value readout-muted">—</p>
			{/if}
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Mid-upper arm circumference (cm)" inputId="midUpperArmCircumferenceCm">
			<NumberInput id="midUpperArmCircumferenceCm" label="Mid-upper arm circumference" min={0} max={100} step={0.1} bind:value={a.midUpperArmCircumferenceCm} />
		</Field>
		<Field label="Triceps skinfold (mm)" inputId="tricepsSkinfoldMm">
			<NumberInput id="tricepsSkinfoldMm" label="Triceps skinfold" min={0} max={100} step={0.1} bind:value={a.tricepsSkinfoldMm} />
		</Field>
	</div>

	<Field label="Date of measurements" inputId="measurementDate">
		<DateInput id="measurementDate" label="Date of measurements" bind:value={a.measurementDate} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
	.readout-value {
		margin: 0;
		font-weight: 500;
	}
	.readout-muted {
		color: var(--color-muted);
		font-weight: 400;
	}
</style>
