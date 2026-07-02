<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 8 — Patient identification">
	<p class="hint">
		Demographics that select the model and centre the risk. QRISK3 is valid for ages 25 to 84.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. GP-40021 or NHS number"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age (years)"
		description="QRISK3 is valid for ages 25 to 84."
		inputId="identification-age"
	>
		<NumberInput
			id="identification-age"
			label="Age (years)"
			min={0}
			max={120}
			step={1}
			bind:value={p.age}
		/>
	</Field>

	<Field label="Sex" required inputId="identification-sex">
		<Select id="identification-sex" label="Sex" required bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
		</Select>
	</Field>

	<Field label="Ethnicity" inputId="identification-ethnicity">
		<Select id="identification-ethnicity" label="Ethnicity" bind:value={p.ethnicity}>
			<option value="">— Select —</option>
			<option value="white-or-not-stated">White or not stated</option>
			<option value="indian">Indian</option>
			<option value="pakistani">Pakistani</option>
			<option value="bangladeshi">Bangladeshi</option>
			<option value="other-asian">Other Asian</option>
			<option value="black-caribbean">Black Caribbean</option>
			<option value="black-african">Black African</option>
			<option value="chinese">Chinese</option>
			<option value="other">Other ethnic group</option>
		</Select>
	</Field>

	<Field
		label="Townsend deprivation score"
		description="Optional. Leave blank to use the cohort mean (neutral contribution)."
		inputId="identification-townsendScore"
	>
		<NumberInput
			id="identification-townsendScore"
			label="Townsend deprivation score"
			min={-8}
			max={12}
			step={0.1}
			bind:value={p.townsendScore}
		/>
	</Field>

	<Field label="Postcode" inputId="identification-postcode">
		<TextInput
			id="identification-postcode"
			label="Postcode"
			placeholder="e.g. LS1 4AP"
			bind:value={p.postcode}
		/>
	</Field>
</Fieldset>
