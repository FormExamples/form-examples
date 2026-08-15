<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateHasBledGrade } from '#lib/engine/hasbled-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
	const elderlyPoint = $derived(calculateHasBledGrade(assessment.data).elderlyPoint);
</script>

<Fieldset legend="Step 2 of 9 — Patient identification">
	<p class="hint">
		Local identifier, age, and sex. HAS-BLED is for adults with atrial fibrillation. Age drives the
		Elderly (E) criterion.
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
		description="Criterion E — scores 1 point when age is over 65 years."
		inputId="identification-ageYears"
	>
		<NumberInput
			id="identification-ageYears"
			label="Age in years"
			min={16}
			max={120}
			step={1}
			bind:value={p.ageYears}
		/>
	</Field>

	<Field label="Elderly (E) criterion point">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(elderlyPoint)}"
		>
			{elderlyPoint} point {elderlyPoint === 1 ? '(age over 65)' : '(age 65 or under)'}
		</span>
	</Field>

	<Field label="Sex" required inputId="identification-sex">
		<Select id="identification-sex" label="Sex" required bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
