<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const x = assessment.data.expectations;
</script>

<Fieldset legend="Step 8 of 9 — Expectations, consent, and safety-netting">
	<p class="hint">
		What the patient hopes for, whether they have consented, and the safety-netting advice given.
	</p>

	<Field
		label="Patient’s expectations / question to the specialist"
		inputId="expectations-patientExpectations"
	>
		<TextAreaInput
			id="expectations-patientExpectations"
			label="Patient’s expectations / question to the specialist"
			rows={2}
			placeholder="What the patient hopes to gain, or a specific question to the specialist."
			bind:value={x.patientExpectations}
		/>
	</Field>

	<Field
		label="Has the patient consented to this referral and to sharing information?"
		description="Consent follows Montgomery v Lanarkshire Health Board (2015)."
		inputId="expectations-consentToShare"
	>
		<Select
			id="expectations-consentToShare"
			label="Has the patient consented to this referral and to sharing information?"
			bind:value={x.consentToShare}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Safety-netting advice" inputId="expectations-safetyNetting">
		<TextAreaInput
			id="expectations-safetyNetting"
			label="Safety-netting advice"
			rows={2}
			placeholder="e.g. Return or call 111 if symptoms worsen before the appointment."
			bind:value={x.safetyNetting}
		/>
	</Field>
</Fieldset>
