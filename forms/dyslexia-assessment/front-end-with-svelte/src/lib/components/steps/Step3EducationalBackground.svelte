<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioField from './RadioField.svelte';

	const d = assessment.data.educationalBackground;

	const yesNoUnsure = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unsure', label: 'Unsure' }
	];
</script>

<Fieldset legend="Section 3 of 10 · Educational Background">
	<p class="hint">School history, attendance, and prior assessments.</p>

	<Field label="School type" inputId="schoolType">
		<Select id="schoolType" label="School type" bind:value={d.schoolType}>
			<option value="">— Select —</option>
			<option value="state-primary">State primary</option>
			<option value="state-secondary">State secondary</option>
			<option value="independent">Independent</option>
			<option value="special">Special school</option>
			<option value="home-educated">Home educated</option>
			<option value="further-education">Further education</option>
			<option value="higher-education">Higher education</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Current year group / class" inputId="currentYearGroup">
		<TextInput id="currentYearGroup" label="Current year group / class" bind:value={d.currentYearGroup} />
	</Field>

	<RadioField label="Has the pupil changed schools?" name="schoolChanges" options={yesNoUnsure} bind:value={d.schoolChanges} />
	{#if d.schoolChanges === 'yes'}
		<Field label="Number of school changes" inputId="schoolChangeCount">
			<NumberInput id="schoolChangeCount" label="Number of school changes" min={0} max={50} bind:value={d.schoolChangeCount} />
		</Field>
	{/if}

	<RadioField label="Are there attendance issues?" name="attendanceIssues" options={yesNoUnsure} bind:value={d.attendanceIssues} />
	{#if d.attendanceIssues === 'yes'}
		<Field label="Attendance details" inputId="attendanceDetails">
			<TextAreaInput id="attendanceDetails" label="Attendance details" rows={2} bind:value={d.attendanceDetails} />
		</Field>
	{/if}

	<RadioField label="Is the pupil an English-as-a-second-language (ESL/EAL) learner?" name="eslLearner" options={yesNoUnsure} bind:value={d.eslLearner} />

	<Field label="Academic strengths" inputId="academicStrengths">
		<TextAreaInput id="academicStrengths" label="Academic strengths" rows={2} bind:value={d.academicStrengths} />
	</Field>
	<Field label="Academic weaknesses" inputId="academicWeaknesses">
		<TextAreaInput id="academicWeaknesses" label="Academic weaknesses" rows={2} bind:value={d.academicWeaknesses} />
	</Field>

	<RadioField label="Have there been previous formal assessments?" name="previousAssessments" options={yesNoUnsure} bind:value={d.previousAssessments} />
	{#if d.previousAssessments === 'yes'}
		<Field label="Previous assessment details" inputId="previousAssessmentDetails">
			<TextAreaInput id="previousAssessmentDetails" label="Previous assessment details" rows={3} bind:value={d.previousAssessmentDetails} />
		</Field>
	{/if}
</Fieldset>
