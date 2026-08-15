<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = $state(assessment.data.demographics);

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Patient Demographics">
	<p class="hint">Basic patient identification and contact details.</p>

	<div class="field-grid">
		<Field label="First name" inputId="firstName">
			<TextInput id="firstName" label="First name" bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" required inputId="dob">
			<DateInput id="dob" label="Date of birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="NHS number" inputId="nhsNumber">
			<TextInput id="nhsNumber" label="NHS number" bind:value={d.nhsNumber} />
		</Field>
	</div>

	<Field label="Sex" required>
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Address line 1" inputId="addressLine1">
		<TextInput id="addressLine1" label="Address line 1" bind:value={d.addressLine1} />
	</Field>
	<div class="field-grid field-grid-3">
		<Field label="Address line 2" inputId="addressLine2">
			<TextInput id="addressLine2" label="Address line 2" bind:value={d.addressLine2} />
		</Field>
		<Field label="City / Town" inputId="city">
			<TextInput id="city" label="City / Town" bind:value={d.city} />
		</Field>
		<Field label="Postcode" inputId="postcode">
			<TextInput id="postcode" label="Postcode" bind:value={d.postcode} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Phone" inputId="phone">
			<TextInput id="phone" label="Phone" bind:value={d.phone} />
		</Field>
		<Field label="Email" inputId="email">
			<TextInput id="email" label="Email" bind:value={d.email} />
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="Emergency contact name" inputId="emergencyName">
			<TextInput id="emergencyName" label="Emergency contact name" bind:value={d.emergencyName} />
		</Field>
		<Field label="Emergency contact phone" inputId="emergencyPhone">
			<TextInput id="emergencyPhone" label="Emergency contact phone" bind:value={d.emergencyPhone} />
		</Field>
		<Field label="Relationship" inputId="emergencyRelationship">
			<TextInput id="emergencyRelationship" label="Relationship" bind:value={d.emergencyRelationship} />
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="GP name" inputId="gpName">
			<TextInput id="gpName" label="GP name" bind:value={d.gpName} />
		</Field>
		<Field label="GP practice" inputId="gpPractice">
			<TextInput id="gpPractice" label="GP practice" bind:value={d.gpPractice} />
		</Field>
		<Field label="GP phone" inputId="gpPhone">
			<TextInput id="gpPhone" label="GP phone" bind:value={d.gpPhone} />
		</Field>
	</div>
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
</style>
