<script lang="ts">
	import type { CompletenessLevel } from '#lib/engine/types.js';
	import { completenessLevelLabel, completenessLevelColor } from '#lib/engine/utils.js';

	let {
		level
	}: {
		level: CompletenessLevel;
	} = $props();

	const colorClass = $derived(completenessLevelColor(level));
	const label = $derived(completenessLevelLabel(level));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
