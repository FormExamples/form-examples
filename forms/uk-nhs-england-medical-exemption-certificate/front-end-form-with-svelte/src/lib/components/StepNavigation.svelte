<script lang="ts">
	let {
		canGoBack = false,
		isLast = false,
		onprev,
		onnext,
		onsubmit
	}: {
		canGoBack?: boolean;
		isLast?: boolean;
		onprev?: () => void;
		onnext?: () => void;
		onsubmit?: () => void;
	} = $props();
</script>

<div class="mt-8 flex justify-between">
	{#if canGoBack}
		<button
			type="button"
			onclick={onprev}
			class="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
		>
			&larr; Previous
		</button>
	{:else}
		<div></div>
	{/if}

	{#if isLast}
		<button
			type="button"
			onclick={onsubmit}
			class="rounded-lg bg-primary px-8 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
		>
			Evaluate eligibility
		</button>
	{:else}
		<button
			type="button"
			onclick={onnext}
			class="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
		>
			Next &rarr;
		</button>
	{/if}
</div>
