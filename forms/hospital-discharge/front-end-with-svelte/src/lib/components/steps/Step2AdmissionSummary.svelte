<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateLengthOfStay } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const d = assessment.data.admissionSummary;

	const lengthOfStay = $derived(calculateLengthOfStay(d.admissionDate, d.dischargeDate));
</script>

<Fieldset legend="Admission Summary">
	<p class="hint">Dates, ward, consultant, and clinical narrative.</p>

	<div class="field-grid field-grid-3">
		<Field label="Admission Date" required inputId="admissionDate">
			<DateInput id="admissionDate" label="Admission Date" required bind:value={d.admissionDate} />
		</Field>
		<Field label="Discharge Date" required inputId="dischargeDate">
			<DateInput id="dischargeDate" label="Discharge Date" required bind:value={d.dischargeDate} />
		</Field>
		<Field label="Length of stay" description="Auto-calculated">
			{#if lengthOfStay !== null}
				<p class="los-value">{lengthOfStay} <span class="los-unit">day{lengthOfStay === 1 ? '' : 's'}</span></p>
			{:else}
				<p class="los-value los-empty">—</p>
			{/if}
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Ward" inputId="ward">
			<TextInput id="ward" label="Ward" bind:value={d.ward} />
		</Field>
		<Field label="Specialty" inputId="specialty">
			<TextInput id="specialty" label="Specialty" bind:value={d.specialty} placeholder="e.g. General medicine" />
		</Field>
	</div>

	<Field label="Responsible Consultant" required inputId="consultant">
		<TextInput id="consultant" label="Responsible Consultant" required bind:value={d.consultant} />
	</Field>

	<Field label="Reason for admission" required inputId="reasonForAdmission">
		<TextAreaInput
			id="reasonForAdmission"
			label="Reason for admission"
			rows={2}
			bind:value={d.reasonForAdmission}
			placeholder="Why was the patient admitted?"
		/>
	</Field>

	<Field label="Presenting complaint" inputId="presentingComplaint">
		<TextAreaInput id="presentingComplaint" label="Presenting complaint" rows={2} bind:value={d.presentingComplaint} />
	</Field>

	<Field label="Clinical narrative / discharge summary" inputId="clinicalNarrative">
		<TextAreaInput
			id="clinicalNarrative"
			label="Clinical narrative"
			rows={5}
			bind:value={d.clinicalNarrative}
			placeholder="Investigations, treatment, response, and current status…"
		/>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
	.los-value {
		margin: 0;
		font-weight: 500;
	}
	.los-unit {
		color: var(--color-base-content);
		opacity: 0.6;
		font-weight: 400;
	}
	.los-empty {
		color: var(--color-base-content);
		opacity: 0.5;
	}
</style>
