<script lang="ts">
	import type { Specimen } from '#lib/engine/types.js';

	let {
		specimens = $bindable<Specimen[]>([])
	}: {
		specimens: Specimen[];
	} = $props();

	function addSpecimen() {
		specimens = [...specimens, { description: '', site: '', disposition: '' }];
	}

	function removeSpecimen(index: number) {
		specimens = specimens.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each specimens as specimen, i}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<input
					type="text"
					placeholder="Description"
					bind:value={specimen.description}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Site"
					bind:value={specimen.site}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Disposition"
					bind:value={specimen.disposition}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeSpecimen(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove specimen"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addSpecimen}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add specimen
	</button>
</div>
