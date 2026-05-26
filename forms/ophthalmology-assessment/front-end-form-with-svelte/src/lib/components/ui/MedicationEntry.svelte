<script lang="ts">
	import type { Medication } from '$lib/engine/types';

	let {
		medications = $bindable<Medication[]>([])
	}: {
		medications: Medication[];
	} = $props();

	function addMedication() { medications = [...medications, { name: '', dose: '', frequency: '' }]; }
	function removeMedication(index: number) { medications = medications.filter((_, i) => i !== index); }
</script>

<div class="medication-list">
	{#each medications as med, i (i)}
		<div class="medication-row">
			<input type="text" placeholder="Medication name" bind:value={med.name} class="text-input" aria-label="Medication name" />
			<input type="text" placeholder="Dose" bind:value={med.dose} class="text-input" aria-label="Dose" />
			<input type="text" placeholder="Frequency" bind:value={med.frequency} class="text-input" aria-label="Frequency" />
			<button type="button" class="button" data-variant="danger" onclick={() => removeMedication(i)} aria-label="Remove medication">&times;</button>
		</div>
	{/each}
	<button type="button" class="button" onclick={addMedication}>+ Add Medication</button>
</div>

<style>
	.medication-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.medication-row { display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: 0.5rem; align-items: center; }
	@media (max-width: 640px) { .medication-row { grid-template-columns: 1fr; } }
</style>
