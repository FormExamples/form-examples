<script lang="ts">
	import { triStateLabel, triStateColor } from '$lib/engine/utils';
	import type { TriState } from '$lib/engine/types';

	let {
		status
	}: {
		status: TriState;
	} = $props();

	const colorClass = $derived(triStateColor(status));
	const label = $derived(triStateLabel(status));
</script>

<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {colorClass}">
	{label}
</span>
