<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { createDefaultIntervention } from '#lib/engine/utils.js';
	import type { Intervention } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import ListEditor from '#lib/components/ui/ListEditor.svelte';

	const data = assessment.data;
</script>

<Fieldset legend="Step 6 of 8 — Interventions">
	<p class="hint">
		For each problem, record one or more planned nursing interventions and whether each was carried
		out.
	</p>

	{#if data.problems.length === 0}
		<p class="text-sm text-base-content/60">
			No problems yet. Add a problem in step 4 before planning interventions.
		</p>
	{:else}
		<div class="space-y-6">
			{#each data.problems as problem, pIndex (problem.id)}
				<div class="rounded-lg border border-base-300 bg-base-200 p-4">
					<h3 class="mb-3 text-sm font-bold text-base-content">
						Problem {pIndex + 1}: {problem.problemStatement || '(no statement)'}
					</h3>
					<ListEditor
						bind:items={problem.interventions}
						factory={createDefaultIntervention}
						singular="Intervention"
						addLabel="+ Add intervention"
						emptyText="No interventions for this problem yet."
					>
						{#snippet row(intervention: Intervention)}
							<label class="list-cell block sm:col-span-2">
								<span class="mb-1 block text-sm font-medium text-base-content/80">Planned intervention</span>
								<TextAreaInput
									label="Planned intervention"
									rows={2}
									placeholder="e.g. Assist with mobilisation twice daily using a frame"
									bind:value={intervention.interventionText}
								/>
							</label>
							<label class="list-cell block">
								<span class="mb-1 block text-sm font-medium text-base-content/80">Carried out?</span>
								<Select label="Carried out" bind:value={intervention.carriedOut}>
									<option value="">— Select —</option>
									<option value="yes">Carried out</option>
									<option value="partial">Partially carried out</option>
									<option value="no">Not carried out</option>
								</Select>
							</label>
						{/snippet}
					</ListEditor>
				</div>
			{/each}
		</div>
	{/if}
</Fieldset>
