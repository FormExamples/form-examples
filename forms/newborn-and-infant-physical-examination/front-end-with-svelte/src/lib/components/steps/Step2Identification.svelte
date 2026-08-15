<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 9 — Baby identification">
	<p class="hint">
		NHS number or local identifier, name, date of birth, sex, and birth details.
	</p>

	<Field label="NHS number or local identifier" required inputId="identification-babyIdentifier">
		<TextInput
			id="identification-babyIdentifier"
			label="NHS number or local identifier"
			placeholder="e.g. 943 476 5919"
			required
			bind:value={i.babyIdentifier}
		/>
	</Field>

	<Field label="Baby name" inputId="identification-babyName">
		<TextInput
			id="identification-babyName"
			label="Baby name"
			placeholder="e.g. Baby Adeyemi"
			bind:value={i.babyName}
		/>
	</Field>

	<Field label="Date of birth" inputId="identification-dateOfBirth">
		<TextInput
			id="identification-dateOfBirth"
			label="Date of birth"
			type="date"
			class="date-input"
			bind:value={i.dateOfBirth}
		/>
	</Field>

	<Field
		label="Sex"
		description="The testes component is applicable only when sex is male."
		required
		inputId="identification-sex"
	>
		<Select id="identification-sex" label="Sex" required bind:value={i.sex}>
			<option value="">— Select —</option>
			<option value="male">Male</option>
			<option value="female">Female</option>
			<option value="indeterminate">Indeterminate</option>
		</Select>
	</Field>

	<Field label="Gestational age at birth (weeks)" inputId="identification-gestationalAgeWeeks">
		<NumberInput
			id="identification-gestationalAgeWeeks"
			label="Gestational age at birth (weeks)"
			min={0}
			max={45}
			step={0.1}
			bind:value={i.gestationalAgeWeeks}
		/>
	</Field>

	<Field label="Birth weight (grams)" inputId="identification-birthWeightGrams">
		<NumberInput
			id="identification-birthWeightGrams"
			label="Birth weight (grams)"
			min={0}
			max={8000}
			step={1}
			bind:value={i.birthWeightGrams}
		/>
	</Field>
</Fieldset>
