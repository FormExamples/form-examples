<script lang="ts">
	import type { PreviousOperation } from '#lib/engine/types.js';

	let {
		operations = $bindable<PreviousOperation[]>([])
	}: {
		operations: PreviousOperation[];
	} = $props();

	const typeOptions = [
		{ value: 'general', label: 'General' },
		{ value: 'regional', label: 'Regional' },
		{ value: 'sedation', label: 'Sedation' },
		{ value: 'local', label: 'Local' },
		{ value: 'unknown', label: 'Unknown' }
	];

	function addOperation() {
		operations = [...operations, { procedureName: '', year: null, anaesthesiaType: '' }];
	}

	function removeOperation(index: number) {
		operations = operations.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each operations as op, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
				<input
					type="text"
					placeholder="Procedure"
					bind:value={op.procedureName}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<input
					type="number"
					placeholder="Year"
					min="1900"
					max="2100"
					bind:value={op.year}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				/>
				<select
					bind:value={op.anaesthesiaType}
					class="rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
				>
					<option value="">Anaesthesia</option>
					{#each typeOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>
			<button
				type="button"
				onclick={() => removeOperation(i)}
				class="mt-1 text-error hover:text-error"
				aria-label="Remove operation"
			>
				&times;
			</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={addOperation}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add previous operation
	</button>
</div>
