<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const c = assessment.data.chiefComplaintAndVitals;
</script>

<Fieldset
	title="Chief Complaint & Vitals"
	description="Capture chief complaint, allergies, initial vital signs, and dead-on-arrival status."
>
	<TextAreaInput
		label="Chief complaint"
		name="chiefComplaint"
		bind:value={c.chiefComplaint}
		rows={2}
		placeholder="In the patient's own words where possible (e.g. 'multiple injuries from RTA')."
		required
	/>

	<TextAreaInput label="Allergies" name="allergies" bind:value={c.allergies} rows={2} />
	<Checkbox label="Allergies: Unknown" name="allergiesUnknown" bind:checked={c.allergiesUnknown} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Initial vital signs</h3>
	<TextInput
		label="Time (24h)"
		name="vitalsTime"
		type="time"
		bind:value={c.initialVitals.time}
		required
	/>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Temperature" name="tempC" bind:value={c.initialVitals.tempC} unit="°C" step={0.1} min={25} max={45} />
		<NumberInput label="Pulse" name="pulse" bind:value={c.initialVitals.pulse} unit="bpm" min={0} max={300} />
		<NumberInput label="Systolic BP" name="bpSystolic" bind:value={c.initialVitals.bpSystolic} unit="mmHg" min={0} max={300} />
		<NumberInput label="Diastolic BP" name="bpDiastolic" bind:value={c.initialVitals.bpDiastolic} unit="mmHg" min={0} max={250} />
		<NumberInput label="Respiratory rate" name="respiratoryRate" bind:value={c.initialVitals.respiratoryRate} unit="/min" min={0} max={80} />
		<NumberInput label="SpO2" name="spo2" bind:value={c.initialVitals.spo2} unit="%" min={0} max={100} />
		<TextInput label="SpO2 on (e.g. RA, NC 2L)" name="spo2OnOxygen" bind:value={c.initialVitals.spo2OnOxygen} />
		<NumberInput label="Pain score" name="painScore" bind:value={c.initialVitals.painScore} unit="0–10" min={0} max={10} />
	</div>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Dead on arrival</h3>
	<Checkbox label="Patient is dead on arrival" name="deadOnArrival" bind:checked={c.deadOnArrival} />
	{#if c.deadOnArrival}
		<TextInput label="Time of death (24h)" name="timeOfDeath" type="time" bind:value={c.timeOfDeath} required />
	{/if}
</Fieldset>
