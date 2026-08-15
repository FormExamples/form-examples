<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.patientInformation;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Patient Information">
	<p class="hint">Personal details and emergency contact information.</p>

	<div class="field-grid">
		<Field label="First Name" required inputId="firstName">
			<TextInput id="firstName" label="First Name" required bind:value={p.firstName} />
		</Field>
		<Field label="Last Name" required inputId="lastName">
			<TextInput id="lastName" label="Last Name" required bind:value={p.lastName} />
		</Field>
	</div>

	<Field label="Date of Birth" required inputId="dob">
		<DateInput id="dob" label="Date of Birth" required bind:value={p.dob} />
	</Field>

	<Field label="Sex" required>
		<RadioGroup label="Sex">
			{#each sexOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={p.sex} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="NHS Number" required inputId="nhsNumber" description="Format: 000 000 0000">
		<TextInput id="nhsNumber" label="NHS Number" required bind:value={p.nhsNumber} />
	</Field>

	<Field label="Address" required inputId="address">
		<TextInput id="address" label="Address" required bind:value={p.address} />
	</Field>

	<Field label="Phone Number" required inputId="phone">
		<TextInput id="phone" label="Phone Number" required bind:value={p.phone} />
	</Field>

	<div class="field-grid">
		<Field label="Emergency Contact Name" required inputId="emergencyContact">
			<TextInput
				id="emergencyContact"
				label="Emergency Contact Name"
				required
				bind:value={p.emergencyContact}
			/>
		</Field>
		<Field label="Emergency Contact Phone" required inputId="emergencyContactPhone">
			<TextInput
				id="emergencyContactPhone"
				label="Emergency Contact Phone"
				required
				bind:value={p.emergencyContactPhone}
			/>
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
