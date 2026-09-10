<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const r = assessment.data.riskFactors;
</script>

<Fieldset legend="Step 2 of 5 — Patient identification &amp; risk factors">
	<p class="hint">
		Diabetes type and patient-wide risk factors that apply regardless of the current foot
		examination. Renal replacement therapy is an automatic high-risk factor per NICE NG19.
	</p>

	<Field label="Diabetes type" inputId="riskFactors-diabetesType">
		<Select id="riskFactors-diabetesType" label="Diabetes type" bind:value={r.diabetesType}>
			<option value="">— Select —</option>
			<option value="type-1">Type 1</option>
			<option value="type-2">Type 2</option>
			<option value="other">Other</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Years since diagnosis" inputId="riskFactors-yearsSinceDiagnosis">
		<NumberInput
			id="riskFactors-yearsSinceDiagnosis"
			label="Years since diagnosis"
			min={0}
			max={100}
			step={1}
			bind:value={r.yearsSinceDiagnosis}
		/>
	</Field>

	<Field label="Renal replacement therapy (dialysis)" inputId="riskFactors-onRenalReplacementTherapy">
		<Select
			id="riskFactors-onRenalReplacementTherapy"
			label="Renal replacement therapy (dialysis)"
			bind:value={r.onRenalReplacementTherapy}
		>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>

	<Field label="Visual acuity impairment" inputId="riskFactors-visualAcuityImpairment">
		<Select
			id="riskFactors-visualAcuityImpairment"
			label="Visual acuity impairment"
			bind:value={r.visualAcuityImpairment}
		>
			<option value="">— Select —</option>
			<option value="no">No</option>
			<option value="yes">Yes</option>
		</Select>
	</Field>

	<Field label="Self-care ability" inputId="riskFactors-selfCareAbility">
		<Select id="riskFactors-selfCareAbility" label="Self-care ability" bind:value={r.selfCareAbility}>
			<option value="">— Select —</option>
			<option value="independent">Independent</option>
			<option value="partial">Partial support needed</option>
			<option value="unable">Unable (relies on carer)</option>
		</Select>
	</Field>

	<Field label="Footwear appropriate for risk level" inputId="riskFactors-footwearAppropriate">
		<Select
			id="riskFactors-footwearAppropriate"
			label="Footwear appropriate for risk level"
			bind:value={r.footwearAppropriate}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
