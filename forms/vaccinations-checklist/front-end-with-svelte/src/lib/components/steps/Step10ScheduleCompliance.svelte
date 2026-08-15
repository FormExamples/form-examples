<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.scheduleCompliance;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Schedule & Compliance">
	<p class="hint">Outstanding vaccines, clearance, exposure risk, and consent.</p>

	<Field label="Clinician compliance status" inputId="complianceStatus">
		<Select id="complianceStatus" label="Clinician compliance status" bind:value={s.complianceStatus}>
			<option value="">-- Select (engine derives if blank) --</option>
			<option value="fully-immunised">Fully immunised</option>
			<option value="partially-immunised">Partially immunised</option>
			<option value="non-compliant">Non-compliant</option>
			<option value="contraindicated">Contraindicated</option>
		</Select>
	</Field>

	<Field label="Vaccines due" inputId="vaccinesDue">
		<TextInput id="vaccinesDue" label="Vaccines due" bind:value={s.vaccinesDue} />
	</Field>
	<Field label="Vaccines overdue" inputId="vaccinesOverdue">
		<TextInput id="vaccinesOverdue" label="Vaccines overdue" bind:value={s.vaccinesOverdue} />
	</Field>

	<Field label="Catch-up plan required?">
		<RadioGroup label="Catch-up plan required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="catchUp" value={opt.value} bind:group={s.catchUpPlanRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.catchUpPlanRequired === 'yes'}
		<Field label="Catch-up plan details" inputId="catchUpDetails">
			<TextAreaInput id="catchUpDetails" label="Catch-up plan details" rows={2} bind:value={s.catchUpPlanDetails} />
		</Field>
	{/if}

	<div class="field-grid">
		<Field label="Next vaccination date" inputId="nextDate">
			<DateInput id="nextDate" label="Next vaccination date" bind:value={s.nextVaccinationDate} />
		</Field>
		<Field label="Next vaccination type" inputId="nextType">
			<TextInput id="nextType" label="Next vaccination type" bind:value={s.nextVaccinationType} />
		</Field>
	</div>

	<Field label="Occupational health clearance" inputId="ohClearance">
		<Select id="ohClearance" label="Occupational health clearance" bind:value={s.occupationalHealthClearance}>
			<option value="">-- Select --</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="pending">Pending</option>
		</Select>
	</Field>
	{#if s.occupationalHealthClearance === 'yes'}
		<Field label="Clearance date" inputId="ohClearanceDate">
			<DateInput id="ohClearanceDate" label="Clearance date" bind:value={s.occupationalHealthClearanceDate} />
		</Field>
	{/if}

	<Field label="Exposure risk level" inputId="exposureRisk">
		<Select id="exposureRisk" label="Exposure risk level" bind:value={s.exposureRiskLevel}>
			<option value="">-- Select --</option>
			<option value="low">Low</option>
			<option value="moderate">Moderate</option>
			<option value="high">High</option>
			<option value="critical">Critical</option>
		</Select>
	</Field>

	<Field label="Active exposure incident?">
		<RadioGroup label="Active exposure incident?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="activeExposure" value={opt.value} bind:group={s.activeExposureIncident} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.activeExposureIncident === 'yes'}
		<Field label="Exposure details" inputId="exposureDetails">
			<TextAreaInput id="exposureDetails" label="Exposure details" rows={2} bind:value={s.activeExposureDetails} />
		</Field>
	{/if}

	<Field label="Consent for vaccination?">
		<RadioGroup label="Consent for vaccination?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consent" value={opt.value} bind:group={s.consentForVaccination} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.consentForVaccination === 'yes'}
		<Field label="Consent date" inputId="consentDate">
			<DateInput id="consentDate" label="Consent date" bind:value={s.consentDate} />
		</Field>
	{/if}

	<Field label="Notes" inputId="scheduleNotes">
		<TextAreaInput id="scheduleNotes" label="Notes" rows={2} bind:value={s.notes} />
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
