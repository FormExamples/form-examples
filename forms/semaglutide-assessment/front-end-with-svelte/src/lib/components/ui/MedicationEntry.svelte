<script lang="ts">
	import type { Medication } from '#lib/engine/types.js';

	let { medications = $bindable<Medication[]>([]) }: { medications: Medication[] } = $props();

	function add() {
		medications = [...medications, { name: '', dose: '', frequency: '' }];
	}
	function remove(index: number) {
		medications = medications.filter((_, i) => i !== index);
	}
</script>

<div class="entry-list">
	{#each medications as med, i (i)}
		<div class="entry-row">
			<input type="text" class="text-input" placeholder="Medication name" aria-label="Medication name" bind:value={med.name} />
			<input type="text" class="text-input" placeholder="Dose" aria-label="Dose" bind:value={med.dose} />
			<input type="text" class="text-input" placeholder="Frequency" aria-label="Frequency" bind:value={med.frequency} />
			<button type="button" class="button" data-variant="danger" onclick={() => remove(i)} aria-label="Remove medication">Remove</button>
		</div>
	{/each}
	<button type="button" class="button" onclick={add}>+ Add Medication</button>
</div>

<style>
	.entry-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.entry-row { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 0.5rem; align-items: end; }
	@media (max-width: 640px) { .entry-row { grid-template-columns: 1fr; } }
</style>
