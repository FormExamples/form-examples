<script lang="ts">
	let {
		onPrev,
		onNext,
		onSubmit,
		isFirst = false,
		isLast = false
	}: {
		onPrev?: () => void;
		onNext?: () => void;
		onSubmit?: () => void;
		isFirst?: boolean;
		isLast?: boolean;
	} = $props();
</script>

<div class="mt-8 flex justify-between">
	{#if !isFirst && onPrev}
		<button
			type="button"
			onclick={onPrev}
			class="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
		>
			&larr; Previous
		</button>
	{:else}
		<div></div>
	{/if}

	{#if isLast && onSubmit}
		<button
			type="button"
			onclick={onSubmit}
			class="rounded-lg bg-primary px-8 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
		>
			Submit Report
		</button>
	{:else if onNext}
		<button
			type="button"
			onclick={onNext}
			class="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
		>
			Next &rarr;
		</button>
	{/if}
</div>
