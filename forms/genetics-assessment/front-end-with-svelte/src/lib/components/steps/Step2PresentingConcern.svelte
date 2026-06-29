<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.presentingConcern;
</script>

<Fieldset legend="Presenting Concern">
	<p class="hint">Why is the patient being seen in genetics today?</p>

	<Field label="Chief concern (in patient's own words)" inputId="chiefConcern">
		<TextAreaInput
			id="chiefConcern"
			label="Chief concern"
			rows={2}
			placeholder={'e.g. "My mother had ovarian cancer at 47 and I want to know my risk."'}
			bind:value={d.chiefConcern}
		/>
	</Field>

	<Field label="Reason for referral (clinician)" inputId="referralReason">
		<TextAreaInput id="referralReason" label="Reason for referral" rows={2} bind:value={d.referralReason} />
	</Field>

	<div class="field-grid">
		<Field label="Referring clinician" inputId="referringClinician">
			<TextInput id="referringClinician" label="Referring clinician" bind:value={d.referringClinician} />
		</Field>
		<Field label="Urgency" inputId="urgency">
			<Select id="urgency" label="Urgency" bind:value={d.urgency}>
				<option value="">— Select —</option>
				<option value="routine">Routine</option>
				<option value="soon">Soon (within 6 weeks)</option>
				<option value="urgent">Urgent (within 2 weeks)</option>
			</Select>
		</Field>
	</div>

	<Field
		label="Suspected syndrome (if any)"
		description="Leave blank if no syndrome is currently suspected."
		inputId="suspectedSyndrome"
	>
		<TextInput
			id="suspectedSyndrome"
			label="Suspected syndrome"
			placeholder="e.g. HBOC, Lynch, Li-Fraumeni, FAP, etc."
			bind:value={d.suspectedSyndrome}
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
</style>
