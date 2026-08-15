<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import EpdsItemField from './EpdsItemField.svelte';
	import { itemByNumber } from '#lib/engine/epds-rules.js';

	const items = [1, 2, 3, 4].map((n) => itemByNumber(n)!);
</script>

<Fieldset legend="Step 3 of 6 — Items 1 to 4">
	<p class="hint">
		In the past 7 days… Choose the answer that comes closest to how you have felt.
	</p>

	{#each items as item (item.number)}
		<EpdsItemField {item} />
	{/each}
</Fieldset>
