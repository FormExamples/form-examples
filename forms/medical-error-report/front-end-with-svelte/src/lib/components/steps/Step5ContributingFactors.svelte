<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.contributingFactors;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Contributing Factors" description="Factors that may have contributed to the error">
	<RadioGroup label="Staff fatigue?" name="staffFatigue" options={yesNo} bind:value={d.staffFatigue} />
	<RadioGroup label="Inadequate training?" name="inadequateTraining" options={yesNo} bind:value={d.inadequateTraining} />

	<RadioGroup label="Communication failure?" name="communicationFailure" options={yesNo} bind:value={d.communicationFailure} />
	{#if d.communicationFailure === 'yes'}
		<TextInput label="Communication Failure Details" name="communicationFailureDetails" bind:value={d.communicationFailureDetails} />
	{/if}

	<RadioGroup label="Handover failure?" name="handoverFailure" options={yesNo} bind:value={d.handoverFailure} />

	<RadioGroup label="Equipment failure?" name="equipmentFailure" options={yesNo} bind:value={d.equipmentFailure} />
	{#if d.equipmentFailure === 'yes'}
		<TextInput label="Equipment Failure Details" name="equipmentFailureDetails" bind:value={d.equipmentFailureDetails} />
	{/if}

	<RadioGroup label="Environmental factors?" name="environmentalFactors" options={yesNo} bind:value={d.environmentalFactors} />
	{#if d.environmentalFactors === 'yes'}
		<TextInput label="Environmental Details" name="environmentalDetails" bind:value={d.environmentalDetails} />
	{/if}

	<RadioGroup label="Policy or protocol not followed?" name="policyNotFollowed" options={yesNo} bind:value={d.policyNotFollowed} />
	{#if d.policyNotFollowed === 'yes'}
		<TextInput label="Policy Details" name="policyDetails" bind:value={d.policyDetails} />
	{/if}

	<RadioGroup label="Workload pressure?" name="workloadPressure" options={yesNo} bind:value={d.workloadPressure} />

	<RadioGroup label="Patient factors?" name="patientFactors" options={yesNo} bind:value={d.patientFactors} />
	{#if d.patientFactors === 'yes'}
		<TextInput label="Patient Factors Details" name="patientFactorsDetails" bind:value={d.patientFactorsDetails} />
	{/if}

	<TextAreaInput label="Other Contributing Factors" name="otherFactors" rows={3} bind:value={d.otherFactors} />
</Fieldset>
