<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.patientDemographics;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Patient Demographics">
	<p class="hint">Confirm the patient identity at handover. NHS number is preferred where available.</p>

	<div class="field-grid">
		<Field label="First name" required inputId="firstName">
			<TextInput id="firstName" label="First name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last name" required inputId="lastName">
			<TextInput id="lastName" label="Last name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" required inputId="dateOfBirth">
			<DateInput id="dateOfBirth" label="Date of birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Sex" required>
			<RadioGroup label="Sex">
				{#each sexOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name="sex"
							value={opt.value}
							bind:group={d.sex}
							required
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="NHS number" inputId="nhsNumber">
			<TextInput
				id="nhsNumber"
				label="NHS number"
				placeholder="10 digits, e.g. 123 456 7890"
				bind:value={d.nhsNumber}
			/>
		</Field>
		<Field label="Hospital / local number" inputId="hospitalNumber">
			<TextInput id="hospitalNumber" label="Hospital / local number" bind:value={d.hospitalNumber} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Address line" inputId="addressLine">
			<TextInput id="addressLine" label="Address line" bind:value={d.addressLine} />
		</Field>
		<Field label="Postcode" inputId="postcode">
			<TextInput id="postcode" label="Postcode" bind:value={d.postcode} />
		</Field>
	</div>

	<h3 class="subsection-heading">Next of kin</h3>

	<div class="field-grid">
		<Field label="Next of kin name" inputId="nextOfKinName">
			<TextInput id="nextOfKinName" label="Next of kin name" bind:value={d.nextOfKinName} />
		</Field>
		<Field label="Next of kin phone" inputId="nextOfKinPhone">
			<TextInput id="nextOfKinPhone" label="Next of kin phone" bind:value={d.nextOfKinPhone} />
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
	.subsection-heading {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
</style>
