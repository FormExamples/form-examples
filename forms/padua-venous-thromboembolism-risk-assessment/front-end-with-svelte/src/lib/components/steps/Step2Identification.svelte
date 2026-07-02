<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculatePaduaGrade } from '$lib/engine/padua-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.identification;
	const agePoints = $derived(calculatePaduaGrade(assessment.data).factorPoints.elderlyAge ?? 0);
</script>

<Fieldset legend="Step 2 of 8 — Patient identification">
	<p class="hint">
		Local identifier, age, and sex. Padua is for hospitalised medical (non-surgical) adults.
	</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. AMU-100482 or hospital MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age (years)"
		description="Factor 6 — scores 1 point when the patient is 70 years or over."
		inputId="identification-ageYears"
	>
		<NumberInput
			id="identification-ageYears"
			label="Age (years)"
			min={0}
			max={120}
			step={1}
			bind:value={p.ageYears}
		/>
	</Field>

	<Field label="Factor 6 — elderly age (&ge; 70)">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(agePoints)}">
			{agePoints} {agePoints === 1 ? 'point' : 'points'}
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
