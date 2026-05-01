<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.disposition;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const dispositionOptions = [
		{ value: 'admit', label: 'Admit' },
		{ value: 'transfer', label: 'Transfer' },
		{ value: 'discharge', label: 'Discharge' },
		{ value: 'died', label: 'Died' }
	];

	const admitWardOptions = [
		{ value: 'ward', label: 'Ward' },
		{ value: 'icu', label: 'ICU' },
		{ value: 'ot', label: 'OT (operating theatre)' }
	];
</script>

<SectionCard
	title="Disposition"
	description="Admit / transfer / discharge / died, departure timestamps, final vital signs, and provider sign-off."
>
	<RadioGroup label="Checklist completed?" name="checklistCompleted" options={yesNo} bind:value={d.checklistCompleted} />

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="ED departure date" name="edDepartureDate" type="date" bind:value={d.edDepartureDate} required />
		<TextInput label="ED departure time (24h)" name="edDepartureTime" type="time" bind:value={d.edDepartureTime} required />
	</div>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Final vital signs</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Temperature" name="finalTempC" bind:value={d.finalVitals.tempC} unit="°C" step={0.1} min={25} max={45} />
		<NumberInput label="Pulse" name="finalPulse" bind:value={d.finalVitals.pulse} unit="bpm" min={0} max={300} />
		<NumberInput label="Systolic BP" name="finalBpSystolic" bind:value={d.finalVitals.bpSystolic} unit="mmHg" min={0} max={300} />
		<NumberInput label="Diastolic BP" name="finalBpDiastolic" bind:value={d.finalVitals.bpDiastolic} unit="mmHg" min={0} max={250} />
		<NumberInput label="Respiratory rate" name="finalRespiratoryRate" bind:value={d.finalVitals.respiratoryRate} unit="/min" min={0} max={80} />
		<NumberInput label="SpO2" name="finalSpo2" bind:value={d.finalVitals.spo2} unit="%" min={0} max={100} />
		<TextInput label="SpO2 on (e.g. RA, NC 2L)" name="finalSpo2OnOxygen" bind:value={d.finalVitals.spo2OnOxygen} />
	</div>

	<TextArea
		label="Diagnoses / Impressions (list all)"
		name="diagnosesImpressions"
		bind:value={d.diagnosesImpressions}
		rows={4}
		required
	/>

	<RadioGroup
		label="Disposition"
		name="disposition"
		options={dispositionOptions}
		bind:value={d.disposition}
		required
	/>

	{#if d.disposition === 'admit'}
		<RadioGroup label="Admit to" name="admitWard" options={admitWardOptions} bind:value={d.admitWard} required />
	{/if}

	{#if d.disposition === 'transfer'}
		<TextInput label="Transfer to" name="transferTo" bind:value={d.transferTo} required />
	{/if}

	{#if d.disposition === 'discharge'}
		<RadioGroup label="Discharge plan discussed?" name="dischargePlanDiscussed" options={yesNo} bind:value={d.dischargePlanDiscussed} />
	{/if}

	<Checkbox
		label="Left without being seen or before treatment was complete"
		name="leftWithoutBeingSeen"
		bind:checked={d.leftWithoutBeingSeen}
	/>

	{#if d.disposition === 'died'}
		<TextInput
			label="Cause of death (NOT cardiopulmonary arrest)"
			name="diedCause"
			bind:value={d.diedCause}
			required
		/>
	{/if}

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Provider sign-off</h3>
	<TextInput label="Accepting provider" name="acceptingProvider" bind:value={d.acceptingProvider} />
	<TextInput
		label="Emergency unit provider name / title (include handovers)"
		name="emergencyUnitProvider"
		bind:value={d.emergencyUnitProvider}
		required
	/>
	<TextInput label="Signature" name="signature" bind:value={d.signature} required />
	<TextInput label="Signature date" name="signatureDate" type="date" bind:value={d.signatureDate} required />
</SectionCard>
