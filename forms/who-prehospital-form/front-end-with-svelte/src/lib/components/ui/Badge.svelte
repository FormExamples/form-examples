<script lang="ts">
	import type { FlagPriority } from '#lib/engine/types.js';
	import { priorityColor, priorityLabel } from '#lib/engine/utils.js';

	let {
		priority,
		label = ''
	}: {
		priority: FlagPriority;
		label?: string;
	} = $props();

	const colorClass = $derived(priorityColor(priority));
	const display = $derived(label || priorityLabel(priority));
</script>

<span class="inline-block rounded-full border px-3 py-1 text-xs font-bold {colorClass}">
	{display}
</span>
