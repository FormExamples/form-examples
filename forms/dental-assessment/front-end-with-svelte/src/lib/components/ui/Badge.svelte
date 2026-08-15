<script lang="ts">
	import { dmftCategoryLabel, dmftCategoryColor } from '#lib/engine/utils.js';
	import type { DMFTCategory } from '#lib/engine/types.js';

	let {
		category
	}: {
		category: DMFTCategory;
	} = $props();

	const colorClass = $derived(dmftCategoryColor(category));
	const label = $derived(dmftCategoryLabel(category));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
