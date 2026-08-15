<script lang="ts">
	import type { RelativeCancer } from '#lib/engine/types.js';

	let {
		cancers = $bindable<RelativeCancer[]>([])
	}: {
		cancers: RelativeCancer[];
	} = $props();

	function add() {
		cancers = [...cancers, { type: '', ageAtDiagnosis: null }];
	}

	function remove(index: number) {
		cancers = cancers.filter((_, i) => i !== index);
	}
</script>

<div class="mt-2 space-y-2">
	{#each cancers as cancer, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-2">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
				<input
					type="text"
					placeholder="Cancer type (e.g. Breast)"
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
			</div>
			<button
				type="button"
				onclick={() => remove(i)}
				class="mt-1 text-error"
				aria-label="Remove cancer"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		class="rounded-lg border-2 border-dashed border-base-300 px-3 py-1.5 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add cancer to this relative
	</button>
</div>
