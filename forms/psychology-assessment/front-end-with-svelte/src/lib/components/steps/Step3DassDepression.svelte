<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import DassItemQuestion from '#lib/components/ui/DassItemQuestion.svelte';

	const d = assessment.data.dassDepression;
</script>

<Fieldset legend="DASS-21 — Depression">
	<p class="hint">Please read each statement and decide how much it applied to you over the past week. There are no right or wrong answers.</p>
	<DassItemQuestion itemNumber={3} text="I couldn't seem to experience any positive feeling at all." name="d3" bind:value={d.item3CouldNotExperiencePositive} />
	<DassItemQuestion itemNumber={5} text="I found it difficult to work up the initiative to do things." name="d5" bind:value={d.item5DifficultInitiating} />
	<DassItemQuestion itemNumber={10} text="I felt that I had nothing to look forward to." name="d10" bind:value={d.item10NothingToLookForwardTo} />
	<DassItemQuestion itemNumber={13} text="I felt down-hearted and blue." name="d13" bind:value={d.item13DownheartedBlue} />
	<DassItemQuestion itemNumber={16} text="I was unable to become enthusiastic about anything." name="d16" bind:value={d.item16UnableToBecomeEnthusiastic} />
	<DassItemQuestion itemNumber={17} text="I felt I wasn't worth much as a person." name="d17" bind:value={d.item17NotWorthMuch} />
	<DassItemQuestion itemNumber={21} text="I felt that life was meaningless." name="d21" bind:value={d.item21LifeMeaningless} />
</Fieldset>
