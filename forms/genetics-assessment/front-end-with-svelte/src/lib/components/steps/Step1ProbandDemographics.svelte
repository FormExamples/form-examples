<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.probandDemographics;

	const sexOptions = [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'other', label: 'Other / unknown' }
	];
</script>

<Fieldset legend="Proband Demographics">
	<p class="hint">Basic identifying information for the patient (proband).</p>

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
		<Field label="Sex">
			<RadioGroup label="Sex">
				{#each sexOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Medical record number (MRN)" inputId="mrn">
			<TextInput id="mrn" label="Medical record number" bind:value={d.mrn} />
		</Field>
		<Field label="Preferred contact" inputId="preferredContact">
			<TextInput id="preferredContact" label="Preferred contact" placeholder="Phone, email, etc." bind:value={d.preferredContact} />
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
