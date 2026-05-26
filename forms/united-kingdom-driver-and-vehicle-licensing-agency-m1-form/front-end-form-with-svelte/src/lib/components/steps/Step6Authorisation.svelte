<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import YesNoQuestion from '$lib/components/ui/YesNoQuestion.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const a = assessment.data.authorisation;
</script>

<Fieldset legend="Applicant's Authorisation">
	<p class="hint">Declaration authorising medical disclosure and contact preferences.</p>

	<Alert type="info">
		<p>
			I authorise the release of medical reports and information to the Drivers
			Medical Group, DVLA, by my doctor(s) or those mentioned on this form, in
			strict confidence, to enable the DVLA to assess my fitness to drive. I
			understand that making a false declaration to obtain a driving licence is
			a criminal offence under section 174 of the Road Traffic Act 1988.
		</p>
	</Alert>

	<YesNoQuestion
		label="I confirm the declaration above"
		name="declarationConfirmed"
		bind:value={a.declarationConfirmed}
		required
	/>

	<div class="field-grid">
		<Field label="Name (printed)" required inputId="signatoryName">
			<TextInput id="signatoryName" label="Name (printed)" required bind:value={a.signatoryName} />
		</Field>
		<Field label="Signature (typed)" inputId="signatureText">
			<TextInput id="signatureText" label="Signature (typed)" bind:value={a.signatureText} />
		</Field>
	</div>

	<Field label="Date" required inputId="signatureDate">
		<DateInput id="signatureDate" label="Date" required bind:value={a.signatureDate} />
	</Field>

	<YesNoQuestion
		label="Do you consent to electronic correspondence (email) from the DVLA?"
		name="electronicCorrespondenceConsent"
		bind:value={a.electronicCorrespondenceConsent}
	/>

	<Field label="Preferred contact method from the DVLA">
		<RadioGroup label="DVLA contact preference">
			<label>
				<input type="radio" class="radio-input" name="dvlaContactPreference" value="email" bind:group={a.dvlaContactPreference} />
				Email
			</label>
			<label>
				<input type="radio" class="radio-input" name="dvlaContactPreference" value="sms" bind:group={a.dvlaContactPreference} />
				SMS (Text)
			</label>
		</RadioGroup>
	</Field>

	<Field label="Preferred contact method from your healthcare professional on behalf of the DVLA">
		<RadioGroup label="Healthcare professional contact preference">
			<label>
				<input type="radio" class="radio-input" name="hcpContactPreference" value="email" bind:group={a.healthcareProfessionalContactPreference} />
				Email
			</label>
			<label>
				<input type="radio" class="radio-input" name="hcpContactPreference" value="sms" bind:group={a.healthcareProfessionalContactPreference} />
				SMS (Text)
			</label>
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid { grid-template-columns: 1fr; }
	}
</style>
