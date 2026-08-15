<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.plan;
</script>

<Fieldset legend="Step 6 of 7 — Plan (P)">
	<p class="hint">
		What happens next. At least one plan item is required; follow-up is required whenever a plan is
		recorded, and a missing Plan makes the note incomplete.
	</p>

	<Field label="Investigations planned" inputId="plan-investigationsPlan">
		<TextAreaInput
			id="plan-investigationsPlan"
			label="Investigations planned"
			rows={2}
			placeholder="Investigations ordered or requested."
			bind:value={p.investigationsPlan}
		/>
	</Field>

	<Field label="Treatment" inputId="plan-treatmentPlan">
		<TextAreaInput
			id="plan-treatmentPlan"
			label="Treatment"
			rows={2}
			placeholder="Treatment started or advised."
			bind:value={p.treatmentPlan}
		/>
	</Field>

	<Field label="Referrals" inputId="plan-referrals">
		<TextAreaInput
			id="plan-referrals"
			label="Referrals"
			rows={2}
			placeholder="Referrals made or requested."
			bind:value={p.referrals}
		/>
	</Field>

	<Field label="Follow-up / review" inputId="plan-followUp">
		<TextAreaInput
			id="plan-followUp"
			label="Follow-up / review"
			rows={2}
			placeholder="Follow-up or review arrangement."
			bind:value={p.followUp}
		/>
	</Field>

	<Field
		label="Safety-netting advice"
		description="Required when red-flag symptoms are present or the patient is managed at home."
		inputId="plan-safetyNetting"
	>
		<TextAreaInput
			id="plan-safetyNetting"
			label="Safety-netting advice"
			rows={2}
			placeholder="What to look out for, and when and how to seek further help."
			bind:value={p.safetyNetting}
		/>
	</Field>

	<Field
		label="Patient managed at home / discharged?"
		description="Yes makes safety-netting a required component."
		inputId="plan-managedAtHome"
	>
		<Select
			id="plan-managedAtHome"
			label="Patient managed at home / discharged?"
			bind:value={p.managedAtHome}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
