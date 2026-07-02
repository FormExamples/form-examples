<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import LiveStatus from '$lib/components/LiveStatus.svelte';

	const data = assessment.data;
</script>

<Fieldset legend="Step 7 of 8 — Evaluation and review">
	<p class="hint">
		For each problem, record the evaluation of care, the overall goal-met status, and the next
		review date.
	</p>

	{#if data.problems.length === 0}
		<p class="text-sm text-base-content/60">
			No problems yet. Add a problem in step 4 before recording an evaluation.
		</p>
	{:else}
		<div class="space-y-6">
			{#each data.problems as problem, pIndex (problem.id)}
				<div class="rounded-lg border border-base-300 bg-base-200 p-4">
					<h3 class="mb-3 text-sm font-bold text-base-content">
						Problem {pIndex + 1}: {problem.problemStatement || '(no statement)'}
					</h3>
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<label class="block sm:col-span-2">
							<span class="mb-1 block text-sm font-medium text-base-content/80">Evaluation note</span>
							<TextAreaInput
								label="Evaluation note"
								rows={2}
								placeholder="Did the interventions meet the goal? What changed?"
								bind:value={problem.evaluationNote}
							/>
						</label>
						<label class="block">
							<span class="mb-1 block text-sm font-medium text-base-content/80">Overall goal-met status</span>
							<Select label="Overall goal-met status" bind:value={problem.goalMet}>
								<option value="">— Select —</option>
								<option value="met">Met</option>
								<option value="partially-met">Partially met</option>
								<option value="not-met">Not met</option>
								<option value="not-evaluated">Not evaluated</option>
							</Select>
						</label>
						<label class="block">
							<span class="mb-1 block text-sm font-medium text-base-content/80">Next review date</span>
							<TextInput
								label="Next review date"
								type="date"
								class="date-input"
								bind:value={problem.nextReviewDate}
							/>
						</label>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<div class="mt-4">
		<LiveStatus />
	</div>
</Fieldset>
