<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

	const ack = assessment.data.acknowledgmentSignature;

	// Auto-populate today's date if not yet set
	if (!ack.patientTypedDate) {
		ack.patientTypedDate = new Date().toISOString().slice(0, 10);
	}
</script>

<Fieldset legend="Acknowledgment &amp; Signature">
	<p class="hint">Please confirm you have read and understood the privacy notice.</p>

	<Field label="I have read and agree to the privacy notice" required inputId="agreed">
		<label class="checkbox-row">
			<CheckboxInput
				id="agreed"
				label="I have read, understand, and agree to the above privacy notice."
				required
				bind:checked={ack.agreed}
			/>
			<span>
				I have read, understand, and agree to the above privacy notice. I understand how my
				personal information will be used for medical research, service planning, and quality of
				care purposes.
			</span>
		</label>
	</Field>

	<Field label="Full Name" required inputId="patientTypedFullName">
		<TextInput
			id="patientTypedFullName"
			label="Full Name"
			placeholder="Type your full name"
			required
			bind:value={ack.patientTypedFullName}
		/>
	</Field>

	<Field label="Today's Date" required inputId="patientTypedDate">
		<DateInput
			id="patientTypedDate"
			label="Today's Date"
			required
			bind:value={ack.patientTypedDate}
		/>
	</Field>
</Fieldset>

<style>
	.checkbox-row {
		display: flex;
		gap: 0.625rem;
		align-items: flex-start;
		padding: 0.625rem 0.75rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border-strong);
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 0.9375rem;
		color: var(--color-text);
	}
	.checkbox-row :global(.checkbox-input) {
		margin-top: 0.25rem;
		flex-shrink: 0;
	}
</style>
