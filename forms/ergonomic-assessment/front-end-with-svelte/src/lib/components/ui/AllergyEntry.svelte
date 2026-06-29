<script lang="ts">
	let {
		items = $bindable<string[]>([]),
		label = 'Condition',
		placeholder = 'Condition name'
	}: {
		items: string[];
		label?: string;
		placeholder?: string;
	} = $props();

	function addItem() {
		items = [...items, ''];
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each items as item, i}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<input
				type="text"
				{placeholder}
				bind:value={items[i]}
				class="flex-1 rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
			/>
			<button
				type="button"
				onclick={() => removeItem(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove condition"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addItem}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/60 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add {label}
	</button>
</div>
