<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.clearanceDecision;
</script>

<Fieldset legend="Clearance Decision">
	<p class="hint">
		The clinician's draft clearance. The engine computes a recommended clearance from all the
		answers; this captures the supervising clinician's decision and sign-off.
	</p>

	<Field label="Preferred clearance" inputId="preferredClearance">
		<Select id="preferredClearance" label="Preferred clearance" bind:value={c.preferredClearance}>
			<option value="">— Select —</option>
			<option value="cleared">Cleared</option>
			<option value="conditional">Cleared with Conditions</option>
			<option value="pending">Not Cleared Pending Further Evaluation</option>
			<option value="not-cleared">Not Cleared for Sport</option>
		</Select>
	</Field>

	<Field label="Clearance conditions" inputId="clearanceConditions">
		<TextAreaInput id="clearanceConditions" label="Clearance conditions" rows={2} bind:value={c.clearanceConditions} />
	</Field>

	<Field label="Follow-up required" inputId="followUpRequired">
		<TextAreaInput id="followUpRequired" label="Follow-up required" rows={2} bind:value={c.followUpRequired} />
	</Field>

	<div class="field-grid">
		<Field label="Clinician name" inputId="clinicianName">
			<TextInput id="clinicianName" label="Clinician name" bind:value={c.clinicianName} />
		</Field>
		<Field label="Signature date" inputId="clinicianSignatureDate">
			<DateInput id="clinicianSignatureDate" label="Signature date" bind:value={c.clinicianSignatureDate} />
		</Field>
	</div>

	<Field label="Additional notes" inputId="additionalNotes">
		<TextAreaInput id="additionalNotes" label="Additional notes" rows={3} bind:value={c.additionalNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
