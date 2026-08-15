<script lang="ts">
	import type { Medication } from '#lib/engine/types.js';

	let {
		medications = $bindable<Medication[]>([])
	}: {
		medications: Medication[];
	} = $props();

	function addMedication() {
		medications = [
			...medications,
			{ name: '', dose: '', route: '', frequency: '', duration: '', status: '', indication: '' }
		];
	}

	function removeMedication(index: number) {
		medications = medications.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each medications as med, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<input
					type="text"
					placeholder="Name (e.g. Amoxicillin)"
					aria-label="Medication name"
					bind:value={med.name}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Dose (e.g. 500 mg)"
					aria-label="Dose"
					bind:value={med.dose}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Route (e.g. PO)"
					aria-label="Route"
					bind:value={med.route}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Frequency (e.g. TDS)"
					aria-label="Frequency"
					bind:value={med.frequency}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Duration (e.g. 7 days)"
					aria-label="Duration"
					bind:value={med.duration}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<select
					bind:value={med.status}
					aria-label="Medication status"
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				>
					<option value="">Status</option>
					<option value="new">New</option>
					<option value="changed">Changed</option>
					<option value="unchanged">Unchanged</option>
					<option value="stopped">Stopped</option>
				</select>
				<input
					type="text"
					placeholder="Indication (e.g. Pneumonia)"
					aria-label="Indication"
					bind:value={med.indication}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none sm:col-span-3"
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
