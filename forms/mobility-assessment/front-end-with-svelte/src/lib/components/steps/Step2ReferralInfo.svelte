<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const r = assessment.data.referralInfo;
</script>

<Fieldset legend="Referral Information">
	<p class="hint">Details about the referral for mobility assessment.</p>

	<Field label="Referring Provider" required inputId="referringProvider">
		<TextInput id="referringProvider" label="Referring Provider" required bind:value={r.referringProvider} />
	</Field>
	<Field label="Referral Date" inputId="referralDate">
		<DateInput id="referralDate" label="Referral Date" bind:value={r.referralDate} />
	</Field>
	<Field label="Reason for Referral" inputId="referralReason">
		<TextAreaInput id="referralReason" label="Reason for Referral" rows={3} placeholder="Describe the reason for the mobility assessment referral..." bind:value={r.referralReason} />
	</Field>
	<Field label="Primary Diagnosis" inputId="primaryDiagnosis">
		<TextInput id="primaryDiagnosis" label="Primary Diagnosis" bind:value={r.primaryDiagnosis} />
	</Field>
	<Field label="Secondary Diagnoses" inputId="secondaryDiagnoses">
		<TextAreaInput id="secondaryDiagnoses" label="Secondary Diagnoses" rows={3} placeholder="List any secondary diagnoses..." bind:value={r.secondaryDiagnoses} />
	</Field>
</Fieldset>
