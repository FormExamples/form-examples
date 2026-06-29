<script lang="ts">
	import type { Severity } from '$lib/engine/types';
	import { severityLabel, severityColor } from '$lib/engine/utils';

	let {
		severity
	}: {
		severity: Severity;
	} = $props();

	const colorClass = $derived(severityColor(severity));
	const label = $derived(severityLabel(severity));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
