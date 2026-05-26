<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { percentileCategory } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const g = assessment.data.growthNutrition;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const feedingOptions = [
		{ value: 'breast', label: 'Breastfed' },
		{ value: 'formula', label: 'Formula Fed' },
		{ value: 'mixed', label: 'Mixed Feeding' },
		{ value: 'solid', label: 'Solid Foods' }
	];
</script>

<Fieldset legend="Growth & Nutrition">
	<p class="hint">Growth percentiles and feeding information.</p>

	<div class="field-grid field-grid-3">
		<Field label="Weight Percentile" inputId="weightPct" description={g.weightPercentile !== null ? percentileCategory(g.weightPercentile) : undefined}>
			<NumberInput id="weightPct" label="Weight percentile" min={0} max={100} step={1} bind:value={g.weightPercentile} />
		</Field>
		<Field label="Height Percentile" inputId="heightPct" description={g.heightPercentile !== null ? percentileCategory(g.heightPercentile) : undefined}>
			<NumberInput id="heightPct" label="Height percentile" min={0} max={100} step={1} bind:value={g.heightPercentile} />
		</Field>
		<Field label="Head Circ. Percentile" inputId="headPct" description={g.headCircumferencePercentile !== null ? percentileCategory(g.headCircumferencePercentile) : undefined}>
			<NumberInput id="headPct" label="Head circumference percentile" min={0} max={100} step={1} bind:value={g.headCircumferencePercentile} />
		</Field>
	</div>

	<Field label="Feeding Type" inputId="feedingType">
		<Select id="feedingType" label="Feeding type" bind:value={g.feedingType}>
			<option value="">-- Select --</option>
			{#each feedingOptions as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Are there any dietary concerns?">
		<RadioGroup label="Dietary concerns">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="dietConcerns" value={opt.value} bind:group={g.dietaryConcerns} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if g.dietaryConcerns === 'yes'}
		<Field label="Please describe dietary concerns" inputId="dietConcernDetails">
			<TextAreaInput id="dietConcernDetails" label="Dietary concerns" rows={3} bind:value={g.dietaryConcernDetails} />
		</Field>
	{/if}

	<Field label="Has failure to thrive been identified?">
		<RadioGroup label="Failure to thrive">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="ftt" value={opt.value} bind:group={g.failureToThrive} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
	@media (max-width: 640px) {
		.field-grid, .field-grid.field-grid-3 { grid-template-columns: 1fr; }
	}
</style>
