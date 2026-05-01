<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const a = assessment.data.assessmentAndPlan;
</script>

<SectionCard
	title="Assessment & Plan"
	description="Summary, differential diagnosis and plan for diagnostics, intervention and consults."
>
	<TextArea
		label="Narrative"
		name="apNarrative"
		bind:value={a.narrative}
		rows={8}
		required
		placeholder="Summary, differential diagnoses, plan for imaging / interventions / consults."
	/>
</SectionCard>
