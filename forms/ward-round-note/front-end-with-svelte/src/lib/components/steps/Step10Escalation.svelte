<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const e = assessment.data.escalation;
</script>

<Fieldset legend="Step 10 of 11 — Escalation and discharge">
	<p class="hint">
		Escalation / ceiling-of-care status, senior review, and estimated discharge. Escalation is a
		required component; discharge is recommended.
	</p>

	<Field
		label="Escalation / ceiling-of-care status"
		description='A ceiling-of-care decision prompts a senior review of this entry. "Not recorded" does not document the component.'
		inputId="escalation-escalationStatus"
	>
		<Select id="escalation-escalationStatus" label="Escalation / ceiling-of-care status" bind:value={e.escalationStatus}>
			<option value="">— Select —</option>
			<option value="for-full-escalation">For full escalation</option>
			<option value="ward-level-ceiling">Ward-level ceiling of care</option>
			<option value="dnacpr">DNACPR in place</option>
			<option value="not-recorded">Not recorded</option>
		</Select>
	</Field>

	<Field label="Consultant / senior grade named on this entry?" inputId="escalation-seniorReviewPresent">
		<Select
			id="escalation-seniorReviewPresent"
			label="Consultant / senior grade named on this entry?"
			bind:value={e.seniorReviewPresent}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Estimated discharge date" inputId="escalation-estimatedDischargeDate">
		<TextInput
			id="escalation-estimatedDischargeDate"
			label="Estimated discharge date"
			type="date"
			class="date-input"
			bind:value={e.estimatedDischargeDate}
		/>
	</Field>

	<Field
		label="Discharge date not yet estimable?"
		description="Yes documents the discharge component as a deliberate negative."
		inputId="escalation-dischargeNotEstimable"
	>
		<Select
			id="escalation-dischargeNotEstimable"
			label="Discharge date not yet estimable?"
			bind:value={e.dischargeNotEstimable}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
