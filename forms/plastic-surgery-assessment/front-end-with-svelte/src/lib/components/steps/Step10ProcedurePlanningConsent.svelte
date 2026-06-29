<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.procedurePlanningConsent;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Procedure Planning &amp; Consent">
	<p class="hint">Proposed procedure, complexity, risks, and consent status.</p>

	<Field label="Proposed procedure" inputId="proposedProcedure">
		<TextAreaInput id="proposedProcedure" label="Proposed procedure" rows={2} bind:value={d.proposedProcedure} />
	</Field>

	<Field label="Procedure complexity" inputId="procedureComplexity">
		<Select id="procedureComplexity" label="Procedure complexity" bind:value={d.procedureComplexity}>
			<option value="">Select…</option>
			<option value="1">Complexity 1 — Minor</option>
			<option value="2">Complexity 2 — Intermediate</option>
			<option value="3">Complexity 3 — Major</option>
			<option value="4">Complexity 4 — Major plus / emergency</option>
		</Select>
	</Field>

	<Field label="Surgical approach" inputId="surgicalApproach">
		<Select id="surgicalApproach" label="Surgical approach" bind:value={d.surgicalApproach}>
			<option value="">Select…</option>
			<option value="open">Open</option>
			<option value="endoscopic">Endoscopic</option>
			<option value="microsurgical">Microsurgical</option>
			<option value="minimally-invasive">Minimally invasive</option>
			<option value="combined">Combined</option>
		</Select>
	</Field>

	<Field label="Expected duration (minutes)" inputId="expectedDurationMinutes">
		<NumberInput id="expectedDurationMinutes" label="Expected duration" min={0} bind:value={d.expectedDurationMinutes} />
	</Field>

	<Field label="Expected hospital stay" inputId="expectedHospitalStay">
		<Select id="expectedHospitalStay" label="Expected hospital stay" bind:value={d.expectedHospitalStay}>
			<option value="">Select…</option>
			<option value="day-case">Day case</option>
			<option value="overnight">Overnight</option>
			<option value="2-3-days">2–3 days</option>
			<option value="4-7-days">4–7 days</option>
			<option value="greater-7-days">More than 7 days</option>
		</Select>
	</Field>

	<Field label="Flap / reconstruction type" inputId="flapType">
		<Select id="flapType" label="Flap / reconstruction type" bind:value={d.flapType}>
			<option value="">Select…</option>
			<option value="local">Local flap</option>
			<option value="regional">Regional flap</option>
			<option value="distant">Distant flap</option>
			<option value="free">Free flap</option>
			<option value="skin-graft">Skin graft</option>
			<option value="tissue-expansion">Tissue expansion</option>
			<option value="implant">Implant</option>
			<option value="n-a">N/A</option>
		</Select>
	</Field>

	<Field label="Implant required?">
		<RadioGroup label="Implant required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="implantRequired" value={opt.value} bind:group={d.implantRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.implantRequired === 'yes'}
		<Field label="Implant details" inputId="implantDetails">
			<TextInput id="implantDetails" label="Implant details" bind:value={d.implantDetails} />
		</Field>
	{/if}

	<Field label="VTE risk" inputId="vteRisk">
		<Select id="vteRisk" label="VTE risk" bind:value={d.vteRisk}>
			<option value="">Select…</option>
			<option value="low">Low</option>
			<option value="moderate">Moderate</option>
			<option value="high">High</option>
		</Select>
	</Field>

	<Field label="Antibiotic prophylaxis planned?">
		<RadioGroup label="Antibiotic prophylaxis planned?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="antibioticProphylaxis" value={opt.value} bind:group={d.antibioticProphylaxis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Anticipated risks" inputId="anticipatedRisks">
		<TextAreaInput id="anticipatedRisks" label="Anticipated risks" rows={2} bind:value={d.anticipatedRisks} />
	</Field>

	<Field label="Alternative treatments discussed" inputId="alternativeTreatments">
		<TextAreaInput id="alternativeTreatments" label="Alternative treatments discussed" rows={2} bind:value={d.alternativeTreatments} />
	</Field>

	<Field label="Consent discussion held?">
		<RadioGroup label="Consent discussion held?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consentDiscussion" value={opt.value} bind:group={d.consentDiscussion} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Consent form signed?">
		<RadioGroup label="Consent form signed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consentFormSigned" value={opt.value} bind:group={d.consentFormSigned} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Cooling-off period offered?" inputId="coolingOffPeriodOffered">
		<Select id="coolingOffPeriodOffered" label="Cooling-off period offered?" bind:value={d.coolingOffPeriodOffered}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="n-a">N/A</option>
		</Select>
	</Field>

	<Field label="Follow-up plan" inputId="followUpPlan">
		<TextAreaInput id="followUpPlan" label="Follow-up plan" rows={2} bind:value={d.followUpPlan} />
	</Field>
</Fieldset>
