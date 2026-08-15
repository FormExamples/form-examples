<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import DassItemQuestion from '#lib/components/ui/DassItemQuestion.svelte';

	const s = assessment.data.dassStress;
</script>

<Fieldset legend="DASS-21 — Stress">
	<p class="hint">Please read each statement and decide how much it applied to you over the past week.</p>
	<DassItemQuestion itemNumber={1} text="I found it hard to wind down." name="s1" bind:value={s.item1HardToWindDown} />
	<DassItemQuestion itemNumber={6} text="I tended to over-react to situations." name="s6" bind:value={s.item6OverReact} />
	<DassItemQuestion itemNumber={8} text="I felt that I was using a lot of nervous energy." name="s8" bind:value={s.item8NervousEnergy} />
	<DassItemQuestion itemNumber={11} text="I found myself getting agitated." name="s11" bind:value={s.item11AgitatedEasily} />
	<DassItemQuestion itemNumber={12} text="I found it difficult to relax." name="s12" bind:value={s.item12DifficultToRelax} />
	<DassItemQuestion itemNumber={14} text="I was intolerant of anything that kept me from getting on with what I was doing." name="s14" bind:value={s.item14Intolerant} />
	<DassItemQuestion itemNumber={18} text="I felt that I was rather touchy." name="s18" bind:value={s.item18TouchyEasily} />
</Fieldset>
