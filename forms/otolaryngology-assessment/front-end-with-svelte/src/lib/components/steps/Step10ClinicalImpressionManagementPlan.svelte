<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.clinicalImpressionPlan;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Clinical Impression & Management Plan">
	<p class="hint">Diagnosis, investigations, treatment, referral, and follow-up.</p>

	<Field label="Working diagnosis" inputId="workingDiagnosis">
		<TextAreaInput id="workingDiagnosis" label="Working diagnosis" rows={2} bind:value={p.workingDiagnosis} />
	</Field>

	<Field label="Differential diagnosis" inputId="differentialDiagnosis">
		<TextAreaInput id="differentialDiagnosis" label="Differential diagnosis" rows={2} bind:value={p.differentialDiagnosis} />
	</Field>

	<Field label="Investigations required?">
		<RadioGroup label="Investigations required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="investigationsRequired" value={opt.value} bind:group={p.investigationsRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.investigationsRequired === 'yes'}
		<Field label="Investigation details" inputId="investigationsDetails">
			<TextAreaInput id="investigationsDetails" label="Investigation details" rows={2} bind:value={p.investigationsDetails} />
		</Field>
	{/if}

	<Field label="Medication prescribed?">
		<RadioGroup label="Medication prescribed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="medicationPrescribed" value={opt.value} bind:group={p.medicationPrescribed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.medicationPrescribed === 'yes'}
		<Field label="Medication details" inputId="medicationDetails">
			<TextAreaInput id="medicationDetails" label="Medication details" rows={2} bind:value={p.medicationDetails} />
		</Field>
	{/if}

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

	<Field label="Surgery considered?">
		<RadioGroup label="Surgery considered?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="surgeryConsidered" value={opt.value} bind:group={p.surgeryConsidered} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.surgeryConsidered === 'yes'}
		<Field label="Surgery details" inputId="surgeryDetails">
			<TextAreaInput id="surgeryDetails" label="Surgery details" rows={2} bind:value={p.surgeryDetails} />
		</Field>
	{/if}

	<Field label="Follow-up plan" inputId="followUpPlan">
		<TextAreaInput id="followUpPlan" label="Follow-up plan" rows={2} bind:value={p.followUpPlan} />
	</Field>

	<Field label="Patient education" inputId="patientEducation">
		<TextAreaInput id="patientEducation" label="Patient education" rows={2} bind:value={p.patientEducation} />
	</Field>
</Fieldset>
