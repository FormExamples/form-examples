<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.eligibilityAllocation;
</script>

<Fieldset legend="10. Eligibility & Allocation Decision">
	<p class="hint">Final assessor decision and (if suitable) organ allocation details.</p>

	<Field label="Eligibility decision" inputId="eligibilityDecision">
		<Select id="eligibilityDecision" label="Eligibility decision" bind:value={d.eligibilityDecision}>
			<option value="">-- Select --</option>
			<option value="suitable">Suitable</option>
			<option value="conditionally-suitable">Conditionally suitable</option>
			<option value="unsuitable">Unsuitable</option>
		</Select>
	</Field>

	{#if d.eligibilityDecision === 'conditionally-suitable'}
		<Field label="Eligibility conditions" inputId="eligibilityConditions">
			<TextAreaInput id="eligibilityConditions" label="Eligibility conditions" rows={2} placeholder="Conditions to satisfy before final clearance…" bind:value={d.eligibilityConditions} />
		</Field>
	{/if}

	{#if d.eligibilityDecision === 'unsuitable'}
		<Field label="Deferral reason" inputId="deferralReason">
			<TextAreaInput id="deferralReason" label="Deferral reason" rows={2} placeholder="Reason donor is unsuitable…" bind:value={d.deferralReason} />
		</Field>
		<Field label="Deferral duration" inputId="deferralDuration">
			<Select id="deferralDuration" label="Deferral duration" bind:value={d.deferralDuration}>
				<option value="">-- Select --</option>
				<option value="temporary">Temporary</option>
				<option value="permanent">Permanent</option>
			</Select>
		</Field>
	{/if}

	<Field label="Allocated organs" inputId="allocatedOrgans">
		<TextAreaInput id="allocatedOrgans" label="Allocated organs" rows={2} placeholder="e.g. left kidney, liver lobe…" bind:value={d.allocatedOrgans} />
	</Field>

	<Field label="Intended recipient centre" inputId="intendedRecipientCentre">
		<TextInput id="intendedRecipientCentre" label="Intended recipient centre" placeholder="Transplant centre / unit" bind:value={d.intendedRecipientCentre} />
	</Field>

	<div class="field-grid">
		<Field label="Assessor name" inputId="assessorName">
			<TextInput id="assessorName" label="Assessor name" bind:value={d.assessorName} />
		</Field>
		<Field label="Assessor role" inputId="assessorRole">
			<TextInput id="assessorRole" label="Assessor role" bind:value={d.assessorRole} />
		</Field>
	</div>

	<Field label="Assessment date" inputId="assessmentDate">
		<DateInput id="assessmentDate" label="Assessment date" bind:value={d.assessmentDate} />
	</Field>

	<Field label="Additional notes" inputId="additionalNotes">
		<TextAreaInput id="additionalNotes" label="Additional notes" rows={3} placeholder="Any additional clinical or administrative notes…" bind:value={d.additionalNotes} />
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
