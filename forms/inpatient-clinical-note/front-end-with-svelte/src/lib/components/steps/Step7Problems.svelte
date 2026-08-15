<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import RowCard from '#lib/components/ui/RowCard.svelte';
	import * as options from '#lib/config/options.js';
	import { TOTAL_STEPS } from '#lib/config/steps.js';
	import { emptyProblemRow } from '#lib/engine/types.js';

	const s = assessment.data.problems;

	function add() {
		s.rows.push(emptyProblemRow());
	}

	function remove(index: number) {
		s.rows.splice(index, 1);
	}
</script>

<Fieldset legend={`Step 7 of ${TOTAL_STEPS} — Problem list`}>
	<p class="hint">
		The spine of the problem-oriented record. Required component — at least one problem.
	</p>

	<p class="label">Problems ({s.rows.length})</p>
	{#if s.rows.length === 0}
		<p class="hint">No problems added yet. At least one is required.</p>
	{/if}

	{#each s.rows as row, i (i)}
		<RowCard title="Problem" index={i} onRemove={() => remove(i)}>
			<Field label="Problem" inputId={`problems-${i}-problem`}>
				<TextInput
					id={`problems-${i}-problem`}
					label="Problem"
					placeholder="e.g. Community-acquired pneumonia"
					bind:value={row.problem}
				/>
			</Field>

			<Field label="Category" inputId={`problems-${i}-category`}>
				<Select id={`problems-${i}-category`} label="Category" bind:value={row.category}>
					<option value="">— Select —</option>
					{#each options.problemCategory as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Status" inputId={`problems-${i}-status`}>
				<Select id={`problems-${i}-status`} label="Status" bind:value={row.status}>
					<option value="">— Select —</option>
					{#each options.problemStatus as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Priority" inputId={`problems-${i}-priority`}>
				<Select id={`problems-${i}-priority`} label="Priority" bind:value={row.priority}>
					<option value="">— Select —</option>
					{#each options.priority as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Onset" inputId={`problems-${i}-onsetDate`}>
				<DateInput id={`problems-${i}-onsetDate`} label="Onset" bind:value={row.onsetDate} />
			</Field>

			<Field label="Progress" inputId={`problems-${i}-progressCommentary`}>
				<TextAreaInput
					id={`problems-${i}-progressCommentary`}
					label="Progress"
					rows={2}
					placeholder="Progress since the previous note."
					bind:value={row.progressCommentary}
				/>
			</Field>
		</RowCard>
	{/each}

	<Button data-variant="secondary" onclick={add}>Add a problem</Button>
</Fieldset>
