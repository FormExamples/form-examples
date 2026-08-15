<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.clinicalImpression;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Clinical Impression & Management Plan">
	<p class="hint">Working diagnosis, investigations, management, and follow-up.</p>

	<Field label="Working diagnosis" inputId="workingDiagnosis">
		<TextAreaInput id="workingDiagnosis" label="Working diagnosis" rows={2} bind:value={c.workingDiagnosis} />
	</Field>

	<Field label="Differential diagnoses" inputId="differentialDiagnoses">
		<TextAreaInput id="differentialDiagnoses" label="Differential diagnoses" rows={2} bind:value={c.differentialDiagnoses} />
	</Field>

	<Field label="Investigations requested" inputId="investigationsRequested">
		<TextAreaInput id="investigationsRequested" label="Investigations requested" rows={2} bind:value={c.investigationsRequested} />
	</Field>

	<Field label="Management plan" inputId="managementPlan">
		<TextAreaInput id="managementPlan" label="Management plan" rows={3} bind:value={c.managementPlan} />
	</Field>

	<Field label="Follow-up plan" inputId="followUpPlan">
		<TextAreaInput id="followUpPlan" label="Follow-up plan" rows={2} bind:value={c.followUpPlan} />
	</Field>

	<Field label="Referral required">
		<RadioGroup label="Referral required">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="referralRequired" value={opt.value} bind:group={c.referralRequired} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if c.referralRequired === 'yes'}
		<Field label="Referral specialty" inputId="referralSpecialty">
			<TextInput id="referralSpecialty" label="Referral specialty" placeholder="e.g. Pituitary MDT, Diabetes" bind:value={c.referralSpecialty} />
		</Field>
	{/if}

	<Field label="Clinician notes" inputId="clinicianNotes">
		<TextAreaInput id="clinicianNotes" label="Clinician notes" rows={3} bind:value={c.clinicianNotes} />
	</Field>
</Fieldset>
