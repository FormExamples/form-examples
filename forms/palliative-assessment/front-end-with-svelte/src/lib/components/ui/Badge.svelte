<script lang="ts">
	import type { SeverityBand } from '$lib/engine/types';
	import { severityBandColor, severityBandLabel } from '$lib/engine/utils';

	let {
		band
	}: {
		band: SeverityBand;
	} = $props();

	const colorClass = $derived(severityBandColor(band));
	const label = $derived(severityBandLabel(band));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
