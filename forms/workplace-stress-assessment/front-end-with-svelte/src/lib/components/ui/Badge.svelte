<script lang="ts">
	import { riskLevelLabel, riskLevelColor } from '$lib/engine/utils';
	import type { RiskLevel } from '$lib/engine/types';

	let {
		risk
	}: {
		risk: RiskLevel;
	} = $props();

	const colorClass = $derived(riskLevelColor(risk));
	const label = $derived(riskLevelLabel(risk));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
