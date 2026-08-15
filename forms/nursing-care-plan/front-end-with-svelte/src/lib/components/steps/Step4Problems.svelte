<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { createDefaultProblem, ADL_CATEGORIES } from '#lib/engine/utils.js';
	import type { Problem } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import ListEditor from '#lib/components/ui/ListEditor.svelte';
	import LiveStatus from '#lib/components/LiveStatus.svelte';

	const data = assessment.data;
</script>

<Fieldset legend="Step 4 of 8 — Problems and needs">
	<p class="hint">
		One row per identified nursing problem or need (assessment + diagnosis). Each problem carries its
		own goals, interventions, and evaluation in the following steps.
	</p>

	<ListEditor
		bind:items={data.problems}
		factory={createDefaultProblem}
		singular="Problem"
		addLabel="+ Add problem / need"
		emptyText="No problems added yet. Add one row per identified nursing problem or need."
	>
		{#snippet row(item: Problem)}
			<label class="list-cell block sm:col-span-2">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Problem / need statement</span>
				<TextInput
					label="Problem / need statement"
					placeholder="e.g. Risk of falls due to unsteady gait"
					bind:value={item.problemStatement}
				/>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Activity of living (RLT)</span>
				<Select label="Activity of living" bind:value={item.adlCategory}>
					<option value="">— Select —</option>
					{#each ADL_CATEGORIES as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Actual or potential</span>
				<Select label="Actual or potential" bind:value={item.actualOrPotential}>
					<option value="">— Select —</option>
					<option value="actual">Actual</option>
					<option value="potential">Potential</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Linked risk assessment</span>
				<Select label="Linked risk assessment" bind:value={item.linkedRisk}>
					<option value="">— Select —</option>
					<option value="none">None</option>
					<option value="falls">Falls</option>
					<option value="pressure-ulcer">Pressure ulcer</option>
					<option value="vte">Venous thromboembolism (VTE)</option>
					<option value="nutrition">Nutrition (MUST)</option>
				</Select>
			</label>
			<label class="list-cell block sm:col-span-2">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Assessment data</span>
				<TextAreaInput
					label="Assessment data"
					rows={2}
					placeholder="What the nurse observed or the patient reported"
					bind:value={item.assessmentData}
				/>
			</label>
		{/snippet}
	</ListEditor>

	<div class="mt-4">
		<LiveStatus />
	</div>
</Fieldset>
