<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.patientDemographics;

	const sexOptions = [
		{ value: 'male', label: 'Male' },
		{ value: 'female', label: 'Female' },
		{ value: 'other', label: 'Other' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Patient Demographics">
	<p class="hint">Identifying details for the patient. Required for cross-border patient matching.</p>

	<div class="field-grid">
		<Field label="Given name(s)" required inputId="givenName">
			<TextInput id="givenName" label="Given name(s)" required bind:value={d.givenName} />
		</Field>
		<Field label="Family name" required inputId="familyName">
			<TextInput id="familyName" label="Family name" required bind:value={d.familyName} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Date of birth" required inputId="dateOfBirth">
			<DateInput id="dateOfBirth" label="Date of birth" required bind:value={d.dateOfBirth} />
		</Field>
		<Field label="Sex" inputId="sex">
			<Select id="sex" label="Sex" bind:value={d.sex}>
				<option value="">— Select —</option>
				{#each sexOptions as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</Select>
		</Field>
	</div>

	<Field label="National identifier (e.g. NHS number, EHIC, NIE)" inputId="nationalIdentifier">
		<TextInput id="nationalIdentifier" label="National identifier" placeholder="Country-specific patient ID" bind:value={d.nationalIdentifier} />
	</Field>

	<Field label="Address line" inputId="addressLine">
		<TextInput id="addressLine" label="Address line" bind:value={d.addressLine} />
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="City" inputId="city">
			<TextInput id="city" label="City" bind:value={d.city} />
		</Field>
		<Field label="Postal code" inputId="postalCode">
			<TextInput id="postalCode" label="Postal code" bind:value={d.postalCode} />
		</Field>
		<Field label="Country (ISO 3166)" inputId="country">
			<TextInput id="country" label="Country" placeholder="e.g. GB, IE, DE" bind:value={d.country} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Preferred language (BCP-47)" inputId="preferredLanguage">
			<TextInput id="preferredLanguage" label="Preferred language" placeholder="e.g. en-GB, cy, fr-FR" bind:value={d.preferredLanguage} />
		</Field>
		<Field label="Contact phone" inputId="contactPhone">
			<TextInput id="contactPhone" label="Contact phone" type="tel" bind:value={d.contactPhone} />
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
