<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const a = assessment.data.adjustments;
</script>

<Fieldset legend="Step 3 of 10 — Reasonable adjustments &amp; communication">
	<p class="hint">
		How the practice will meet the person's communication needs (Accessible Information Standard).
	</p>

	<Field label="Communication needs" inputId="adjustments-communicationNeeds">
		<TextAreaInput
			id="adjustments-communicationNeeds"
			label="Communication needs"
			rows={3}
			placeholder="e.g. Easy-read materials, Makaton, AAC device, longer appointment, quiet room."
			bind:value={a.communicationNeeds}
		/>
	</Field>

	<Field
		label="Reasonable adjustments recorded?"
		description="This is a required component of the check."
		inputId="adjustments-reasonableAdjustmentsRecorded"
	>
		<Select
			id="adjustments-reasonableAdjustmentsRecorded"
			label="Reasonable adjustments recorded?"
			bind:value={a.reasonableAdjustmentsRecorded}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Hospital / health passport in place?" inputId="adjustments-healthPassport">
		<Select
			id="adjustments-healthPassport"
			label="Hospital / health passport in place?"
			bind:value={a.healthPassport}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Consent and mental-capacity note" inputId="adjustments-consentCapacityNote">
		<TextAreaInput
			id="adjustments-consentCapacityNote"
			label="Consent and mental-capacity note"
			rows={3}
			placeholder="Consent obtained, or a best-interests / capacity note where relevant."
			bind:value={a.consentCapacityNote}
		/>
	</Field>
</Fieldset>
