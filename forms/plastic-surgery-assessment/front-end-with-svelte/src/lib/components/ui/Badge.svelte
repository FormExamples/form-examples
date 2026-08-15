<script lang="ts">
	import { gradeClassLabel, gradeClassColor } from '#lib/engine/utils.js';

	let {
		grade
	}: {
		grade: number;
	} = $props();

	const colorClass = $derived(gradeClassColor(grade));
	const label = $derived(gradeClassLabel(grade));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
