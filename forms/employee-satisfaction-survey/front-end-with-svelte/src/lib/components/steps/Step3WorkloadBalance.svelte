<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import LikertItem from '#lib/components/ui/LikertItem.svelte';
	import { surveyItems } from '#lib/engine/rules.js';
	import type { LikertValue } from '#lib/engine/types.js';

	const d = assessment.data.workload as unknown as Record<string, LikertValue>;
	const items = surveyItems.filter((it) => it.domain === 'workload');
</script>

<Fieldset legend="Workload & Work-Life Balance">
	<p class="hint">
		Rate each statement from <em>Strongly disagree</em> to <em>Strongly agree</em>.
	</p>
	{#each items as item (item.id)}
		<LikertItem id={item.id} label={item.label} bind:value={d[item.id]} />
	{/each}
</Fieldset>
