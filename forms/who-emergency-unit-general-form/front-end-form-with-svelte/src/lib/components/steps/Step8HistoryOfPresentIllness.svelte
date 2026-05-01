<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const h = assessment.data.historyOfPresentIllness;
</script>

<SectionCard
	title="History of Present Illness"
	description="Document symptoms, time course, exacerbating and alleviating factors, prior episodes and prior interventions (including any primary health care)."
>
	<TextArea
		label="Narrative"
		name="hpiNarrative"
		bind:value={h.narrative}
		rows={6}
		required
		placeholder="Onset, character, radiation, associated symptoms, timing, prior treatment etc."
	/>
</SectionCard>
