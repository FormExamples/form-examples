<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Medical History" description="Previous gynaecological conditions and relevant medical history">
	<TextAreaInput
		label="Previous gynaecological conditions"
		name="previousGynConditions"
		bind:value={m.previousGynConditions}
		placeholder="e.g., endometriosis, fibroids, ovarian cysts, PCOS..."
	/>

	<TextAreaInput
		label="Chronic diseases"
		name="chronicDiseases"
		bind:value={m.chronicDiseases}
		placeholder="e.g., diabetes, hypertension, thyroid disease..."
	/>

	<TextAreaInput
		label="Surgical history"
		name="surgicalHistory"
		bind:value={m.surgicalHistory}
		placeholder="e.g., laparoscopy, hysteroscopy, caesarean section..."
	/>

	<RadioGroup label="Do you have any autoimmune diseases?" name="autoimmune" options={yesNo} bind:value={m.autoimmuneDiseases} />
	{#if m.autoimmuneDiseases === 'yes'}
		<TextAreaInput label="Please provide details" name="autoimmuneDetails" bind:value={m.autoimmuneDiseaseDetails} />
	{/if}
</Fieldset>
