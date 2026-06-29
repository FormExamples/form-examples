<script lang="ts">
	import { supportLevelLabel } from '$lib/engine/utils';

	let {
		score
	}: {
		score: number;
	} = $props();

	const colorClass = $derived(
		score >= 3
			? 'bg-error text-error-content border-error'
			: score >= 1
				? 'bg-warning text-warning-content border-warning'
				: 'bg-success text-success-content border-success'
	);
	const label = $derived(`${score} — ${supportLevelLabel(score)}`);
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
