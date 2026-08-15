<script lang="ts">
	// RowCard — one row of a repeating child-table collection.
	//
	// Four wizard steps (investigations, problems, medications, jobs) are backed
	// by child tables rather than flat fields. This wraps a single row's fields
	// with a title and a Remove button, so the four steps share one look.
	import type { Snippet } from 'svelte';
	import Button from '#lib/components/ui/Button.svelte';

	let {
		class: className = '',
		title,
		index,
		onRemove,
		children
	}: {
		class?: string;
		title: string;
		index: number;
		onRemove: () => void;
		children: Snippet;
	} = $props();
</script>

<div class={`row-list-item ${className}`}>
	<div class="row-list-item-header">
		<span class="row-list-item-title">{title} {index + 1}</span>
		<Button
			data-variant="secondary"
			onclick={onRemove}
			label={`Remove ${title.toLowerCase()} ${index + 1}`}
		>
			Remove
		</Button>
	</div>
	{@render children()}
</div>

<style>
	.row-list-item {
		padding: 0.75rem 1rem 1rem;
		border: 1px solid var(--color-base-300, #d4d4d8);
		border-left-width: 3px;
		border-left-color: var(--color-primary, #2563eb);
		border-radius: 0.375rem;
		margin-bottom: 0.75rem;
	}

	.row-list-item-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.row-list-item-title {
		font-weight: 600;
	}
</style>
