<script lang="ts">
	import type { EligibilityStatus } from '#lib/engine/types.js';
	import { eligibilityShortLabel, eligibilityColor } from '#lib/engine/utils.js';

	let {
		status
	}: {
		status: EligibilityStatus;
	} = $props();

	const colorClass = $derived(eligibilityColor(status));
	const label = $derived(eligibilityShortLabel(status));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
