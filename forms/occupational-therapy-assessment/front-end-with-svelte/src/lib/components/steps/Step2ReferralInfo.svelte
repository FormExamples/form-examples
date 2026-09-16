<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import { DateInput, TextAreaInput, TextInput } from "lily-design-system-svelte-headless";

	const r = assessment.data.referralInfo;
</script>

<Fieldset legend="Referral Information">
	<p class="hint">Details about the referral and primary diagnosis.</p>

	<Field label="Referral Source" required inputId="referralSource">
		<TextInput id="referralSource" label="Referral Source" placeholder="e.g., GP, Hospital, Self-referral" required bind:value={r.referralSource} />
	</Field>

	<Field label="Reason for Referral" inputId="referralReason">
		<TextAreaInput id="referralReason" label="Reason for Referral" rows={3} placeholder="Describe the reason for occupational therapy referral..." bind:value={r.referralReason} />
	</Field>

	<Field label="Referring Clinician" inputId="referringClinician">
		<TextInput id="referringClinician" label="Referring Clinician" placeholder="Name of referring clinician" bind:value={r.referringClinician} />
	</Field>

	<Field label="Referral Date" inputId="referralDate">
		<DateInput id="referralDate" label="Referral Date" bind:value={r.referralDate} />
	</Field>

	<Field label="Primary Diagnosis" required inputId="primaryDiagnosis">
		<TextInput id="primaryDiagnosis" label="Primary Diagnosis" placeholder="e.g., Stroke, Hip fracture, Multiple sclerosis" required bind:value={r.primaryDiagnosis} />
	</Field>
</Fieldset>
