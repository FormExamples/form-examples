<script lang="ts">
	import type { ClavienDindoGradeKey } from '$lib/engine/types';
	import { gradeLabel, gradeBadgeColor } from '$lib/engine/utils';

	let {
		grade
	}: {
		grade: ClavienDindoGradeKey;
	} = $props();

	const colorClass = $derived(gradeBadgeColor(grade));
	const label = $derived(gradeLabel(grade));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
