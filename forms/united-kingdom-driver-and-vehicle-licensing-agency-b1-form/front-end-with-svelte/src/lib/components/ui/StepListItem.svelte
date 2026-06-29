<script lang="ts">
	// StepListItem — Lily Svelte headless contract.
	import type { Snippet } from 'svelte';

	type Status = 'waiting' | 'in-progress' | 'finished' | 'error';

	let {
		class: className = '',
		status = 'waiting',
		current = false,
		label = undefined,
		children,
		...restProps
	}: {
		status?: Status;
		current?: boolean;
		label?: string;
		children: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<li class={`step-list-item ${className}`} data-status={status} aria-current={current ? 'step' : undefined} aria-label={label} {...restProps}>
	{@render children?.()}
</li>
