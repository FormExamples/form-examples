<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.fitnessDecision;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Overall Fitness Decision">
	<p class="hint">Final fitness determination, restrictions, remedial actions, and sign-off.</p>

	<Field label="Overall fitness" inputId="overallFitness">
		<Select id="overallFitness" label="Overall fitness" bind:value={f.overallFitness}>
			<option value="">-- Select --</option>
			<option value="fit-for-duty">Fit for Duty</option>
			<option value="fit-with-restrictions">Fit with Restrictions</option>
			<option value="temporarily-unfit">Temporarily Unfit</option>
			<option value="permanently-unfit">Permanently Unfit</option>
		</Select>
	</Field>

	<Field label="Restrictions details" inputId="restrictionsDetails">
		<TextAreaInput id="restrictionsDetails" label="Restrictions details" rows={3} bind:value={f.restrictionsDetails} />
	</Field>

	<div class="field-grid">
		<Field label="Reassessment required?">
			<RadioGroup label="Reassessment required?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="reassessmentRequired" value={opt.value} bind:group={f.reassessmentRequired} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Reassessment date" inputId="reassessmentDate">
			<DateInput id="reassessmentDate" label="Reassessment date" bind:value={f.reassessmentDate} />
		</Field>
	</div>

	<Field label="Remedial actions" inputId="remedialActions">
		<TextAreaInput id="remedialActions" label="Remedial actions" rows={3} bind:value={f.remedialActions} />
	</Field>

	<Field label="Referrals required" inputId="referralsRequired">
		<TextAreaInput id="referralsRequired" label="Referrals required" rows={3} bind:value={f.referralsRequired} />
	</Field>

	<div class="field-grid">
		<Field label="Assessor name" inputId="assessorName">
			<TextInput id="assessorName" label="Assessor name" bind:value={f.assessorName} />
		</Field>
		<Field label="Assessor role" inputId="assessorRole">
			<TextInput id="assessorRole" label="Assessor role" bind:value={f.assessorRole} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Assessor registration" inputId="assessorRegistration">
			<TextInput id="assessorRegistration" label="Assessor registration" bind:value={f.assessorRegistration} />
		</Field>
		<Field label="Assessment date" inputId="assessmentDate">
			<DateInput id="assessmentDate" label="Assessment date" bind:value={f.assessmentDate} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Countersignature name" inputId="countersignatureName">
			<TextInput id="countersignatureName" label="Countersignature name" bind:value={f.countersignatureName} />
		</Field>
		<Field label="Countersignature date" inputId="countersignatureDate">
			<DateInput id="countersignatureDate" label="Countersignature date" bind:value={f.countersignatureDate} />
		</Field>
	</div>

	<Field label="Fitness decision notes" inputId="fitnessDecisionNotes">
		<TextAreaInput id="fitnessDecisionNotes" label="Fitness decision notes" rows={3} bind:value={f.fitnessDecisionNotes} />
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
