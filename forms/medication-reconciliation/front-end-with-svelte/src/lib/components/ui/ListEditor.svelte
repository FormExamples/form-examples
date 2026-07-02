<script lang="ts" generics="T">
	// ListEditor — a generic repeating one-to-many row editor.
	//
	// Mirrors the HTML front-end's `makeListEditor`: each row renders as a card
	// (via the `row` snippet, which the parent supplies with its own Lily inputs
	// bound to the live array element), with a remove button; an "add" button
	// appends a fresh blank row from `factory()`. `items` is a $bindable $state
	// array from the store, so push/splice mutate reactive state in place and
	// seeded rows reach the editor.
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	let {
		items = $bindable<T[]>([]),
		factory,
		singular,
		addLabel,
		emptyText,
		row
	}: {
		items: T[];
		factory: () => T;
		singular: string;
		addLabel: string;
		emptyText: string;
		row: Snippet<[T, number]>;
	} = $props();

	function add() {
		items.push(factory());
	}

	function remove(index: number) {
		items.splice(index, 1);
	}
</script>

<div class="list-editor space-y-4">
	{#if items.length === 0}
		<p class="list-empty text-sm text-base-content/60">{emptyText}</p>
	{/if}

	{#each items as item, index (index)}
		<div class="list-row rounded-lg border border-base-300 bg-base-100 p-4">
			<div class="list-row-header mb-3 flex items-center justify-between">
				<h4 class="text-sm font-semibold text-base-content">{singular} {index + 1}</h4>
				<Button
					data-variant="danger"
					class="btn-sm"
					label={`Remove ${singular.toLowerCase()} ${index + 1}`}
					onclick={() => remove(index)}
				>
					Remove
				</Button>
			</div>
			<div class="list-grid grid grid-cols-1 gap-3 sm:grid-cols-2">
				{@render row(item, index)}
			</div>
		</div>
	{/each}

	<Button data-variant="secondary" onclick={add}>{addLabel}</Button>
</div>
