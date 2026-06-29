<script lang="ts">
	import type { RiskLevel } from '$lib/engine/types';
	import { riskLevelShortLabel, riskLevelColor } from '$lib/engine/utils';

	let {
		risk
	}: {
		risk: RiskLevel;
	} = $props();

	const colorClass = $derived(riskLevelColor(risk));
	const label = $derived(riskLevelShortLabel(risk));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
