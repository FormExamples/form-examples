<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.managementPlan;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Management Plan">
	<p class="hint">Planned interventions and follow-up.</p>

	<Field label="Non-pharmacological plan in place?">
		<RadioGroup label="Non-pharmacological plan in place?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nonPharmacologicalPlan" value={opt.value} bind:group={p.nonPharmacologicalPlan} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.nonPharmacologicalPlan === 'yes'}
		<Field label="Non-pharmacological details" inputId="nonPharmacologicalDetails">
			<TextAreaInput id="nonPharmacologicalDetails" label="Non-pharmacological details" rows={2} bind:value={p.nonPharmacologicalDetails} />
		</Field>
	{/if}

	<Field label="Environmental modifications planned?">
		<RadioGroup label="Environmental modifications planned?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="environmentalModifications" value={opt.value} bind:group={p.environmentalModifications} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.environmentalModifications === 'yes'}
		<Field label="Environmental modification details" inputId="environmentalModificationDetails">
			<TextAreaInput id="environmentalModificationDetails" label="Environmental modification details" rows={2} bind:value={p.environmentalModificationDetails} />
		</Field>
	{/if}

	<Field label="Medication review required?">
		<RadioGroup label="Medication review required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="medicationReviewRequired" value={opt.value} bind:group={p.medicationReviewRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Referral required?">
		<RadioGroup label="Referral required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="referralRequired" value={opt.value} bind:group={p.referralRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.referralRequired === 'yes'}
		<Field label="Referral details" inputId="referralDetails">
			<TextAreaInput id="referralDetails" label="Referral details" rows={2} bind:value={p.referralDetails} />
		</Field>
	{/if}

	<Field label="Review date" inputId="reviewDate">
		<DateInput id="reviewDate" label="Review date" bind:value={p.reviewDate} />
	</Field>

	<Field label="Plan summary" inputId="planSummary">
		<TextAreaInput id="planSummary" label="Plan summary" rows={3} bind:value={p.planSummary} />
	</Field>
</Fieldset>
