<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const c = assessment.data.chiefComplaintAndVitals;

	const triageOptions = [
		{ value: 'red', label: 'Red (Immediate)' },
		{ value: 'orange', label: 'Orange (Very urgent)' },
		{ value: 'yellow', label: 'Yellow (Urgent)' },
		{ value: 'green', label: 'Green (Non-urgent)' }
	];
</script>

<SectionCard
	title="Chief Complaint & Vitals"
	description="Capture the chief complaint, triage category, initial vital signs and treating provider assessment time."
>
	<TextArea
		label="Chief complaint"
		name="chiefComplaint"
		bind:value={c.chiefComplaint}
		rows={2}
		placeholder="In the patient's own words where possible (e.g. 'severe abdominal pain')."
		required
	/>

	<RadioGroup
		label="Triage category"
		name="triageCategory"
		options={triageOptions}
		bind:value={c.triageCategory}
		required
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Initial vital signs</h3>
	<TextInput
		label="Time (24h)"
		name="vitalsTime"
		type="time"
		bind:value={c.initialVitals.time}
		required
	/>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Temperature" name="tempC" bind:value={c.initialVitals.tempC} unit="°C" step={0.1} min={25} max={45} />
		<NumberInput label="Pulse" name="pulse" bind:value={c.initialVitals.pulse} unit="bpm" min={0} max={300} required />
		<NumberInput label="Systolic BP" name="bpSystolic" bind:value={c.initialVitals.bpSystolic} unit="mmHg" min={0} max={300} required />
		<NumberInput label="Diastolic BP" name="bpDiastolic" bind:value={c.initialVitals.bpDiastolic} unit="mmHg" min={0} max={250} />
		<NumberInput label="Respiratory rate" name="respiratoryRate" bind:value={c.initialVitals.respiratoryRate} unit="/min" min={0} max={80} required />
		<NumberInput label="SpO2" name="spo2" bind:value={c.initialVitals.spo2} unit="%" min={0} max={100} required />
		<TextInput label="SpO2 on (e.g. RA, NC 2L)" name="spo2OnOxygen" bind:value={c.initialVitals.spo2OnOxygen} />
		<NumberInput label="Pain score" name="painScore" bind:value={c.initialVitals.painScore} unit="0–10" min={0} max={10} />
	</div>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Treating provider assessment</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Date" name="providerAssessmentDate" type="date" bind:value={c.providerAssessmentDate} />
		<TextInput label="Time (24h)" name="providerAssessmentTime" type="time" bind:value={c.providerAssessmentTime} />
	</div>
	<Checkbox label="Dead on arrival" name="deadOnArrival" bind:checked={c.deadOnArrival} />
</SectionCard>
