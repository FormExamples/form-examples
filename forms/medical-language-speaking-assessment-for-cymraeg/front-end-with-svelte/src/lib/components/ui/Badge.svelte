<script lang="ts">
	import { gradeColor, gradeShortLabel } from '#lib/engine/utils.js';
	import type { OETGrade } from '#lib/engine/types.js';

	let {
		grade
	}: {
		grade: OETGrade;
	} = $props();

	const colorClass = $derived(gradeColor(grade));
	const label = $derived(gradeShortLabel(grade));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
