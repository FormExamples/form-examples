<script lang="ts">
	// A small pill badge. The colour class is a set of Lily design-system
	// token utilities (e.g. `bg-success text-success-content border-success`),
	// supplied by the caller from the engine's colour helpers.
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
