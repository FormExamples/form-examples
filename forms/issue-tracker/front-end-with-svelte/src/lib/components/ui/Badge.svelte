<script lang="ts">
	import type { Band } from '$lib/engine/types';
	import { bandColor, bandLabel } from '$lib/engine/utils';

	let {
		band
	}: {
		band: Band;
	} = $props();

	const colorClass = $derived(bandColor(band));
	const label = $derived(bandLabel(band));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
