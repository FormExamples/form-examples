<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.situation;

	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset
	title="Situation"
	description="The first part of the SBAR communication framework. Describe what is currently going on with the patient."
>
	<TextAreaInput
		label="Chief complaint"
		name="chiefComplaint"
		bind:value={s.chiefComplaint}
		rows={2}
		placeholder="In the patient's own words where possible (e.g. 'severe chest pain')."
		required
	/>

	<TextAreaInput
		label="Primary diagnosis"
		name="primaryDiagnosis"
		bind:value={s.primaryDiagnosis}
		rows={2}
		required
	/>

	<RadioGroup
		label="Pregnant?"
		name="pregnant"
		options={yesNoUnknown}
		bind:value={s.pregnant}
		required
	/>

	<TextAreaInput
		label="Other acute diagnoses"
		name="otherAcuteDiagnoses"
		bind:value={s.otherAcuteDiagnoses}
		rows={3}
	/>

	<TextAreaInput
		label="Treatments initiated"
		name="treatmentsInitiated"
		bind:value={s.treatmentsInitiated}
		rows={3}
		placeholder="Therapies, medications, procedures, fluids initiated at the initiating facility."
	/>
</Fieldset>
