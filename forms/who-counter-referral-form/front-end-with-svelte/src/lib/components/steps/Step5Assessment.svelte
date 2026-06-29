<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const a = assessment.data.assessment;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Assessment"
	description="The third part of the SBAR framework. Final diagnoses, prognosis, goals of care, and patient/family communication."
>
	<TextAreaInput
		label="Final diagnoses / problem list"
		name="finalDiagnoses"
		bind:value={a.finalDiagnoses}
		rows={4}
		required
	/>

	<TextAreaInput
		label="Prognosis and goals of care"
		name="prognosisAndGoalsOfCare"
		bind:value={a.prognosisAndGoalsOfCare}
		rows={3}
		required
	/>

	<RadioGroup
		label="Patient/family informed of diagnosis"
		name="patientFamilyInformed"
		options={yesNo}
		bind:value={a.patientFamilyInformed}
		required
	/>

	{#if a.patientFamilyInformed === 'yes'}
		<TextAreaInput
			label="Explain how the patient/family were informed"
			name="informedExplanation"
			bind:value={a.informedExplanation}
			rows={3}
			required
		/>
	{/if}
</Fieldset>
