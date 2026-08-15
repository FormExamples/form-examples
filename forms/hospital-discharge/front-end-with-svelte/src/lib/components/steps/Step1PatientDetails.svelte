<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.patientDetails;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Patient Details">
	<p class="hint">Patient identification and registered contacts.</p>

	<div class="field-grid">
		<Field label="First Name" required inputId="firstName">
			<TextInput id="firstName" label="First Name" required bind:value={d.firstName} />
		</Field>
		<Field label="Last Name" required inputId="lastName">
			<TextInput id="lastName" label="Last Name" required bind:value={d.lastName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of Birth" required inputId="dob">
			<DateInput id="dob" label="Date of Birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Sex">
			<RadioGroup label="Sex">
				{#each sexOptions as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name="sex" value={opt.value} bind:group={d.sex} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="NHS Number" required inputId="nhsNumber">
			<TextInput id="nhsNumber" label="NHS Number" required bind:value={d.nhsNumber} placeholder="000 000 0000" />
		</Field>
		<Field label="Hospital Number" inputId="hospitalNumber">
			<TextInput id="hospitalNumber" label="Hospital Number" bind:value={d.hospitalNumber} />
		</Field>
	</div>

	<Field label="Address" inputId="address">
		<TextAreaInput id="address" label="Address" rows={2} bind:value={d.address} placeholder="Street, town, county" />
	</Field>

	<div class="field-grid">
		<Field label="Postcode" inputId="postcode">
			<TextInput id="postcode" label="Postcode" bind:value={d.postcode} />
		</Field>
		<Field label="Phone" inputId="phone">
			<TextInput id="phone" label="Phone" type="tel" bind:value={d.phone} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="GP Name" required inputId="gpName">
			<TextInput id="gpName" label="GP Name" required bind:value={d.gpName} />
		</Field>
		<Field label="GP Practice" required inputId="gpPractice">
			<TextInput id="gpPractice" label="GP Practice" required bind:value={d.gpPractice} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Next of Kin Name" inputId="nextOfKinName">
			<TextInput id="nextOfKinName" label="Next of Kin Name" bind:value={d.nextOfKinName} />
		</Field>
		<Field label="Next of Kin Phone" inputId="nextOfKinPhone">
			<TextInput id="nextOfKinPhone" label="Next of Kin Phone" type="tel" bind:value={d.nextOfKinPhone} />
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
