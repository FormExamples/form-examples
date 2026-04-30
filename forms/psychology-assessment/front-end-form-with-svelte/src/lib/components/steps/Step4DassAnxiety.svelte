<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import DassItemQuestion from '$lib/components/ui/DassItemQuestion.svelte';

	const a = assessment.data.dassAnxiety;
</script>

<SectionCard
	title="DASS-21 — Anxiety"
	description="Please read each statement and decide how much it applied to you over the past week."
>
	<DassItemQuestion
		itemNumber={2}
		text="I was aware of dryness of my mouth."
		name="a2"
		bind:value={a.item2DrynessOfMouth}
	/>
	<DassItemQuestion
		itemNumber={4}
		text="I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)."
		name="a4"
		bind:value={a.item4BreathingDifficulty}
	/>
	<DassItemQuestion
		itemNumber={7}
		text="I experienced trembling (e.g. in the hands)."
		name="a7"
		bind:value={a.item7Trembling}
	/>
	<DassItemQuestion
		itemNumber={9}
		text="I was worried about situations in which I might panic and make a fool of myself."
		name="a9"
		bind:value={a.item9PanicWorry}
	/>
	<DassItemQuestion
		itemNumber={15}
		text="I felt I was close to panic."
		name="a15"
		bind:value={a.item15ClosedToPanic}
	/>
	<DassItemQuestion
		itemNumber={19}
		text="I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)."
		name="a19"
		bind:value={a.item19HeartActionAware}
	/>
	<DassItemQuestion
		itemNumber={20}
		text="I felt scared without any good reason."
		name="a20"
		bind:value={a.item20ScaredWithoutReason}
	/>
</SectionCard>
