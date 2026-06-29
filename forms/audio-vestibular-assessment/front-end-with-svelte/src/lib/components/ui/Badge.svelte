<script lang="ts">
	// A pill badge rendering a classification label with a Lily-token colour
	// class. Used for the WHO hearing-loss grade and the DHI handicap level.
	let {
		label,
		colorClass
	}: {
		label: string;
		colorClass: string;
	} = $props();
</script>

<span class="inline-block rounded-full border px-4 py-1.5 text-sm font-bold {colorClass}">
	{label}
</span>
