<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const r = assessment.data.reassessment;
</script>

<SectionCard
	title="Reassessment"
	description="Repeat vital signs and condition update."
>
	<TextInput label="Time (24h)" name="reassessTime" type="time" bind:value={r.time} />

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput label="Temperature" name="reassessTempC" bind:value={r.tempC} unit="°C" step={0.1} min={25} max={45} />
		<NumberInput label="Pulse" name="reassessPulse" bind:value={r.pulse} unit="bpm" min={0} max={300} />
		<NumberInput label="Systolic BP" name="reassessBpSystolic" bind:value={r.bpSystolic} unit="mmHg" min={0} max={300} />
		<NumberInput label="Diastolic BP" name="reassessBpDiastolic" bind:value={r.bpDiastolic} unit="mmHg" min={0} max={250} />
		<NumberInput label="Respiratory rate" name="reassessRespiratoryRate" bind:value={r.respiratoryRate} unit="/min" min={0} max={80} />
		<NumberInput label="SpO2" name="reassessSpo2" bind:value={r.spo2} unit="%" min={0} max={100} />
		<TextInput label="SpO2 on (e.g. RA, NC 2L)" name="reassessSpo2OnOxygen" bind:value={r.spo2OnOxygen} />
	</div>

	<Checkbox label="Condition same" name="conditionSame" bind:checked={r.conditionSame} />
	{#if !r.conditionSame}
		<TextArea label="Condition changes" name="conditionChanges" bind:value={r.conditionChanges} rows={3} />
	{/if}
</SectionCard>
