<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.consentEligibility;
</script>

<Fieldset legend="Consent & Eligibility Decision">
	<p class="hint">Informed consent and the final donor eligibility decision.</p>

	<div class="grid">
		<Field label="Informed Consent Given" inputId="informedConsentGiven">
			<Select id="informedConsentGiven" label="Informed Consent Given" bind:value={d.informedConsentGiven}>
				<option value="">Select…</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</Select>
		</Field>
		<Field label="Consent Form Signed" inputId="consentFormSigned">
			<Select id="consentFormSigned" label="Consent Form Signed" bind:value={d.consentFormSigned}>
				<option value="">Select…</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</Select>
		</Field>
		<Field label="Consent Date" inputId="consentDate">
			<DateInput id="consentDate" label="Consent Date" bind:value={d.consentDate} />
		</Field>
		<Field label="Information Leaflet Provided" inputId="informationLeafletProvided">
			<Select id="informationLeafletProvided" label="Information Leaflet Provided" bind:value={d.informationLeafletProvided}>
				<option value="">Select…</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</Select>
		</Field>
		<Field label="Questions Answered" inputId="questionsAnswered">
			<Select id="questionsAnswered" label="Questions Answered" bind:value={d.questionsAnswered}>
				<option value="">Select…</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</Select>
		</Field>
	</div>

	<div class="grid">
		<Field label="Witness Name" inputId="witnessName">
			<TextInput id="witnessName" label="Witness Name" bind:value={d.witnessName} />
		</Field>
		<Field label="Witness Role" inputId="witnessRole">
			<TextInput id="witnessRole" label="Witness Role" bind:value={d.witnessRole} />
		</Field>
	</div>

	<Field label="Eligibility Decision" inputId="eligibilityDecision">
		<Select id="eligibilityDecision" label="Eligibility Decision" bind:value={d.eligibilityDecision}>
			<option value="">Auto (derive from risk)</option>
			<option value="suitable">Suitable</option>
			<option value="conditionally-suitable">Conditionally suitable</option>
			<option value="unsuitable">Unsuitable</option>
		</Select>
	</Field>

	{#if d.eligibilityDecision === 'conditionally-suitable'}
		<Field label="Eligibility Conditions" inputId="eligibilityConditions">
			<TextAreaInput id="eligibilityConditions" label="Eligibility Conditions" rows={2} bind:value={d.eligibilityConditions} />
		</Field>
	{/if}

	{#if d.eligibilityDecision === 'unsuitable'}
		<div class="grid">
			<Field label="Deferral Reason" inputId="deferralReason">
				<TextInput id="deferralReason" label="Deferral Reason" bind:value={d.deferralReason} />
			</Field>
			<Field label="Deferral Duration" inputId="deferralDuration">
				<Select id="deferralDuration" label="Deferral Duration" bind:value={d.deferralDuration}>
					<option value="">Select…</option>
					<option value="temporary">Temporary</option>
					<option value="permanent">Permanent</option>
				</Select>
			</Field>
		</div>
	{/if}

	<div class="grid grid-3">
		<Field label="Assessor Name" inputId="assessorName">
			<TextInput id="assessorName" label="Assessor Name" bind:value={d.assessorName} />
		</Field>
		<Field label="Assessor Role" inputId="assessorRole">
			<TextInput id="assessorRole" label="Assessor Role" bind:value={d.assessorRole} />
		</Field>
		<Field label="Assessment Date" inputId="assessmentDate">
			<DateInput id="assessmentDate" label="Assessment Date" bind:value={d.assessmentDate} />
		</Field>
	</div>
</Fieldset>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.grid.grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.grid,
		.grid.grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
