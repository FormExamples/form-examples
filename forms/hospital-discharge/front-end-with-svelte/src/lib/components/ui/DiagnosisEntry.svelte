<script lang="ts">
	import type { Diagnosis } from '$lib/engine/types';

	let {
		diagnoses = $bindable<Diagnosis[]>([])
	}: {
		diagnoses: Diagnosis[];
	} = $props();

	function addDiagnosis() {
		diagnoses = [...diagnoses, { description: '', icd10: '', type: '' }];
	}

	function removeDiagnosis(index: number) {
		diagnoses = diagnoses.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each diagnoses as diagnosis, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<select
					bind:value={diagnosis.type}
					aria-label="Diagnosis type"
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				>
					<option value="">Type</option>
					<option value="primary">Primary</option>
					<option value="secondary">Secondary</option>
				</select>
				<input
					type="text"
					placeholder="Description (e.g. Community-acquired pneumonia)"
					aria-label="Diagnosis description"
					bind:value={diagnosis.description}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="ICD-10 (e.g. J18.9)"
					aria-label="ICD-10 code"
					bind:value={diagnosis.icd10}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeDiagnosis(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove diagnosis"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addDiagnosis}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add diagnosis
	</button>
</div>
