<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import EmailInput from '#lib/components/ui/EmailInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const d = assessment.data.demographics;
</script>

<Fieldset legend="Employee Details" description="Identity and contact information for the new starter.">
	<div class="field-grid">
		<TextInput name="firstName" label="First name" required bind:value={d.firstName} />
		<TextInput name="lastName" label="Last name" required bind:value={d.lastName} />
	</div>

	<div class="field-grid">
		<div class="field">
			<label class="label" for="dateOfBirth">Date of birth</label>
			<DateInput label="Date of birth" bind:value={d.dateOfBirth} {...{ id: 'dateOfBirth' }} />
		</div>
		<div class="field">
			<label class="label" for="startDate" data-required>Start date</label>
			<DateInput label="Start date" required bind:value={d.startDate} {...{ id: 'startDate' }} />
		</div>
	</div>

	<div class="field-grid">
		<div class="field">
			<label class="label" for="email">Email</label>
			<EmailInput label="Email" bind:value={d.email} {...{ id: 'email' }} />
		</div>
		<TextInput name="phone" label="Phone" type="tel" bind:value={d.phone} />
	</div>

	<div class="field-grid">
		<TextInput name="jobTitle" label="Job title" required bind:value={d.jobTitle} />
		<TextInput name="department" label="Department" required bind:value={d.department} />
	</div>

	<h3 class="subhead">Emergency contact</h3>
	<div class="field-grid field-grid-3">
		<TextInput name="emergencyContactName" label="Name" bind:value={d.emergencyContactName} />
		<TextInput name="emergencyContactPhone" label="Phone" type="tel" bind:value={d.emergencyContactPhone} />
		<TextInput name="emergencyContactRelationship" label="Relationship" bind:value={d.emergencyContactRelationship} />
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
	.subhead {
		margin: 1.25rem 0 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
	}
</style>
