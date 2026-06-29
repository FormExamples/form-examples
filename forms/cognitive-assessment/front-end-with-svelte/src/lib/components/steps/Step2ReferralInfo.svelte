<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const r = assessment.data.referralInformation;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const urgencyOptions = [
		{ value: 'routine', label: 'Routine' },
		{ value: 'urgent', label: 'Urgent' },
		{ value: 'emergency', label: 'Emergency' }
	];
</script>

<Fieldset legend="Referral Information">
	<p class="hint">Details about why and by whom the patient was referred.</p>

	<Field label="Referral Source" required inputId="referralSource">
		<Select id="referralSource" label="Referral Source" required bind:value={r.referralSource}>
			<option value="">-- Select --</option>
			<option value="gp">General Practitioner (GP)</option>
			<option value="neurologist">Neurologist</option>
			<option value="psychiatrist">Psychiatrist</option>
			<option value="geriatrician">Geriatrician</option>
			<option value="self">Self-referral</option>
			<option value="family">Family member</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Reason for Referral" required inputId="referralReason">
		<Select id="referralReason" label="Reason for Referral" required bind:value={r.referralReason}>
			<option value="">-- Select --</option>
			<option value="memory-concern">Memory concern</option>
			<option value="confusion">Confusion/disorientation</option>
			<option value="behavioural-change">Behavioural change</option>
			<option value="functional-decline">Functional decline</option>
			<option value="screening">Routine screening</option>
			<option value="follow-up">Follow-up assessment</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Referring Clinician" inputId="referringClinician">
		<TextInput id="referringClinician" label="Referring Clinician" placeholder="Name of referring clinician" bind:value={r.referringClinician} />
	</Field>

	<Field label="Referral Date" inputId="referralDate">
		<DateInput id="referralDate" label="Referral Date" bind:value={r.referralDate} />
	</Field>

	<Field label="Urgency">
		<RadioGroup label="Urgency">
			{#each urgencyOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="urgency" value={opt.value} bind:group={r.urgency} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Has the patient had a previous cognitive assessment?">
		<RadioGroup label="Has the patient had a previous cognitive assessment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousAssessment" value={opt.value} bind:group={r.previousCognitiveAssessment} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.previousCognitiveAssessment === 'yes'}
		<Field label="Previous assessment details (date, score, findings)" inputId="previousAssessmentDetails">
			<TextAreaInput id="previousAssessmentDetails" label="Previous assessment details" rows={3} placeholder="e.g., MMSE 22/30 on 2025-01-15, mild impairment noted..." bind:value={r.previousAssessmentDetails} />
		</Field>
	{/if}
</Fieldset>
