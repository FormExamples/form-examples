<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import LikertGroup from '$lib/components/ui/LikertGroup.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const d = assessment.data.selfCareLifestyle;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const adherenceOptions = [
		{ value: 1, label: 'Very Poor' },
		{ value: 2, label: 'Poor' },
		{ value: 3, label: 'Fair' },
		{ value: 4, label: 'Good' },
		{ value: 5, label: 'Excellent' }
	];
</script>

<Fieldset legend="Self-Care & Lifestyle">
	<p class="hint">Assess diet, exercise, and self-management behaviours.</p>

	<Field label="Diet Adherence (following recommended dietary plan)">
		<LikertGroup label="Diet Adherence" name="dietAdherence" options={adherenceOptions} bind:value={d.dietAdherence} />
	</Field>

	<div class="field-grid">
		<Field label="Carbohydrate Counting">
			<RadioGroup label="Carbohydrate Counting">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="carbCounting" value={opt.value} bind:group={d.carbCounting} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Physical Activity Level" inputId="physicalActivity">
			<Select id="physicalActivity" label="Physical Activity Level" bind:value={d.physicalActivity}>
				<option value="">-- Select --</option>
				<option value="sedentary">Sedentary</option>
				<option value="minimal">Minimal (light activity)</option>
				<option value="moderate">Moderate (some regular exercise)</option>
				<option value="regular">Regular (150+ min/week)</option>
				<option value="veryActive">Very Active</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="BMI (kg/m²)" inputId="bmi">
			<NumberInput id="bmi" label="BMI" step={0.1} min={10} max={80} placeholder="e.g. 28.5" bind:value={d.bmi} />
		</Field>
		<Field label="Recent Weight Change" inputId="weightChange">
			<Select id="weightChange" label="Recent Weight Change" bind:value={d.weightChange}>
				<option value="">-- Select --</option>
				<option value="stable">Stable</option>
				<option value="gained">Weight Gain</option>
				<option value="lost">Weight Loss</option>
				<option value="significantGain">Significant Gain (&gt;5kg)</option>
				<option value="significantLoss">Significant Loss (&gt;5kg)</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Alcohol Consumption" inputId="alcoholConsumption">
			<Select id="alcoholConsumption" label="Alcohol Consumption" bind:value={d.alcoholConsumption}>
				<option value="">-- Select --</option>
				<option value="none">None</option>
				<option value="withinLimits">Within Recommended Limits</option>
				<option value="aboveLimits">Above Recommended Limits</option>
				<option value="excessive">Excessive</option>
			</Select>
		</Field>
		<Field label="Smoking Cessation Support" inputId="smokingCessation">
			<Select id="smokingCessation" label="Smoking Cessation Support" bind:value={d.smokingCessation}>
				<option value="">-- Select --</option>
				<option value="notApplicable">Not Applicable (non-smoker)</option>
				<option value="offered">Offered</option>
				<option value="declined">Declined</option>
				<option value="ongoing">Ongoing Programme</option>
			</Select>
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
