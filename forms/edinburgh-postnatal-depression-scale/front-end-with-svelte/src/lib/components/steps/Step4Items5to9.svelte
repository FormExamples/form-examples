<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import EpdsItemField from './EpdsItemField.svelte';
	import { itemByNumber } from '$lib/engine/epds-rules';

	const items = [5, 6, 7, 8, 9].map((n) => itemByNumber(n)!);
</script>

<Fieldset legend="Step 4 of 6 — Items 5 to 9">
	<p class="hint">
		In the past 7 days… Choose the answer that comes closest to how you have felt.
	</p>

	{#each items as item (item.number)}
		<EpdsItemField {item} />
	{/each}
</Fieldset>
