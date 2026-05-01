<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const b = assessment.data.background;
</script>

<SectionCard
	title="Background"
	description="The second part of the SBAR framework. Briefly describe the relevant history and significant events during the referral episode."
>
	<TextArea
		label="Brief history of present illness"
		name="historyOfPresentIllness"
		bind:value={b.historyOfPresentIllness}
		rows={3}
		required
	/>

	<TextArea
		label="Relevant past medical history"
		name="pastMedicalHistory"
		bind:value={b.pastMedicalHistory}
		rows={3}
		required
	/>

	<TextArea
		label="Significant investigations or events during the referral episode"
		name="significantEvents"
		bind:value={b.significantEvents}
		rows={3}
		placeholder="Notable investigations, procedures, complications, or other events."
	/>
</SectionCard>
