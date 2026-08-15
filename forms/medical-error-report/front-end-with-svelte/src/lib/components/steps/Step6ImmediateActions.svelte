<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.immediateActions;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const yesNoNA = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'not-applicable', label: 'Not Applicable' }
	];
</script>

<Fieldset title="Immediate Actions Taken" description="Actions taken immediately after the incident">
	<RadioGroup label="Was the patient assessed?" name="patientAssessed" options={yesNoNA} bind:value={d.patientAssessed} />

	<RadioGroup label="Was treatment provided?" name="treatmentProvided" options={yesNoNA} bind:value={d.treatmentProvided} />
	{#if d.treatmentProvided === 'yes'}
		<TextAreaInput label="Treatment Details" name="treatmentDetails" rows={3} bind:value={d.treatmentDetails} />
	{/if}

	<RadioGroup label="Was the error contained?" name="errorContained" options={yesNo} bind:value={d.errorContained} />
	{#if d.errorContained === 'yes'}
		<TextInput label="Containment Details" name="containmentDetails" bind:value={d.containmentDetails} />
	{/if}

	<RadioGroup label="Was senior staff notified?" name="seniorStaffNotified" options={yesNo} bind:value={d.seniorStaffNotified} />
	{#if d.seniorStaffNotified === 'yes'}
		<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
			<TextInput label="Senior Staff Name" name="seniorStaffName" bind:value={d.seniorStaffName} />
			<TextInput label="Senior Staff Role" name="seniorStaffRole" bind:value={d.seniorStaffRole} />
		</div>
	{/if}

	<RadioGroup label="Was the risk team notified?" name="riskTeamNotified" options={yesNo} bind:value={d.riskTeamNotified} />

	<RadioGroup label="Additional monitoring put in place?" name="additionalMonitoring" options={yesNo} bind:value={d.additionalMonitoring} />
	{#if d.additionalMonitoring === 'yes'}
		<TextInput label="Monitoring Details" name="monitoringDetails" bind:value={d.monitoringDetails} />
	{/if}

	<TextAreaInput label="Immediate Actions Summary" name="immediateActionsSummary" rows={4} bind:value={d.immediateActionsSummary} />
</Fieldset>
