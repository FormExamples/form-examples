<script lang="ts">
	import type { Result, ResultInterpretation } from '$lib/engine/types';

	let {
		results = $bindable<Result[]>([])
	}: {
		results: Result[];
	} = $props();

	const interpretationOptions: { value: ResultInterpretation; label: string }[] = [
		{ value: 'low', label: 'Low' },
		{ value: 'normal', label: 'Normal' },
		{ value: 'high', label: 'High' },
		{ value: 'critical', label: 'Critical' }
	];

	function add() {
		results = [...results, { testName: '', value: '', unit: '', interpretation: '', date: '' }];
	}
	function remove(index: number) {
		results = results.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each results as result, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-5">
				<input type="text" placeholder="Test" bind:value={result.testName} class="text-input" />
				<input type="text" placeholder="Value" bind:value={result.value} class="text-input" />
				<input type="text" placeholder="Unit" bind:value={result.unit} class="text-input" />
				<select bind:value={result.interpretation} class="select" aria-label="Interpretation">
					<option value="">Interpretation</option>
					{#each interpretationOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
				<input type="date" aria-label="Date" bind:value={result.date} class="date-input" />
			</div>
			<button type="button" onclick={() => remove(i)} class="mt-1 text-error" aria-label="Remove result">&times;</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add result
	</button>
</div>
