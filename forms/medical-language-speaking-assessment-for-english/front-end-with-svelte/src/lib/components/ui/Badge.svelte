<script lang="ts">
	import { severityLabel, severityColor } from '$lib/engine/utils';

	let {
		grade
	}: {
		grade: number;
	} = $props();

	const colorClass = $derived(severityColor(grade));
	const label = $derived(severityLabel(grade));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
