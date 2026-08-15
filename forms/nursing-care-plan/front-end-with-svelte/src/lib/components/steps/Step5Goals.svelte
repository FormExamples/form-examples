<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { createDefaultGoal } from '#lib/engine/utils.js';
	import type { Goal } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import ListEditor from '#lib/components/ui/ListEditor.svelte';

	const data = assessment.data;
</script>

<Fieldset legend="Step 5 of 8 — Goals">
	<p class="hint">
		For each problem, record one or more SMART goals (Specific, Measurable, Achievable, Relevant,
		Time-bound), each with a target / review date.
	</p>

	{#if data.problems.length === 0}
		<p class="text-sm text-base-content/60">
			No problems yet. Add a problem in step 4 before setting goals.
		</p>
	{:else}
		<div class="space-y-6">
			{#each data.problems as problem, pIndex (problem.id)}
				<div class="rounded-lg border border-base-300 bg-base-200 p-4">
					<h3 class="mb-3 text-sm font-bold text-base-content">
						Problem {pIndex + 1}: {problem.problemStatement || '(no statement)'}
					</h3>
					<ListEditor
						bind:items={problem.goals}
						factory={createDefaultGoal}
						singular="Goal"
						addLabel="+ Add goal"
						emptyText="No goals for this problem yet."
					>
						{#snippet row(goal: Goal)}
							<label class="list-cell block sm:col-span-2">
								<span class="mb-1 block text-sm font-medium text-base-content/80">SMART goal</span>
								<TextAreaInput
									label="SMART goal"
									rows={2}
									placeholder="e.g. Patient mobilises 10 m with a frame twice daily by 10 Jul"
									bind:value={goal.goalText}
								/>
							</label>
							<label class="list-cell block">
								<span class="mb-1 block text-sm font-medium text-base-content/80">Target / review date</span>
								<TextInput
									label="Target / review date"
									type="date"
									class="date-input"
									bind:value={goal.targetDate}
								/>
							</label>
							<label class="list-cell block">
								<span class="mb-1 block text-sm font-medium text-base-content/80">Met status</span>
								<Select label="Met status" bind:value={goal.met}>
									<option value="">— Select —</option>
									<option value="met">Met</option>
									<option value="partially-met">Partially met</option>
									<option value="not-met">Not met</option>
									<option value="not-evaluated">Not evaluated</option>
								</Select>
							</label>
						{/snippet}
					</ListEditor>
				</div>
			{/each}
		</div>
	{/if}
</Fieldset>
