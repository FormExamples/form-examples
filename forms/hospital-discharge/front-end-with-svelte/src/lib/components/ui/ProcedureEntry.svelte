<script lang="ts">
	import type { Procedure } from '#lib/engine/types.js';

	let {
		procedures = $bindable<Procedure[]>([])
	}: {
		procedures: Procedure[];
	} = $props();

	function addProcedure() {
		procedures = [...procedures, { description: '', opcs4: '', date: '', performedBy: '' }];
	}

	function removeProcedure(index: number) {
		procedures = procedures.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each procedures as procedure, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
				<input
					type="text"
					placeholder="Description (e.g. Chest drain insertion)"
					aria-label="Procedure description"
					bind:value={procedure.description}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="OPCS-4 (e.g. T12.4)"
					aria-label="OPCS-4 code"
					bind:value={procedure.opcs4}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="date"
					aria-label="Procedure date"
					bind:value={procedure.date}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Performed by"
					aria-label="Performed by"
					bind:value={procedure.performedBy}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<button
				type="button"
				onclick={() => removeProcedure(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove procedure"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addProcedure}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add procedure
	</button>
</div>
