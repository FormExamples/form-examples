<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.assessment;
</script>

<Fieldset legend="Step 8 of 8 — Impression, red flags and plan">
	<p class="hint">
		Required components — the working impression and the management plan. A red-flag finding without
		a plan is flagged. An impression and a plan are both blocking requirements.
	</p>

	<Field label="Impression / problem list" inputId="assessment-impression">
		<TextAreaInput
			id="assessment-impression"
			label="Impression / problem list"
			rows={4}
			placeholder="Working impression, differential diagnoses, numbered problem list."
			bind:value={a.impression}
		/>
	</Field>

	<Field label="Red-flag findings" inputId="assessment-redFlagFindings">
		<TextAreaInput
			id="assessment-redFlagFindings"
			label="Red-flag findings"
			rows={2}
			placeholder="Any red-flag examination or history findings. A red flag without a plan is flagged."
			bind:value={a.redFlagFindings}
		/>
	</Field>

	<Field label="Management plan" inputId="assessment-managementPlan">
		<TextAreaInput
			id="assessment-managementPlan"
			label="Management plan"
			rows={5}
			placeholder="Investigations, treatment, referrals, escalation / monitoring plan, disposition."
			bind:value={a.managementPlan}
		/>
	</Field>

	<Field label="Clinical note" inputId="assessment-clinicalNote">
		<TextAreaInput
			id="assessment-clinicalNote"
			label="Clinical note"
			rows={3}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={a.clinicalNote}
		/>
	</Field>
</Fieldset>
