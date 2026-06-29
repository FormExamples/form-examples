<script lang="ts">
	let {
		colorClass,
		label
	}: {
		colorClass: string;
		label: string;
	} = $props();
</script>

<span class="inline-block rounded-full border px-3 py-1 text-xs font-bold {colorClass}">
	{label}
</span>
