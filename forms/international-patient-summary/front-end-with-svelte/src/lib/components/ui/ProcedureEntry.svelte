<script lang="ts">
	import type { Procedure } from '$lib/engine/types';

	let {
		procedures = $bindable<Procedure[]>([])
	}: {
		procedures: Procedure[];
	} = $props();

	function add() {
		procedures = [...procedures, { description: '', date: '', performer: '' }];
	}
	function remove(index: number) {
		procedures = procedures.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each procedures as procedure, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<input type="text" placeholder="Procedure" bind:value={procedure.description} class="text-input" />
				<input type="date" aria-label="Date" bind:value={procedure.date} class="date-input" />
				<input type="text" placeholder="Performer / facility" bind:value={procedure.performer} class="text-input" />
			</div>
			<button type="button" onclick={() => remove(i)} class="mt-1 text-error" aria-label="Remove procedure">&times;</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add procedure
	</button>
</div>
