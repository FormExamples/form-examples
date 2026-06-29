<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const d = assessment.data.signoffAcknowledgement;
</script>

<Fieldset legend="Sign-off & Acknowledgement">
	<p class="hint">
		Requesting provider signs the handover; receiving provider acknowledges acceptance on arrival.
	</p>

	<h3 class="subsection-heading">Requesting provider sign-off</h3>
	<div class="field-grid">
		<Field label="Signature (typed full name)" required inputId="requestingProviderSignature">
			<TextInput id="requestingProviderSignature" label="Signature (typed full name)" required bind:value={d.requestingProviderSignature} />
		</Field>
		<Field label="Signature date" required inputId="requestingProviderSignatureDate">
			<DateInput id="requestingProviderSignatureDate" label="Signature date" required bind:value={d.requestingProviderSignatureDate} />
		</Field>
	</div>

	<Alert type="info">
		The fields below are filled in by the receiving provider on arrival. Validation rules for the
		receipt side only fire once any acknowledgement field is filled in (two-party gating).
	</Alert>

	<h3 class="subsection-heading">Receiving provider acknowledgement</h3>
	<Field label="Receiving provider name" inputId="receivingProviderName">
		<TextInput id="receivingProviderName" label="Receiving provider name" bind:value={d.receivingProviderName} />
	</Field>
	<div class="field-grid">
		<Field label="Receiving provider signature (typed full name)" inputId="receivingProviderSignature">
			<TextInput id="receivingProviderSignature" label="Receiving provider signature (typed full name)" bind:value={d.receivingProviderSignature} />
		</Field>
		<Field label="Signature date" inputId="receivingProviderSignatureDate">
			<DateInput id="receivingProviderSignatureDate" label="Signature date" bind:value={d.receivingProviderSignatureDate} />
		</Field>
	</div>
	<Field label="Acknowledgement received" inputId="acknowledgementReceived">
		<label class="checkbox-row">
			<CheckboxInput
				id="acknowledgementReceived"
				label="Acknowledgement received and care accepted"
				bind:checked={d.acknowledgementReceived}
			/>
			<span>Acknowledgement received and care accepted</span>
		</label>
	</Field>
	<Field label="Acknowledgement notes" inputId="acknowledgementNotes">
		<TextAreaInput
			id="acknowledgementNotes"
			label="Acknowledgement notes"
			rows={2}
			placeholder="Any caveats noted by the receiving provider on acceptance."
			bind:value={d.acknowledgementNotes}
		/>
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
	.subsection-heading {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
