<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const a = assessment.data.assessmentAndPlan;
</script>

<SectionCard
	title="Assessment & Plan"
	description="Brief summary, differential, and presumptive diagnoses."
>
	<TextArea
		label="Summary (and plan)"
		name="apSummary"
		bind:value={a.summary}
		rows={4}
		required
	/>
	<TextArea
		label="Differential"
		name="apDifferential"
		bind:value={a.differential}
		rows={3}
	/>
	<TextArea
		label="Presumptive diagnoses"
		name="apPresumptiveDiagnoses"
		bind:value={a.presumptiveDiagnoses}
		rows={3}
		required
	/>
</SectionCard>
