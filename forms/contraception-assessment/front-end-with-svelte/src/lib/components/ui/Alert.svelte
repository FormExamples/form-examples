<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		class: className = '',
		type = 'info',
		heading = undefined,
		role = 'alert',
		live = undefined,
		children,
		...restProps
	}: {
		type?: 'info' | 'success' | 'warning' | 'error';
		heading?: string;
		role?: 'alert' | 'status';
		live?: 'assertive' | 'polite' | 'off';
		children: Snippet;
		[key: string]: unknown;
	} = $props();

	const ariaLive = $derived(live ?? (role === 'alert' ? 'assertive' : 'polite'));
</script>

<div
	class={`alert ${className}`}
	{role}
	aria-live={ariaLive}
	aria-atomic="true"
	data-type={type}
	{...restProps}
>
	{#if heading}
		<p><strong>{heading}</strong></p>
	{/if}
	{@render children?.()}
</div>
