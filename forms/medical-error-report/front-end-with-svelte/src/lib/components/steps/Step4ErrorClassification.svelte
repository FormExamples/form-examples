<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = assessment.data.errorClassification;
</script>

<Fieldset title="Error Classification" description="Type and severity classification of the error">
	<Select
		label="Error Type"
		name="errorType"
		options={[
			{ value: 'medication', label: 'Medication' },
			{ value: 'surgical', label: 'Surgical' },
			{ value: 'diagnostic', label: 'Diagnostic' },
			{ value: 'treatment', label: 'Treatment' },
			{ value: 'communication', label: 'Communication' },
			{ value: 'equipment', label: 'Equipment' },
			{ value: 'fall', label: 'Fall' },
			{ value: 'infection', label: 'Healthcare-Associated Infection' },
			{ value: 'transfusion', label: 'Transfusion' },
			{ value: 'other', label: 'Other' }
		]}
		bind:value={d.errorType}
		required
	/>
	<TextInput label="Error Type Details" name="errorTypeDetails" bind:value={d.errorTypeDetails} />

	{#if d.errorType === 'medication'}
		<Select
			label="Medication Error Stage"
			name="medicationErrorStage"
			options={[
				{ value: 'prescribing', label: 'Prescribing' },
				{ value: 'dispensing', label: 'Dispensing' },
				{ value: 'administration', label: 'Administration' },
				{ value: 'monitoring', label: 'Monitoring' },
				{ value: 'other', label: 'Other' }
			]}
			bind:value={d.medicationErrorStage}
		/>
	{/if}

	<Select
		label="WHO Severity"
		name="whoSeverity"
		options={[
			{ value: 'near-miss', label: 'Near Miss — no harm reached patient' },
			{ value: 'mild', label: 'Mild — temporary minor harm' },
			{ value: 'moderate', label: 'Moderate — temporary significant harm' },
			{ value: 'severe', label: 'Severe — permanent harm' },
			{ value: 'critical', label: 'Critical — death or life-threatening' }
		]}
		bind:value={d.whoSeverity}
		required
	/>

	<Select
		label="NCC MERP Category"
		name="nccMerpCategory"
		options={[
			{ value: 'A', label: 'A — Capacity to cause error' },
			{ value: 'B', label: 'B — Error did not reach patient' },
			{ value: 'C', label: 'C — Reached patient, no harm' },
			{ value: 'D', label: 'D — Required monitoring, no harm' },
			{ value: 'E', label: 'E — Temporary harm, intervention required' },
			{ value: 'F', label: 'F — Temporary harm, hospitalisation' },
			{ value: 'G', label: 'G — Permanent harm' },
			{ value: 'H', label: 'H — Intervention to sustain life' },
			{ value: 'I', label: 'I — Patient death' }
		]}
		bind:value={d.nccMerpCategory}
	/>

	<Select
		label="Preventability"
		name="preventability"
		options={[
			{ value: 'clearly-preventable', label: 'Clearly Preventable' },
			{ value: 'probably-preventable', label: 'Probably Preventable' },
			{ value: 'probably-not-preventable', label: 'Probably Not Preventable' },
			{ value: 'clearly-not-preventable', label: 'Clearly Not Preventable' },
			{ value: 'unknown', label: 'Unknown' }
		]}
		bind:value={d.preventability}
	/>

	<Select
		label="Recurrence Likelihood"
		name="recurrenceLikelihood"
		options={[
			{ value: 'very-likely', label: 'Very Likely' },
			{ value: 'likely', label: 'Likely' },
			{ value: 'unlikely', label: 'Unlikely' },
			{ value: 'very-unlikely', label: 'Very Unlikely' },
			{ value: 'unknown', label: 'Unknown' }
		]}
		bind:value={d.recurrenceLikelihood}
	/>
</Fieldset>
