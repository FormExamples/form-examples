<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const a = assessment.data.authorisation;
</script>

<Fieldset legend="Applicant's authorisation">
	<p class="hint">Please read the declaration carefully before signing.</p>

	<Alert type="info">
		<p>
			I authorise my doctor(s) and other healthcare professionals who have or
			have had involvement in my care to release reports and medical information
			about me to medical advisers at the DVLA, and I authorise the DVLA's
			medical advisers to share relevant information with my doctor(s).
		</p>
		<p>
			I declare that the information I have given is true and complete to the
			best of my knowledge and belief. I understand that it is a criminal
			offence to make a false declaration to obtain a driving licence.
		</p>
	</Alert>

	<label class="checkbox-row">
		<input type="checkbox" class="checkbox-input" name="declarationAccepted" bind:checked={a.declarationAccepted} />
		<span>I have read and accept the declaration above.</span>
	</label>

	<Field label="Name" required inputId="authName">
		<TextInput id="authName" label="Name" required bind:value={a.name} />
	</Field>
	<Field label="Date" required inputId="authDate">
		<DateInput id="authDate" label="Date" required bind:value={a.signatureDate} />
	</Field>

	<h3 class="step-subhead">Correspondence</h3>
	<Field label="Do you consent to electronic correspondence (email)?" required>
		<RadioGroup label="Electronic correspondence?">
			<label><input type="radio" class="radio-input" name="electronicCorrespondenceConsent" value="yes" bind:group={a.electronicCorrespondenceConsent} required /> Yes</label>
			<label><input type="radio" class="radio-input" name="electronicCorrespondenceConsent" value="no" bind:group={a.electronicCorrespondenceConsent} required /> No</label>
		</RadioGroup>
	</Field>

	{#if a.electronicCorrespondenceConsent === 'yes'}
		<Field label="Contact preference from DVLA" required>
			<RadioGroup label="DVLA contact preference">
				<label><input type="radio" class="radio-input" name="dvlaContactPreference" value="email" bind:group={a.dvlaContactPreference} required /> Email</label>
				<label><input type="radio" class="radio-input" name="dvlaContactPreference" value="sms" bind:group={a.dvlaContactPreference} required /> SMS (Text)</label>
			</RadioGroup>
		</Field>
		<Field label="Contact preference from a healthcare professional on behalf of DVLA" required>
			<RadioGroup label="Healthcare contact preference">
				<label><input type="radio" class="radio-input" name="healthcareContactPreference" value="email" bind:group={a.healthcareContactPreference} required /> Email</label>
				<label><input type="radio" class="radio-input" name="healthcareContactPreference" value="sms" bind:group={a.healthcareContactPreference} required /> SMS (Text)</label>
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>

<style>
	.step-subhead { font-size: 1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
	.checkbox-row {
		display: flex; align-items: flex-start; gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border-strong);
		border-radius: 0.375rem;
		background: var(--color-surface);
		margin: 0 0 0.75rem;
		cursor: pointer;
	}
</style>
