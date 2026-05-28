<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Medical History" description="Previous urological conditions and relevant medical history">
	<TextAreaInput
		label="Previous urological conditions"
		name="previousUrologic"
		bind:value={m.previousUrologicConditions}
		placeholder="e.g., kidney stones, UTIs, BPH, prostatitis..."
	/>

	<TextAreaInput
		label="Surgical history"
		name="surgicalHistory"
		bind:value={m.surgicalHistory}
		placeholder="e.g., TURP, prostatectomy, cystoscopy, vasectomy..."
	/>

	<RadioGroup label="Do you have diabetes?" name="diabetes" options={yesNo} bind:value={m.diabetes} />

	<RadioGroup label="Do you have hypertension?" name="hypertension" options={yesNo} bind:value={m.hypertension} />

	<RadioGroup label="Do you have any neurological conditions?" name="neurologicConditions" options={yesNo} bind:value={m.neurologicConditions} />
	{#if m.neurologicConditions === 'yes'}
		<TextAreaInput label="Please provide details" name="neurologicDetails" bind:value={m.neurologicConditionDetails} />
	{/if}
</Fieldset>
