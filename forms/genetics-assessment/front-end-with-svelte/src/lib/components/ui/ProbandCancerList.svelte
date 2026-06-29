<script lang="ts">
	import type { ProbandCancer } from '$lib/engine/types';

	let {
		cancers = $bindable<ProbandCancer[]>([])
	}: {
		cancers: ProbandCancer[];
	} = $props();

	function add() {
		cancers = [...cancers, { type: '', ageAtDiagnosis: null, bilateral: '', treatment: '' }];
	}

	function remove(index: number) {
		cancers = cancers.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each cancers as cancer, i (i)}
		<div class="rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm font-semibold text-base-content">Cancer #{i + 1}</span>
				<button
					type="button"
					onclick={() => remove(i)}
					class="text-error"
					aria-label="Remove cancer"
				>
					Remove
				</button>
			</div>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
				<input
					type="text"
					placeholder="Type / site"
					bind:value={cancer.type}
					class="text-input"
				/>
				<input
					type="number"
					min="0"
					max="120"
					placeholder="Age at diagnosis"
					bind:value={cancer.ageAtDiagnosis}
					class="number-input"
				/>
				<select bind:value={cancer.bilateral} class="select" aria-label="Bilateral">
					<option value="">Bilateral?</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</select>
			</div>
			<input
				type="text"
				placeholder="Treatment / notes"
				bind:value={cancer.treatment}
				class="text-input mt-2"
			/>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add cancer
	</button>
</div>
