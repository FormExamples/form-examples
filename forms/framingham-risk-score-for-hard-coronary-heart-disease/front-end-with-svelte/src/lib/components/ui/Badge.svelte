<script lang="ts">
	import { riskLevelLabel, riskLevelColor } from '#lib/engine/utils.js';

	let {
		level
	}: {
		level: string;
	} = $props();

	const colorClass = $derived(riskLevelColor(level));
	const label = $derived(riskLevelLabel(level));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
