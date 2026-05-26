<script lang="ts">
	import type { Medication } from '$lib/engine/types';

	let { medications = $bindable<Medication[]>([]) }: { medications: Medication[] } = $props();
	function addMedication() { medications = [...medications, { name: '', dose: '', frequency: '' }]; }
	function removeMedication(index: number) { medications = medications.filter((_, i) => i !== index); }
</script>

<div class="entry-list">
	{#each medications as med, i}
		<div class="entry-row">
			<div class="entry-grid">
				<input class="text-input" type="text" placeholder="Medication name" bind:value={med.name} />
				<input class="text-input" type="text" placeholder="Dose" bind:value={med.dose} />
				<input class="text-input" type="text" placeholder="Frequency" bind:value={med.frequency} />
			</div>
			<button class="button" type="button" data-variant="danger" onclick={() => removeMedication(i)} aria-label="Remove medication">&times;</button>
		</div>
	{/each}
	<button class="button" type="button" onclick={addMedication}>+ Add Medication</button>
</div>

<style>
	.entry-list { display: flex; flex-direction: column; gap: 0.75rem; }
	.entry-row { display: flex; align-items: flex-start; gap: 0.5rem; border: 1px solid var(--color-border); background: var(--color-bg); border-radius: 0.5rem; padding: 0.75rem; }
	.entry-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; flex: 1; }
	@media (max-width: 640px) { .entry-grid { grid-template-columns: 1fr; } }
</style>
