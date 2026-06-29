<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.screeningPurpose;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Screening Purpose">
	<p class="hint">Reason for this autism screening assessment.</p>

	<Field label="Referral Source" required inputId="referralSource">
		<Select id="referralSource" label="Referral source" required bind:value={s.referralSource}>
			<option value="">— Select —</option>
			<option value="self">Self-referral</option>
			<option value="gp">GP / Primary care</option>
			<option value="school">School / Education</option>
			<option value="employer">Employer / Occupational health</option>
			<option value="family">Family member</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	{#if s.referralSource === 'other'}
		<Field label="Other referral source" inputId="referralSourceOther">
			<TextInput id="referralSourceOther" label="Other referral source" bind:value={s.referralSourceOther} />
		</Field>
	{/if}

	<Field label="Reason for screening" inputId="reasonForScreening">
		<TextAreaInput id="reasonForScreening" label="Reason for screening" rows={3} bind:value={s.reasonForScreening} />
	</Field>

	<Field label="Have there been any previous autism assessments?" required>
		<RadioGroup label="Previous assessments">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousAssessments" value={opt.value} bind:group={s.previousAssessments} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.previousAssessments === 'yes'}
		<Field label="Previous assessment details" inputId="previousAssessmentDetails">
			<TextAreaInput id="previousAssessmentDetails" label="Previous assessment details" rows={3} bind:value={s.previousAssessmentDetails} />
		</Field>
	{/if}
</Fieldset>
