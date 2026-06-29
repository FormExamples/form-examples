<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateBMI, bmiCategory } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const l = assessment.data.lifestyleFactors;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	$effect(() => {
		assessment.data.lifestyleFactors.bmi = calculateBMI(l.weight, l.height);
	});

	const tobaccoOptions = [
		{ value: 'never', label: 'Never smoked' },
		{ value: 'former', label: 'Former smoker' },
		{ value: 'current', label: 'Current smoker' }
	];
	const alcoholOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'low', label: 'Low (≤ 4 units/week)' },
		{ value: 'moderate', label: 'Moderate (5-14 units/week)' },
		{ value: 'heavy', label: 'Heavy (> 14 units/week)' }
	];
	const caffeineOptions = [
		{ value: 'low', label: 'Low (≤ 200 mg/day)' },
		{ value: 'moderate', label: 'Moderate (201-400 mg/day)' },
		{ value: 'high', label: 'High (> 400 mg/day)' }
	];
</script>

<Fieldset legend="Lifestyle Factors">
	<p class="hint">BMI, smoking, alcohol, caffeine, and occupational hazards.</p>

	<div class="field-grid field-grid-3">
		<Field label="Weight (kg)" inputId="lifestyleFactors-weight">
			<NumberInput id="lifestyleFactors-weight" label="Weight" min={1} max={300} bind:value={l.weight} />
		</Field>
		<Field label="Height (cm)" inputId="lifestyleFactors-height">
			<NumberInput id="lifestyleFactors-height" label="Height" min={50} max={250} bind:value={l.height} />
		</Field>
		<Field label="BMI" description="Auto-calculated">
			{#if l.bmi}
				<p class="bmi-value">{l.bmi} <span class="bmi-cat">({bmiCategory(l.bmi)})</span></p>
			{:else}
				<p class="bmi-value bmi-empty">—</p>
			{/if}
		</Field>
	</div>

	<Field label="Tobacco / smoking status">
		<RadioGroup label="Tobacco / smoking status">
			{#each tobaccoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tobaccoStatus" value={opt.value} bind:group={l.tobaccoStatus} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if l.tobaccoStatus === 'current'}
		<Field label="Cigarettes per day" inputId="lifestyleFactors-cigarettesPerDay">
			<NumberInput id="lifestyleFactors-cigarettesPerDay" label="Cigarettes per day" min={0} max={100} bind:value={l.cigarettesPerDay} />
		</Field>
	{/if}

	<Field label="Alcohol intake">
		<RadioGroup label="Alcohol intake">
			{#each alcoholOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="alcoholLevel" value={opt.value} bind:group={l.alcoholLevel} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Alcohol units per week (UK units)" inputId="lifestyleFactors-alcoholUnitsPerWeek">
		<NumberInput id="lifestyleFactors-alcoholUnitsPerWeek" label="Alcohol units per week" min={0} max={100} bind:value={l.alcoholUnitsPerWeek} />
	</Field>

	<Field label="Caffeine intake">
		<RadioGroup label="Caffeine intake">
			{#each caffeineOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="caffeineLevel" value={opt.value} bind:group={l.caffeineLevel} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Recreational drug use?">
		<RadioGroup label="Recreational drug use?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recreationalDrugs" value={opt.value} bind:group={l.recreationalDrugs} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if l.recreationalDrugs === 'yes'}
		<Field label="Recreational drug details" inputId="lifestyleFactors-recreationalDrugDetails">
			<TextInput id="lifestyleFactors-recreationalDrugDetails" label="Recreational drug details" bind:value={l.recreationalDrugDetails} />
		</Field>
	{/if}

	<Field label="Exercise frequency" inputId="lifestyleFactors-exerciseFrequency">
		<Select id="lifestyleFactors-exerciseFrequency" label="Exercise frequency" bind:value={l.exerciseFrequency}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="low">Low (1-2 sessions/week)</option>
			<option value="moderate">Moderate (3-4 sessions/week)</option>
			<option value="high">High (5+ sessions/week)</option>
		</Select>
	</Field>

	<Field label="Occupational hazards (heat, chemicals, radiation)?">
		<RadioGroup label="Occupational hazards (heat, chemicals, radiation)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="occupationalHazards" value={opt.value} bind:group={l.occupationalHazards} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if l.occupationalHazards === 'yes'}
		<Field label="Occupational hazard details" inputId="lifestyleFactors-occupationalHazardDetails">
			<TextInput id="lifestyleFactors-occupationalHazardDetails" label="Occupational hazard details" bind:value={l.occupationalHazardDetails} />
		</Field>
	{/if}
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
	.bmi-value {
		margin: 0;
		font-weight: 500;
	}
	.bmi-cat {
		color: var(--color-muted);
		font-weight: 400;
	}
	.bmi-empty {
		color: var(--color-muted);
	}
</style>
