<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.situation;

	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<SectionCard
	title="Situation"
	description="The first part of the SBAR communication framework. Describe what is currently going on with the patient."
>
	<TextArea
		label="Chief complaint"
		name="chiefComplaint"
		bind:value={s.chiefComplaint}
		rows={2}
		placeholder="In the patient's own words where possible (e.g. 'severe chest pain')."
		required
	/>

	<TextArea
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

	<TextArea
		label="Other acute diagnoses"
		name="otherAcuteDiagnoses"
		bind:value={s.otherAcuteDiagnoses}
		rows={3}
	/>

	<TextArea
		label="Treatments initiated"
		name="treatmentsInitiated"
		bind:value={s.treatmentsInitiated}
		rows={3}
		placeholder="Therapies, medications, procedures, fluids initiated at the initiating facility."
	/>
</SectionCard>
