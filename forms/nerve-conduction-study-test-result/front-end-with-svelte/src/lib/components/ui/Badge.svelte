<script lang="ts">
	// Badge — coloured pill for an axis value (classification / severity / urgency).
	let {
		label,
		color
	}: {
		label: string;
		color: string;
	} = $props();
</script>

<span class="inline-block rounded-full border px-3 py-1 text-xs font-bold {color}">
	{label}
</span>
