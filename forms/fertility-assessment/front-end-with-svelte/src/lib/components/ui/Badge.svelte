<script lang="ts">
	import { ruleWeightLabel, ruleWeightColor } from '$lib/engine/utils';

	let {
		score
	}: {
		score: number;
	} = $props();

	const colorClass = $derived(ruleWeightColor(score));
	const label = $derived(ruleWeightLabel(score));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
