<script lang="ts">
	import type { Medication } from '$lib/engine/types';

	let {
		medications = $bindable<Medication[]>([])
	}: {
		medications: Medication[];
	} = $props();

	function add() {
		medications = [...medications, { name: '', atcCode: '', dose: '', frequency: '', route: '' }];
	}
	function remove(index: number) {
		medications = medications.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each medications as medication, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-5">
				<input type="text" placeholder="Name" bind:value={medication.name} class="text-input" />
				<input type="text" placeholder="ATC code" bind:value={medication.atcCode} class="text-input" />
				<input type="text" placeholder="Dose" bind:value={medication.dose} class="text-input" />
				<input type="text" placeholder="Frequency" bind:value={medication.frequency} class="text-input" />
				<input type="text" placeholder="Route" bind:value={medication.route} class="text-input" />
			</div>
			<button type="button" onclick={() => remove(i)} class="mt-1 text-error" aria-label="Remove medication">&times;</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add medication
	</button>
</div>
