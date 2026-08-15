<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 12 — Patient identification">
	<p class="hint">NHS number / local identifier, age band, sex, and ethnicity.</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. NHS 943 476 5919 or local MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age band"
		required
		description="80 and over relaxes the clinic target to 150/90."
		inputId="identification-ageBand"
	>
		<Select id="identification-ageBand" label="Age band" required bind:value={p.ageBand}>
			<option value="">— Select —</option>
			<option value="18-39">18-39</option>
			<option value="40-59">40-59</option>
			<option value="60-79">60-79</option>
			<option value=">=80">80 and over</option>
		</Select>
	</Field>

	<Field label="Sex" inputId="identification-sex">
		<Select id="identification-sex" label="Sex" bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Ethnicity" inputId="identification-ethnicity">
		<Select id="identification-ethnicity" label="Ethnicity" bind:value={p.ethnicity}>
			<option value="">— Select —</option>
			<option value="white">White</option>
			<option value="black-african-caribbean">Black African / Caribbean</option>
			<option value="south-asian">South Asian</option>
			<option value="mixed">Mixed</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
