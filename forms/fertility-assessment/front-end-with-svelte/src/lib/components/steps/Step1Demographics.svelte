<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.demographics;

	const sexOptions = [
		{ value: 'female', label: 'Female' },
		{ value: 'male', label: 'Male' },
		{ value: 'other', label: 'Other / prefer not to say' }
	];
</script>

<Fieldset legend="Demographics">
	<p class="hint">Patient and (where applicable) partner details.</p>

	<h3 class="subsection-title">Patient</h3>

	<div class="field-grid">
		<Field label="First Name" required inputId="demographics-patientFirstName">
			<TextInput id="demographics-patientFirstName" label="First Name" required bind:value={d.patientFirstName} />
		</Field>
		<Field label="Last Name" required inputId="demographics-patientLastName">
			<TextInput id="demographics-patientLastName" label="Last Name" required bind:value={d.patientLastName} />
		</Field>
	</div>

	<Field label="Date of Birth" required inputId="demographics-patientDateOfBirth">
		<DateInput id="demographics-patientDateOfBirth" label="Date of Birth" required bind:value={d.patientDateOfBirth} />
	</Field>

	<Field label="Sex assigned at birth">
		<RadioGroup label="Sex assigned at birth">
			{#each sexOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="patientSex" value={opt.value} bind:group={d.patientSex} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Ethnicity (optional)" inputId="demographics-ethnicity">
		<TextInput id="demographics-ethnicity" label="Ethnicity" bind:value={d.ethnicity} />
	</Field>

	<h3 class="subsection-title">Partner (if applicable)</h3>

	<div class="field-grid">
		<Field label="Partner First Name" inputId="demographics-partnerFirstName">
			<TextInput id="demographics-partnerFirstName" label="Partner First Name" bind:value={d.partnerFirstName} />
		</Field>
		<Field label="Partner Last Name" inputId="demographics-partnerLastName">
			<TextInput id="demographics-partnerLastName" label="Partner Last Name" bind:value={d.partnerLastName} />
		</Field>
	</div>

	<Field label="Partner Date of Birth" inputId="demographics-partnerDateOfBirth">
		<DateInput id="demographics-partnerDateOfBirth" label="Partner Date of Birth" bind:value={d.partnerDateOfBirth} />
	</Field>

	<Field label="Partner Sex assigned at birth">
		<RadioGroup label="Partner Sex assigned at birth">
			{#each sexOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="partnerSex" value={opt.value} bind:group={d.partnerSex} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Relationship duration (years)" inputId="demographics-relationshipDuration">
		<NumberInput id="demographics-relationshipDuration" label="Relationship duration" min={0} max={70} bind:value={d.relationshipDuration} />
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
	.subsection-title {
		margin: 1.25rem 0 0.25rem;
		font-weight: 600;
	}
</style>
