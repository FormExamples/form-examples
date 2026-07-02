<script lang="ts">
	// Badge — a small pill for a status label. Generic (Lily headless): the
	// consumer supplies the text and the Lily-token colour utility classes.
	let {
		label,
		colorClass = 'bg-base-300 text-base-content border-base-300'
	}: {
		label: string;
		colorClass?: string;
	} = $props();
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
