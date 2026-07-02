<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.patient;
</script>

<Fieldset legend="Step 2 of 8 — Patient and diagnosis">
	<p class="hint">Identifier, demographics, diabetes status, and CKD cause.</p>

	<Field label="Patient identifier" required inputId="patient-patientIdentifier">
		<TextInput
			id="patient-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. NHS 943 476 5919 or local MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" required inputId="patient-ageBand">
		<Select id="patient-ageBand" label="Age band" required bind:value={p.ageBand}>
			<option value="">— Select —</option>
			<option value="18-39">18-39</option>
			<option value="40-59">40-59</option>
			<option value="60-79">60-79</option>
			<option value=">=80">80 and over</option>
		</Select>
	</Field>

	<Field label="Sex" inputId="patient-sex">
		<Select id="patient-sex" label="Sex" bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field
		label="Diabetes status"
		description="Diabetes tightens the blood-pressure target to 130/80."
		inputId="patient-diabetesStatus"
	>
		<Select id="patient-diabetesStatus" label="Diabetes status" bind:value={p.diabetesStatus}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="type1">Type 1 diabetes</option>
			<option value="type2">Type 2 diabetes</option>
		</Select>
	</Field>

	<Field label="Primary cause of CKD" inputId="patient-primaryCause">
		<Select id="patient-primaryCause" label="Primary cause of CKD" bind:value={p.primaryCause}>
			<option value="">— Select —</option>
			<option value="diabetic">Diabetic</option>
			<option value="hypertensive">Hypertensive</option>
			<option value="glomerular">Glomerular</option>
			<option value="polycystic">Polycystic</option>
			<option value="obstructive">Obstructive</option>
			<option value="unknown">Unknown</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Months since CKD diagnosis" inputId="patient-monthsSinceDiagnosis">
		<NumberInput
			id="patient-monthsSinceDiagnosis"
			label="Months since CKD diagnosis"
			min={0}
			max={1200}
			step={1}
			placeholder="e.g. 36"
			bind:value={p.monthsSinceDiagnosis}
		/>
	</Field>
</Fieldset>
