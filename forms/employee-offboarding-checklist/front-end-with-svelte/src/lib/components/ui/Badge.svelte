<script lang="ts">
	import { outcomeColor, outcomeLabel } from '$lib/engine/utils';
	import type { Outcome } from '$lib/engine/types';

	let {
		outcome
	}: {
		outcome: Outcome;
	} = $props();

	const colorClass = $derived(outcomeColor(outcome));
	const label = $derived(outcomeLabel(outcome));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
