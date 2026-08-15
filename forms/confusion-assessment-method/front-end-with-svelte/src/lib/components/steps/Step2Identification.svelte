<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 8 — Patient identification">
	<p class="hint">
		Local identifier, age band, sex, cognitive baseline, and the source of the collateral history.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. hospital MRN or ward number"
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

	<Field
		label="Cognitive baseline"
		description="The patient's usual cognition before this acute change."
		inputId="identification-cognitiveBaseline"
	>
		<Select
			id="identification-cognitiveBaseline"
			label="Cognitive baseline"
			bind:value={i.cognitiveBaseline}
		>
			<option value="">— Select —</option>
			<option value="independent">Independent</option>
			<option value="known-dementia">Known dementia</option>
			<option value="mild-cognitive-impairment">Mild cognitive impairment</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Source of collateral history" inputId="identification-collateralSource">
		<Select
			id="identification-collateralSource"
			label="Source of collateral history"
			bind:value={i.collateralSource}
		>
			<option value="">— Select —</option>
			<option value="family">Family</option>
			<option value="carer">Carer</option>
			<option value="nurse">Nurse</option>
			<option value="notes">Case notes</option>
			<option value="none">None available</option>
		</Select>
	</Field>
</Fieldset>
