<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const r = assessment.data.reasonForAssessment;
	const reasonOptions = [
		{ value: 'self-referral', label: 'Self-referral' },
		{ value: 'gp-referral', label: 'GP / primary care' },
		{ value: 'employer-referral', label: 'Employer / occupational health' },
		{ value: 'follow-up', label: 'Follow-up appointment' },
		{ value: 'screening', label: 'Routine screening' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Reason for Assessment">
	<p class="hint">Tell us why you are completing this assessment today.</p>

	<Field label="Referral source">
		<RadioGroup label="Referral source">
			{#each reasonOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="reason" value={opt.value} bind:group={r.reason} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if r.reason === 'other'}
		<Field label="Please describe the referral source" inputId="reasonDetails">
			<TextInput id="reasonDetails" label="Referral details" bind:value={r.reasonDetails} />
		</Field>
	{/if}

	<Field label="What is your primary concern?" inputId="primaryConcern">
		<TextAreaInput id="primaryConcern" label="Primary concern" rows={4} bind:value={r.primaryConcern} />
	</Field>

	<Field label="How long have you experienced these symptoms? (weeks)" inputId="symptomDurationWeeks">
		<NumberInput id="symptomDurationWeeks" label="Symptom duration" min={0} max={520} bind:value={r.symptomDurationWeeks} />
	</Field>
</Fieldset>
