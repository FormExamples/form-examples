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
	import { emptyInvestigationRow } from '#lib/engine/types.js';

	const s = assessment.data.investigations;

	function add() {
		s.rows.push(emptyInvestigationRow());
	}

	function remove(index: number) {
		s.rows.splice(index, 1);
	}
</script>

<Fieldset legend={`Step 6 of ${TOTAL_STEPS} — Investigations reviewed`}>
	<p class="hint">
		One row per result you looked at. An abnormal result left unactioned raises a high-priority flag
		and lifts the acuity band to Escalate.
	</p>

	<Field
		label="No investigations reviewed?"
		description="Yes documents the investigations component as a deliberate negative."
		inputId="investigations-noInvestigationsReviewed"
	>
		<Select
			id="investigations-noInvestigationsReviewed"
			label="No investigations reviewed?"
			bind:value={s.noInvestigationsReviewed}
		>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<p class="label">Investigations ({s.rows.length})</p>
	{#if s.rows.length === 0}
		<p class="hint">No investigations added yet.</p>
	{/if}

	{#each s.rows as row, i (i)}
		<RowCard title="Investigation" index={i} onRemove={() => remove(i)}>
			<Field label="Test name" inputId={`investigations-${i}-testName`}>
				<TextInput
					id={`investigations-${i}-testName`}
					label="Test name"
					placeholder="e.g. C-reactive protein"
					bind:value={row.testName}
				/>
			</Field>

			<Field label="Category" inputId={`investigations-${i}-category`}>
				<Select id={`investigations-${i}-category`} label="Category" bind:value={row.category}>
					<option value="">— Select —</option>
					{#each options.investigationCategory as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Requested" inputId={`investigations-${i}-requestedDate`}>
				<DateInput id={`investigations-${i}-requestedDate`} label="Requested" bind:value={row.requestedDate} />
			</Field>

			<Field label="Resulted" inputId={`investigations-${i}-resultDate`}>
				<DateInput id={`investigations-${i}-resultDate`} label="Resulted" bind:value={row.resultDate} />
			</Field>

			<Field label="Result" inputId={`investigations-${i}-resultSummary`}>
				<TextAreaInput
					id={`investigations-${i}-resultSummary`}
					label="Result"
					rows={2}
					placeholder="e.g. CRP 84, down from 120."
					bind:value={row.resultSummary}
				/>
			</Field>

			<Field label="Abnormal?" inputId={`investigations-${i}-abnormal`}>
				<Select id={`investigations-${i}-abnormal`} label="Abnormal?" bind:value={row.abnormal}>
					<option value="">— Select —</option>
					{#each options.yesNo as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Actioned?" inputId={`investigations-${i}-actioned`}>
				<Select id={`investigations-${i}-actioned`} label="Actioned?" bind:value={row.actioned}>
					<option value="">— Select —</option>
					{#each options.yesNo as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Action taken" inputId={`investigations-${i}-actionTaken`}>
				<TextAreaInput
					id={`investigations-${i}-actionTaken`}
					label="Action taken"
					rows={2}
					bind:value={row.actionTaken}
				/>
			</Field>
		</RowCard>
	{/each}

	<Button data-variant="secondary" onclick={add}>Add an investigation</Button>
</Fieldset>
