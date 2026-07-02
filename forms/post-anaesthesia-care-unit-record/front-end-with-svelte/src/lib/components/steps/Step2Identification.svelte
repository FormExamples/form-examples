<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 10 — Patient identification">
	<p class="hint">
		Local identifier, age band, sex, ASA status, and the pre-anaesthetic baseline blood pressure
		used as the circulation reference.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. PACU-100482 or hospital MRN"
			required
			bind:value={i.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" required inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" required bind:value={i.ageBand}>
			<option value="">— Select —</option>
			<option value="16-39">16-39</option>
			<option value="40-59">40-59</option>
			<option value="60-74">60-74</option>
			<option value="75-plus">75 and over</option>
		</Select>
	</Field>

	<Field label="Sex" required inputId="identification-sex">
		<Select id="identification-sex" label="Sex" required bind:value={i.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="ASA physical status" inputId="identification-asaStatus">
		<Select id="identification-asaStatus" label="ASA physical status" bind:value={i.asaStatus}>
			<option value="">— Select —</option>
			<option value="I">ASA I</option>
			<option value="II">ASA II</option>
			<option value="III">ASA III</option>
			<option value="IV">ASA IV</option>
			<option value="V">ASA V</option>
		</Select>
	</Field>

	<Field
		label="Pre-anaesthetic baseline systolic blood pressure (mmHg)"
		description="Used as the reference for the Aldrete circulation parameter."
		inputId="identification-baselineSystolicBp"
	>
		<NumberInput
			id="identification-baselineSystolicBp"
			label="Pre-anaesthetic baseline systolic blood pressure"
			min={40}
			max={300}
			step={1}
			bind:value={i.baselineSystolicBp}
		/>
	</Field>

	<Field
		label="Day-surgery (ambulatory) case?"
		description="Selecting Yes enables the optional PADSS street-fitness assessment (Step 9)."
		inputId="identification-ambulatoryCase"
	>
		<Select
			id="identification-ambulatoryCase"
			label="Day-surgery (ambulatory) case?"
			bind:value={i.ambulatoryCase}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes — day surgery / ambulatory</option>
			<option value="no">No — inpatient</option>
		</Select>
	</Field>
</Fieldset>
