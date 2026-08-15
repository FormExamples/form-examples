<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const m = assessment.data.medication;
	// STOMP fields are only relevant when a psychotropic is prescribed.
	const showStomp = $derived(m.psychotropicPrescribed === 'yes');
</script>

<Fieldset legend="Step 6 of 10 — Medication review incl. STOMP">
	<p class="hint">
		Reconcile the medication list and review psychotropic medicines under STOMP (Stopping
		Over-Medication with Psychotropics).
	</p>

	<Field
		label="Medication list reconciled at the check?"
		description="This is the required medication-review component."
		inputId="medication-medicationReconciled"
	>
		<Select
			id="medication-medicationReconciled"
			label="Medication list reconciled at the check?"
			bind:value={m.medicationReconciled}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Any psychotropic medicine prescribed?"
		inputId="medication-psychotropicPrescribed"
	>
		<Select
			id="medication-psychotropicPrescribed"
			label="Any psychotropic medicine prescribed?"
			bind:value={m.psychotropicPrescribed}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	{#if showStomp}
		<Field
			label="Documented indication for the psychotropic"
			inputId="medication-psychotropicIndication"
		>
			<TextAreaInput
				id="medication-psychotropicIndication"
				label="Documented indication for the psychotropic"
				rows={2}
				placeholder="The clinical reason the medicine is prescribed."
				bind:value={m.psychotropicIndication}
			/>
		</Field>

		<Field
			label="Psychotropic last reviewed"
			description="Date the psychotropic medicine was last reviewed."
			inputId="medication-psychotropicLastReviewed"
		>
			<DateInput
				id="medication-psychotropicLastReviewed"
				label="Psychotropic last reviewed"
				bind:value={m.psychotropicLastReviewed}
			/>
		</Field>

		<Field
			label="STOMP discussed with the person / carer?"
			inputId="medication-stompDiscussed"
		>
			<Select
				id="medication-stompDiscussed"
				label="STOMP discussed with the person / carer?"
				bind:value={m.stompDiscussed}
			>
				<option value="">— Select —</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
				<option value="not-applicable">Not applicable</option>
			</Select>
		</Field>
	{/if}

	<Field label="Side effects reviewed" inputId="medication-medicationSideEffects">
		<TextAreaInput
			id="medication-medicationSideEffects"
			label="Side effects reviewed"
			rows={2}
			placeholder="Side effects checked and any action taken."
			bind:value={m.medicationSideEffects}
		/>
	</Field>
</Fieldset>
