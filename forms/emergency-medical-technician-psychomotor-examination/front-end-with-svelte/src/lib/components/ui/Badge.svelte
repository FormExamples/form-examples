<script lang="ts">
	import type { Outcome } from '$lib/engine/types';
	import { outcomeLabel, outcomeColor } from '$lib/engine/utils';

	let {
		status
	}: {
		status: Outcome;
	} = $props();

	const colorClass = $derived(outcomeColor(status));
	const label = $derived(outcomeLabel(status));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
