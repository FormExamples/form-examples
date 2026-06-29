<script lang="ts">
	import type { Problem, ProblemStatus } from '$lib/engine/types';

	let {
		problems = $bindable<Problem[]>([])
	}: {
		problems: Problem[];
	} = $props();

	const statusOptions: { value: ProblemStatus; label: string }[] = [
		{ value: 'active', label: 'Active' },
		{ value: 'inactive', label: 'Inactive' },
		{ value: 'resolved', label: 'Resolved' }
	];

	function add() {
		problems = [...problems, { description: '', icd10Code: '', onsetDate: '', status: '' }];
	}
	function remove(index: number) {
		problems = problems.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#each problems as problem, i (i)}
		<div class="flex items-start gap-2 rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-4">
				<input type="text" placeholder="Description" bind:value={problem.description} class="text-input" />
				<input type="text" placeholder="ICD-10 code" bind:value={problem.icd10Code} class="text-input" />
				<input type="date" aria-label="Onset date" bind:value={problem.onsetDate} class="date-input" />
				<select bind:value={problem.status} class="select" aria-label="Status">
					<option value="">Status</option>
					{#each statusOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>
			<button type="button" onclick={() => remove(i)} class="mt-1 text-error" aria-label="Remove problem">&times;</button>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add problem
	</button>
</div>
