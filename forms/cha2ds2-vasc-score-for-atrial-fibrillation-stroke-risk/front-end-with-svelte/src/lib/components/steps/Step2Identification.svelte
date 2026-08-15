<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCha2ds2VascGrade } from '#lib/engine/cha2ds2vasc-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
	const sexPoint = $derived(calculateCha2ds2VascGrade(assessment.data).sexPoint);
</script>

<Fieldset legend="Step 2 of 6 — Patient identification">
	<p class="hint">
		Local identifier, age in years (drives the age criterion), and sex (drives the female
		sex-category point).
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. AF-100482 or hospital MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age (years)"
		description="Age >= 75 scores 2 points; age 65-74 scores 1 point; under 65 scores 0."
		inputId="identification-ageYears"
	>
		<NumberInput
			id="identification-ageYears"
			label="Age in years"
			min={18}
			max={120}
			step={1}
			bind:value={p.ageYears}
		/>
	</Field>

	<Field label="Sex" required inputId="identification-sex">
		<Select id="identification-sex" label="Sex" required bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Sex category point (Sc)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(sexPoint)}">
			{sexPoint} point {sexPoint === 1 ? '(female)' : '(none)'}
		</span>
	</Field>
</Fieldset>
