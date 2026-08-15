<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.reviewCarePlan;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Review & Care Plan">
	<p class="hint">Complete the review with care plan details and follow-up arrangements.</p>

	<div class="field-grid">
		<Field label="Clinician Name" inputId="clinicianName">
			<TextInput id="clinicianName" label="Clinician Name" placeholder="e.g. Dr Johnson" bind:value={d.clinicianName} />
		</Field>
		<Field label="Review Date" inputId="reviewDate">
			<DateInput id="reviewDate" label="Review Date" bind:value={d.reviewDate} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Agreed HbA1c Target" inputId="hba1cTargetAgreed">
			<NumberInput id="hba1cTargetAgreed" label="Agreed HbA1c Target" step={0.1} min={0} placeholder="e.g. 53 mmol/mol or 7.0%" bind:value={d.hba1cTargetAgreed} />
		</Field>
		<Field label="Care Plan Updated">
			<RadioGroup label="Care Plan Updated">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="carePlanUpdated" value={opt.value} bind:group={d.carePlanUpdated} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<Field label="Clinical Notes" inputId="clinicalNotes">
		<TextAreaInput id="clinicalNotes" label="Clinical Notes" rows={4} placeholder="Summary of clinical findings and discussion" bind:value={d.clinicalNotes} />
	</Field>

	<Field label="Referrals Made" inputId="referrals">
		<TextAreaInput id="referrals" label="Referrals Made" rows={3} placeholder="e.g. Ophthalmology, Podiatry, Dietetics, Psychology" bind:value={d.referrals} />
	</Field>

	<Field label="Next Review Date" inputId="nextReviewDate">
		<DateInput id="nextReviewDate" label="Next Review Date" bind:value={d.nextReviewDate} />
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
