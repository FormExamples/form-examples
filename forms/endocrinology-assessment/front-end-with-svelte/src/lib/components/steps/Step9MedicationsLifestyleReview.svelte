<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const m = assessment.data.medicationsLifestyle;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Medications & Lifestyle Review">
	<p class="hint">Current medications, steroid / hormone therapy, and lifestyle factors.</p>

	<Field label="Current medications">
		<MedicationEntry bind:medications={m.currentMedications} />
	</Field>

	<Field label="Current systemic steroid use">
		<RadioGroup label="Current systemic steroid use">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="steroidUse" value={opt.value} bind:group={m.steroidUse} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if m.steroidUse === 'yes'}
		<Field label="Steroid details" inputId="steroidDetails">
			<TextInput id="steroidDetails" label="Steroid details" placeholder="e.g. Prednisolone 10 mg OD" bind:value={m.steroidDetails} />
		</Field>
	{/if}

	<Field label="Hormone therapy">
		<RadioGroup label="Hormone therapy">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="hormoneTherapy" value={opt.value} bind:group={m.hormoneTherapy} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if m.hormoneTherapy === 'yes'}
		<Field label="Hormone therapy details" inputId="hormoneTherapyDetails">
			<TextInput id="hormoneTherapyDetails" label="Hormone therapy details" bind:value={m.hormoneTherapyDetails} />
		</Field>
	{/if}

	<Field label="Smoking status" inputId="smoking">
		<Select id="smoking" label="Smoking status" bind:value={m.smoking}>
			<option value="">-- Select --</option>
			<option value="current">Current smoker</option>
			<option value="ex">Ex-smoker</option>
			<option value="never">Never smoked</option>
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="Alcohol (units/week)" inputId="alcoholUnits">
			<TextInput id="alcoholUnits" label="Alcohol units" placeholder="e.g. 10" bind:value={m.alcoholUnits} />
		</Field>
		<Field label="Exercise level" inputId="exerciseLevel">
			<Select id="exerciseLevel" label="Exercise level" bind:value={m.exerciseLevel}>
				<option value="">-- Select --</option>
				<option value="sedentary">Sedentary</option>
				<option value="light">Light</option>
				<option value="moderate">Moderate</option>
				<option value="vigorous">Vigorous</option>
			</Select>
		</Field>
	</div>

	<Field label="Diet pattern" inputId="dietPattern">
		<TextInput id="dietPattern" label="Diet pattern" placeholder="e.g. Mixed, vegetarian, low-carbohydrate" bind:value={m.dietPattern} />
	</Field>

	<Field label="Family history of endocrine disease" inputId="familyHistoryEndocrine">
		<TextAreaInput id="familyHistoryEndocrine" label="Family history of endocrine disease" rows={3} bind:value={m.familyHistoryEndocrine} />
	</Field>
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
