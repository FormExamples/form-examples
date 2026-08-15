<script lang="ts">
	// Graded domain step: renders one 1-5 Likert item per survey item in the
	// 'collaboration' domain, bound to the live store section.
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { DOMAINS, surveyItems } from '#lib/engine/rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import LikertItem from '#lib/components/ui/LikertItem.svelte';
	import type { LikertValue } from '#lib/engine/types.js';

	const meta = DOMAINS.find((dm) => dm.key === 'collaboration')!;
	const items = surveyItems.filter((it) => it.domain === 'collaboration');
	const d = assessment.data.collaboration as unknown as Record<string, LikertValue>;
</script>

<Fieldset legend={meta.title}>
	<p class="hint">{meta.description}</p>
	{#each items as item (item.id)}
		<LikertItem id={item.id} label={item.label} bind:value={d[item.id]} />
	{/each}
</Fieldset>
