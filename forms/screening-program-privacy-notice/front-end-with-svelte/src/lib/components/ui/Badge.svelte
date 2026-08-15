<script lang="ts">
	// Badge — renders an acknowledgment status as a Lily-token coloured pill.
	import { statusColor } from '#lib/engine/utils.js';

	let {
		status
	}: {
		status: 'Complete' | 'Incomplete';
	} = $props();

	const colorClass = $derived(statusColor(status));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{status}
</span>
