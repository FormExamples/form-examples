<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { criterionStatusColor, criterionStatusLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
	// Criterion 1: age under 50. A missing age cannot satisfy the criterion.
	const ageSatisfied = $derived(i.age !== null && i.age < 50);
</script>

<Fieldset legend="Step 2 of 6 — Patient identification">
	<p class="hint">
		Local identifier, age, and sex. Age drives criterion 1 (age under 50 years).
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

	<Field
		label="Age (years)"
		description="Criterion 1 is satisfied when age is under 50 years."
		required
		inputId="identification-age"
	>
		<NumberInput
			id="identification-age"
			label="Age (years)"
			min={0}
			max={120}
			required
			bind:value={i.age}
		/>
	</Field>

	<Field label="Criterion 1 status (age under 50)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {criterionStatusColor(ageSatisfied)}">
			{criterionStatusLabel(ageSatisfied)}
		</span>
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
</Fieldset>
