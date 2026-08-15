<script lang="ts">
	import { substanceGradeLabel, substanceGradeColor } from '#lib/engine/utils.js';

	let {
		grade
	}: {
		grade: number;
	} = $props();

	const colorClass = $derived(substanceGradeColor(grade));
	const label = $derived(substanceGradeLabel(grade));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
