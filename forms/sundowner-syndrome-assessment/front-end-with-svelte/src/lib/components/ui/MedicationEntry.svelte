<script lang="ts">
	import type { MedicationItem } from '$lib/engine/types';

	let {
		medications = $bindable<MedicationItem[]>([])
	}: {
		medications: MedicationItem[];
	} = $props();

	function addMedication() {
		medications = [...medications, { name: '', dose: '', frequency: '', indication: '' }];
	}

	function removeMedication(index: number) {
		medications = medications.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each medications as med, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
				<input
					type="text"
					placeholder="Medication name"
					bind:value={med.name}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Dose"
					bind:value={med.dose}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Frequency"
					bind:value={med.frequency}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Indication"
					bind:value={med.indication}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeMedication(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove medication"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addMedication}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add medication
	</button>
</div>
