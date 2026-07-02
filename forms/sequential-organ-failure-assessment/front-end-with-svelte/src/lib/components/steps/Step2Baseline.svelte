<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const b = assessment.data.baseline;
</script>

<Fieldset legend="Step 2 of 9 — Patient and baseline">
	<p class="hint">
		Local identifier, patient details, and the prior (baseline) total SOFA used to derive
		delta-SOFA. SOFA is for critically ill adults (&ge; 16 years).
	</p>

	<Field label="Patient identifier" required inputId="baseline-patientIdentifier">
		<TextInput
			id="baseline-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. ICU-100482 or hospital MRN"
			required
			bind:value={b.patientIdentifier}
		/>
	</Field>

	<Field label="Age (years)" inputId="baseline-ageYears">
		<NumberInput
			id="baseline-ageYears"
			label="Age (years)"
			min={16}
			max={120}
			step={1}
			bind:value={b.ageYears}
		/>
	</Field>

	<Field label="Sex" required inputId="baseline-sex">
		<Select id="baseline-sex" label="Sex" required bind:value={b.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Admission diagnosis" inputId="baseline-admissionDiagnosis">
		<TextInput
			id="baseline-admissionDiagnosis"
			label="Admission diagnosis"
			placeholder="e.g. Community-acquired pneumonia"
			bind:value={b.admissionDiagnosis}
		/>
	</Field>

	<Field label="Suspected or confirmed infection" required inputId="baseline-suspectedInfection">
		<Select
			id="baseline-suspectedInfection"
			label="Suspected or confirmed infection"
			required
			bind:value={b.suspectedInfection}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field
		label="Baseline (prior) total SOFA"
		description="The previous total SOFA (0-24) for the delta-SOFA calculation. Assume 0 if no known pre-existing organ dysfunction."
		inputId="baseline-baselineSofaTotal"
	>
		<NumberInput
			id="baseline-baselineSofaTotal"
			label="Baseline (prior) total SOFA"
			min={0}
			max={24}
			step={1}
			bind:value={b.baselineSofaTotal}
		/>
	</Field>
</Fieldset>
