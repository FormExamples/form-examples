<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.recommendationReferralPlan;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const riskOptions = [
		{ value: 'low', label: 'Low' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'high', label: 'High' }
	];
</script>

<Fieldset legend="Recommendation & Referral Plan">
	<p class="hint">Clinician-assigned risk and onward referral / testing recommendations.</p>

	<Field label="Clinician-assigned risk level">
		<RadioGroup label="Clinician-assigned risk level">
			{#each riskOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="clinicianAssignedRisk" value={opt.value} bind:group={d.clinicianAssignedRisk} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<h3 class="mt-2 text-sm font-semibold text-base-content">Testing recommendations</h3>
	<Field label="Recommend BRCA1/2 testing?">
		<RadioGroup label="Recommend BRCA1/2 testing?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recommendBRCATesting" value={opt.value} bind:group={d.recommendBRCATesting} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Recommend Lynch syndrome germline panel?">
		<RadioGroup label="Recommend Lynch testing?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recommendLynchTesting" value={opt.value} bind:group={d.recommendLynchTesting} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Recommend MMR IHC / MSI on tumour tissue?">
		<RadioGroup label="Recommend MMR IHC?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recommendMMRIHC" value={opt.value} bind:group={d.recommendMMRIHC} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Recommend broad multigene panel?">
		<RadioGroup label="Recommend panel testing?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recommendPanelTesting" value={opt.value} bind:group={d.recommendPanelTesting} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Recommended panel name(s) (if applicable)" inputId="recommendedPanel">
		<TextInput id="recommendedPanel" label="Recommended panel" placeholder="e.g. Hereditary cancer 36-gene panel" bind:value={d.recommendedPanel} />
	</Field>

	<h3 class="mt-2 text-sm font-semibold text-base-content">Onward referrals</h3>
	<Field label="Refer to clinical genetics?">
		<RadioGroup label="Refer to clinical genetics?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="referClinicalGenetics" value={opt.value} bind:group={d.referClinicalGenetics} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Refer to high-risk breast surveillance?">
		<RadioGroup label="Refer to breast surveillance?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="referBreastSurveillance" value={opt.value} bind:group={d.referBreastSurveillance} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Refer for surveillance colonoscopy?">
		<RadioGroup label="Refer for colonoscopy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="referColonoscopy" value={opt.value} bind:group={d.referColonoscopy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Refer for psychological support?">
		<RadioGroup label="Refer for psychological support?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="referPsychologicalSupport" value={opt.value} bind:group={d.referPsychologicalSupport} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Referral urgency" inputId="referralUrgency">
		<Select id="referralUrgency" label="Referral urgency" bind:value={d.referralUrgency}>
			<option value="">— Select —</option>
			<option value="routine">Routine</option>
			<option value="soon">Soon (within 6 weeks)</option>
			<option value="urgent">Urgent (within 2 weeks)</option>
		</Select>
	</Field>

	<Field label="Clinician summary" inputId="clinicianSummary">
		<TextAreaInput
			id="clinicianSummary"
			label="Clinician summary"
			rows={4}
			placeholder="Free-text summary of the assessment, plan and follow-up…"
			bind:value={d.clinicianSummary}
		/>
	</Field>

	<div class="field-grid-3">
		<Field label="Clinician name" inputId="clinicianName">
			<TextInput id="clinicianName" label="Clinician name" bind:value={d.clinicianName} />
		</Field>
		<Field label="Role" inputId="clinicianRole">
			<TextInput id="clinicianRole" label="Role" placeholder="e.g. Genetic counsellor" bind:value={d.clinicianRole} />
		</Field>
		<Field label="Date" inputId="signatureDate">
			<DateInput id="signatureDate" label="Date" bind:value={d.signatureDate} />
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid-3 {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
