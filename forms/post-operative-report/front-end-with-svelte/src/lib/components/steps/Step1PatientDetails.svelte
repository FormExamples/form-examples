<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.patientDetails;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
	const asaOptions = [
		{ value: 'I', label: 'I — Normal healthy patient' },
		{ value: 'II', label: 'II — Mild systemic disease' },
		{ value: 'III', label: 'III — Severe systemic disease' },
		{ value: 'IV', label: 'IV — Severe systemic disease, constant threat to life' },
		{ value: 'V', label: 'V — Moribund, not expected to survive without operation' },
		{ value: 'VI', label: 'VI — Brain-dead, organs being removed for donation' },
		{ value: 'E', label: 'E — Emergency suffix' }
	];
</script>

<Fieldset legend="Patient Details">
	<p class="hint">Identifying patient information and baseline status.</p>

	<div class="field-grid">
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" required inputId="dob">
			<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Medical record number (MRN)" inputId="mrn">
			<TextInput id="mrn" label="MRN" bind:value={d.mrn} />
		</Field>
	</div>

	<Field label="Sex">
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Weight (kg)" inputId="weight">
			<NumberInput id="weight" label="Weight" min={0} max={400} bind:value={d.weight} />
		</Field>
		<Field label="Height (cm)" inputId="height">
			<NumberInput id="height" label="Height" min={0} max={250} bind:value={d.height} />
		</Field>
	</div>

	<Field label="ASA physical status classification" inputId="asaGrade">
		<Select label="ASA physical status classification" bind:value={d.asaGrade}>
			<option value="">— Select —</option>
			{#each asaOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Allergies / adverse reactions" inputId="allergies">
		<TextAreaInput
			id="allergies"
			label="Allergies / adverse reactions"
			rows={2}
			placeholder={'List drug, food, latex, or other allergies. Use "NKDA" if none known.'}
			bind:value={d.allergies}
		/>
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
