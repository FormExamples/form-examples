<script lang="ts">
	import type { SeverityLevel } from '$lib/engine/types';
	import { severityShortLabel, severityColor } from '$lib/engine/utils';

	let {
		severity
	}: {
		severity: SeverityLevel;
	} = $props();

	const colorClass = $derived(severityColor(severity));
	const label = $derived(severityShortLabel(severity));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
