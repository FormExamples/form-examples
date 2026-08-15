<script lang="ts">
	import { restrictionGradeLabel, restrictionGradeColor } from '#lib/engine/utils.js';

	let {
		grade
	}: {
		grade: number;
	} = $props();

	const colorClass = $derived(restrictionGradeColor(grade));
	const label = $derived(restrictionGradeLabel(grade));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
