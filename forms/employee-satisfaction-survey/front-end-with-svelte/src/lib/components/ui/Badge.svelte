<script lang="ts">
	import { categoryLabel, categoryColor } from '#lib/engine/utils.js';
	import type { SatisfactionCategory } from '#lib/engine/types.js';

	let {
		category
	}: {
		category: SatisfactionCategory;
	} = $props();

	const colorClass = $derived(categoryColor(category));
	const label = $derived(categoryLabel(category));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
