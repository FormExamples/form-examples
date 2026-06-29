<script lang="ts">
	import type { Immunisation } from '$lib/engine/types';

	let {
		immunisations = $bindable<Immunisation[]>([])
	}: {
		immunisations: Immunisation[];
	} = $props();

	function add() {
		immunisations = [...immunisations, { vaccine: '', date: '', lotNumber: '' }];
	}
	function remove(index: number) {
		immunisations = immunisations.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each immunisations as immunisation, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<input type="text" placeholder="Vaccine" bind:value={immunisation.vaccine} class="text-input" />
				<input type="date" aria-label="Date administered" bind:value={immunisation.date} class="date-input" />
				<input type="text" placeholder="Lot number" bind:value={immunisation.lotNumber} class="text-input" />
			</div>
			<button type="button" onclick={() => remove(i)} class="mt-1 text-error" aria-label="Remove immunisation">&times;</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add immunisation
	</button>
</div>
