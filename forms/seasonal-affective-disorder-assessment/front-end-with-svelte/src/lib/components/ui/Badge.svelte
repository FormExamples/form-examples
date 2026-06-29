<script lang="ts">
	// Badge — renders a coloured pill for a label + Lily-token colour triple.
	let {
		label,
		color
	}: {
		label: string;
		color: string;
	} = $props();
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {color}">
	{label}
</span>
