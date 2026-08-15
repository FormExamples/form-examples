<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.assessmentAndPlan;
</script>

<Fieldset
	title="Assessment & Plan"
	description="Brief summary, differential, and presumptive diagnoses."
>
	<TextAreaInput
		label="Summary (and plan)"
		name="apSummary"
		bind:value={a.summary}
		rows={4}
		required
	/>
	<TextAreaInput
		label="Differential"
		name="apDifferential"
		bind:value={a.differential}
		rows={3}
	/>
	<TextAreaInput
		label="Presumptive diagnoses"
		name="apPresumptiveDiagnoses"
		bind:value={a.presumptiveDiagnoses}
		rows={3}
		required
	/>
</Fieldset>
