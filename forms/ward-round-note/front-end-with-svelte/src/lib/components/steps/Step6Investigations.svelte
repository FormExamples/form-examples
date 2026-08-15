<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const inv = assessment.data.investigations;
</script>

<Fieldset legend="Step 6 of 11 — Investigations reviewed">
	<p class="hint">
		Results reviewed today. Required component — record results or select "none outstanding".
	</p>

	<Field label="Investigations and results reviewed" inputId="investigations-investigationsReviewed">
		<TextAreaInput
			id="investigations-investigationsReviewed"
			label="Investigations and results reviewed"
			rows={3}
			placeholder="e.g. Bloods reviewed: CRP 84 (down from 120), Hb 118, U&Es normal. CXR: improving consolidation."
			bind:value={inv.investigationsReviewed}
		/>
	</Field>

	<Field
		label="No investigations outstanding?"
		description="Yes documents the investigations component as a deliberate negative."
		inputId="investigations-noInvestigationsOutstanding"
	>
		<Select
			id="investigations-noInvestigationsOutstanding"
			label="No investigations outstanding?"
			bind:value={inv.noInvestigationsOutstanding}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Abnormal / critical result present?"
		description="Yes raises a flag unless an action is recorded below."
		inputId="investigations-abnormalResultFlagged"
	>
		<Select
			id="investigations-abnormalResultFlagged"
			label="Abnormal / critical result present?"
			bind:value={inv.abnormalResultFlagged}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Abnormal result actioned?" inputId="investigations-abnormalResultActioned">
		<Select
			id="investigations-abnormalResultActioned"
			label="Abnormal result actioned?"
			bind:value={inv.abnormalResultActioned}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
