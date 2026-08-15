<script lang="ts">
	import type { DassSeverity } from '#lib/engine/types.js';
	import { severityColor, severityLabel } from '#lib/engine/utils.js';

	let {
		severity,
		label = ''
	}: {
		severity: DassSeverity | '';
		label?: string;
	} = $props();

	const colorClass = $derived(severityColor(severity));
	const display = $derived(label || severityLabel(severity));
</script>

<span class="inline-block rounded-full border px-3 py-1 text-xs font-bold {colorClass}">
	{display}
</span>
