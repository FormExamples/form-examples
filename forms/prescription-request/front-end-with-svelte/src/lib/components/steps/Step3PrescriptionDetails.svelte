<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.prescriptionDetails;

	const routeOptions = [
		{ value: 'oral', label: 'Oral' },
		{ value: 'topical', label: 'Topical' },
		{ value: 'intravenous', label: 'Intravenous' },
		{ value: 'intramuscular', label: 'Intramuscular' },
		{ value: 'subcutaneous', label: 'Subcutaneous' },
		{ value: 'inhaled', label: 'Inhaled' },
		{ value: 'rectal', label: 'Rectal' },
		{ value: 'sublingual', label: 'Sublingual' },
		{ value: 'transdermal', label: 'Transdermal' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Prescription Details">
	<p class="hint">Medication and dosage information.</p>

	<Field label="Request Date" required inputId="requestDate">
		<DateInput id="requestDate" label="Request Date" required bind:value={d.requestDate} />
	</Field>

	<Field label="Medication Name" required inputId="medicationName">
		<TextInput id="medicationName" label="Medication Name" required placeholder="e.g. Amoxicillin" bind:value={d.medicationName} />
	</Field>

	<div class="field-grid">
		<Field label="Dosage" required inputId="dosage">
			<TextInput id="dosage" label="Dosage" required placeholder="e.g. 500mg" bind:value={d.dosage} />
		</Field>
		<Field label="Frequency" inputId="frequency">
			<TextInput id="frequency" label="Frequency" placeholder="e.g. TDS, BD, OD" bind:value={d.frequency} />
		</Field>
	</div>

	<Field label="Route of Administration" inputId="route">
		<Select id="route" label="Route of Administration" bind:value={d.routeOfAdministration}>
			<option value="">-- Select --</option>
			{#each routeOptions as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Treatment Instructions" inputId="treatmentInstructions">
		<TextAreaInput id="treatmentInstructions" label="Treatment Instructions" placeholder="Instructions for the patient..." bind:value={d.treatmentInstructions} />
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
