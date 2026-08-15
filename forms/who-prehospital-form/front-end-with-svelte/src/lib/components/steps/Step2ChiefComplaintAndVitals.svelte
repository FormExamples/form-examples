<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';

	const c = assessment.data.chiefComplaintAndVitals;

	const pregnantOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset
	title="Chief Complaint & Vitals"
	description="Capture chief complaint, injury flag, initial vital signs, pregnancy status and pain score."
>
	<TextAreaInput
		label="Chief complaint"
		name="chiefComplaint"
		bind:value={c.chiefComplaint}
		rows={2}
		placeholder="In the patient's own words where possible."
		required
	/>
	<Checkbox label="Injury" name="injury" bind:checked={c.injury} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Initial vital signs</h3>
	<TextInput
		label="Time (24h)"
		name="vitalsTime"
		type="time"
		bind:value={c.initialVitals.time}
		required
	/>

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput
			label="HR"
			name="hr"
			bind:value={c.initialVitals.hr}
			unit="bpm"
			min={0}
			max={300}
			required
		/>
		<NumberInput
			label="RR"
			name="rr"
			bind:value={c.initialVitals.rr}
			unit="/min"
			min={0}
			max={80}
			required
		/>
		<TextInput
			label="BP"
			name="bp"
			bind:value={c.initialVitals.bp}
			placeholder="120/80"
			required
		/>
		<NumberInput
			label="Temp"
			name="tempC"
			bind:value={c.initialVitals.tempC}
			unit="°C"
			step={0.1}
			min={25}
			max={45}
		/>
		<NumberInput
			label="RBS"
			name="rbs"
			bind:value={c.initialVitals.rbs}
			unit="mmol/L"
			step={0.1}
			min={0}
			max={50}
		/>
		<NumberInput
			label="SpO2"
			name="spo2"
			bind:value={c.initialVitals.spo2}
			unit="%"
			min={0}
			max={100}
			required
		/>
		<TextInput
			label="SpO2 on (e.g. RA, NC 2L)"
			name="spo2OnOxygen"
			bind:value={c.initialVitals.spo2OnOxygen}
		/>
	</div>

	<TextAreaInput
		label="Care in progress on arrival"
		name="careInProgressOnArrival"
		bind:value={c.careInProgressOnArrival}
		rows={2}
	/>

	<RadioGroup
		label="Pregnant"
		name="pregnant"
		options={pregnantOptions}
		bind:value={c.pregnant}
	/>

	<NumberInput
		label="Pain scale (faces 0–10)"
		name="painScore"
		bind:value={c.painScore}
		unit="0–10"
		min={0}
		max={10}
	/>
</Fieldset>
