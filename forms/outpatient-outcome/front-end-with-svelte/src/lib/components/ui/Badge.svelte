<script lang="ts">
	import type { DomainGrade } from '#lib/engine/types.js';
	import { gradeLabel, gradeColor } from '#lib/engine/utils.js';

	let {
		grade,
		size = 'md'
	}: {
		grade: DomainGrade;
		size?: 'sm' | 'md' | 'lg';
	} = $props();

	const colorClass = $derived(gradeColor(grade));
	const label = $derived(gradeLabel(grade));
	const sizeClass = $derived(
		size === 'sm' ? 'px-2 py-0.5 text-xs' :
		size === 'lg' ? 'px-6 py-2 text-lg font-bold' :
		'px-4 py-1.5 text-sm font-semibold'
	);
</script>

<span class="inline-block rounded-full border {sizeClass} {colorClass}">
	{grade || '—'}{#if grade} — {label.split('—')[1]?.trim()}{/if}
</span>
