<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.clinicalImpressionCarePlan;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Clinical Impression & Care Plan">
	<p class="hint">Synthesis: working diagnosis, plan, dressings, referrals, and follow-up.</p>

	<Field label="Clinical impression / working diagnosis" inputId="clinicalImpression">
		<TextAreaInput id="clinicalImpression" label="Clinical impression" rows={3} placeholder="Most likely diagnosis based on findings…" bind:value={d.clinicalImpression} />
	</Field>

	<Field label="Differential diagnoses" inputId="differentialDiagnoses">
		<TextAreaInput id="differentialDiagnoses" label="Differential diagnoses" rows={2} placeholder="Other possibilities to consider…" bind:value={d.differentialDiagnoses} />
	</Field>

	<Field label="Care plan" inputId="carePlan">
		<TextAreaInput id="carePlan" label="Care plan" rows={4} placeholder="Pressure-redistribution, repositioning schedule, skin-care regimen, education…" bind:value={d.carePlan} />
	</Field>

	<Field label="Dressing required?">
		<RadioGroup label="Dressing required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dressingRequired" value={opt.value} bind:group={d.dressingRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.dressingRequired === 'yes'}
		<Field label="Dressing type / regimen" inputId="dressingType">
			<TextInput id="dressingType" label="Dressing type" placeholder="e.g. Hydrocolloid, foam, alginate" bind:value={d.dressingType} />
		</Field>
	{/if}

	<Field label="Pressure-relief equipment required?">
		<RadioGroup label="Pressure-relief equipment required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pressureReliefRequired" value={opt.value} bind:group={d.pressureReliefRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Onward referral required?">
		<RadioGroup label="Onward referral required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="referralRequired" value={opt.value} bind:group={d.referralRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.referralRequired === 'yes'}
		<Field label="Referral details" inputId="referralDetails">
			<TextInput id="referralDetails" label="Referral details" placeholder="e.g. Tissue-viability nurse, dermatology, vascular" bind:value={d.referralDetails} />
		</Field>
	{/if}

	<Field label="Follow-up date" inputId="followUpDate">
		<DateInput id="followUpDate" label="Follow-up date" bind:value={d.followUpDate} />
	</Field>

	<Field label="Assessing clinician" inputId="clinicianName">
		<TextInput id="clinicianName" label="Assessing clinician" placeholder="Full name and role" bind:value={d.clinicianName} />
	</Field>
</Fieldset>
