<script lang="ts">
	// Badge — renders a single Braden subscale score against its maximum, with a
	// Lily token colour that reflects how close the subscale is to its highest
	// (lowest-risk) value.
	import { subscaleColor } from '#lib/engine/utils.js';

	let {
		score,
		maxScore
	}: {
		score: number;
		maxScore: number;
	} = $props();

	const colorClass = $derived(subscaleColor(score, maxScore));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{score} / {maxScore}
</span>
