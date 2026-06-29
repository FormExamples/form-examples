<script lang="ts">
	// Badge — a small status pill. Takes a label and a Lily token colour triple
	// (e.g. from validityStatusColor / priorityColor in the engine utils).
	let {
		label,
		color = 'bg-base-300 text-base-content border-base-300'
	}: {
		label: string;
		color?: string;
	} = $props();
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {color}">
	{label}
</span>
