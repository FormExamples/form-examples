<script lang="ts">
	// Repeating-list editor for the Health Action Plan: each row captures an
	// action, its owner, and a due date.
	import type { HealthActionItem } from '$lib/engine/types';
	import Button from '$lib/components/ui/Button.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	let { actions = $bindable<HealthActionItem[]>([]) }: { actions?: HealthActionItem[] } = $props();

	function addAction() {
		actions = [...actions, { action: '', owner: '', dueDate: '' }];
	}

	function removeAction(index: number) {
		actions = actions.filter((_, i) => i !== index);
	}
</script>

<div class="list-editor">
	{#if actions.length === 0}
		<p class="hint">No actions added.</p>
	{/if}

	{#each actions as item, i (i)}
		<div class="action-row">
			<div class="action-grid">
				<label class="list-cell">
					<span class="label">Action</span>
					<TextInput label="Action" placeholder="e.g. Refer to dietitian" bind:value={item.action} />
				</label>
				<label class="list-cell">
					<span class="label">Owner</span>
					<TextInput label="Owner" placeholder="e.g. GP, carer" bind:value={item.owner} />
				</label>
				<label class="list-cell">
					<span class="label">Due date</span>
					<DateInput label="Due date" bind:value={item.dueDate} />
				</label>
			</div>
			<Button data-variant="danger" onclick={() => removeAction(i)} label="Remove action">Remove</Button>
		</div>
	{/each}

	<Button data-variant="secondary" onclick={addAction}>+ Add health action</Button>
</div>

<style>
	.list-editor {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.action-row {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		border: 1px solid var(--color-base-300, #d1d5db);
		border-radius: 0.5rem;
	}
	.action-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}
	.list-cell {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	@media (max-width: 640px) {
		.action-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
