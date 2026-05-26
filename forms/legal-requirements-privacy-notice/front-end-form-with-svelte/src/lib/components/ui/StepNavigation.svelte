<script lang="ts">
	// StepNavigation — Lily button-group + button[data-variant] contract.
	let {
		prevHref,
		nextHref,
		isLast = false,
		onsubmit
	}: {
		prevHref: string | null;
		nextHref: string | null;
		isLast?: boolean;
		onsubmit?: () => void;
	} = $props();
</script>

<div class="button-group">
	{#if prevHref}
		<a class="button" data-variant="secondary" href={prevHref}>&larr; Previous</a>
	{:else}
		<span></span>
	{/if}

	{#if isLast}
		<button class="button" data-variant="primary" type="button" onclick={onsubmit}>
			Submit Privacy Notice
		</button>
	{:else if nextHref}
		<a class="button" data-variant="primary" href={nextHref}>Next &rarr;</a>
	{/if}
</div>
