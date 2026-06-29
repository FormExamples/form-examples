<script lang="ts">
	import type { PriorTestRecord } from '$lib/engine/types';

	let {
		tests = $bindable<PriorTestRecord[]>([])
	}: {
		tests: PriorTestRecord[];
	} = $props();

	function add() {
		tests = [...tests, { testName: '', laboratory: '', testDate: '', resultSummary: '' }];
	}

	function remove(index: number) {
		tests = tests.filter((_, i) => i !== index);
	}
</script>

<div class="space-y-3">
	{#if tests.length === 0}
		<p class="text-sm text-base-content/60">No prior genetic tests recorded.</p>
	{/if}
	{#each tests as test, i (i)}
		<div class="rounded-lg border border-base-300 bg-base-200 p-3">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm font-semibold text-base-content">Prior test #{i + 1}</span>
				<button type="button" onclick={() => remove(i)} class="text-error" aria-label="Remove test">
					Remove
				</button>
			</div>
			<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
				<input type="text" placeholder="Test name (e.g. BRCA1/2 panel)" bind:value={test.testName} class="text-input" />
				<input type="text" placeholder="Laboratory" bind:value={test.laboratory} class="text-input" />
				<input type="date" bind:value={test.testDate} class="date-input" aria-label="Test date" />
			</div>
			<input
				type="text"
				placeholder="Result summary (e.g. No pathogenic variant identified)"
				bind:value={test.resultSummary}
				class="text-input mt-2"
			/>
		</div>
	{/each}

	<button
		type="button"
		onclick={add}
		class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
	>
		+ Add prior test
	</button>
</div>
