<script lang="ts">
	import type { Supplement } from '#lib/engine/types.js';

	let {
		supplements = $bindable<Supplement[]>([]),
		addLabel = 'Add supplement'
	}: {
		supplements: Supplement[];
		addLabel?: string;
	} = $props();

	function addSupplement() {
		supplements = [...supplements, { name: '', dose: '', frequency: '' }];
	}

	function removeSupplement(index: number) {
		supplements = supplements.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each supplements as supp, i}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<input
					type="text"
					placeholder="Name"
					bind:value={supp.name}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Dose"
					bind:value={supp.dose}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Frequency"
					bind:value={supp.frequency}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeSupplement(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove supplement"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addSupplement}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ {addLabel}
	</button>
</div>
