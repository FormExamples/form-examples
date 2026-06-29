<script lang="ts">
	import { axisStatusLabel, axisStatusColor } from '$lib/engine/utils';
	import type { AxisStatus } from '$lib/engine/types';

	let {
		status
	}: {
		status: AxisStatus;
	} = $props();

	const colorClass = $derived(axisStatusColor(status));
	const label = $derived(axisStatusLabel(status));
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
