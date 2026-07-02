<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateBmiBsa } from '$lib/engine/bmi-bsa-grader';
	import { bmiCategoryColor, bmiCategoryLabel, formatBmi, formatBsa } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.results;
	const grade = $derived(calculateBmiBsa(assessment.data));
</script>

<Fieldset legend="Step 5 of 5 — Summary and result">
	<p class="hint">
		Live BMI, WHO category, and both BSA values. Choose the preferred BSA formula and add a
		free-text clinical note, then submit to generate the full report.
	</p>

	<Field label="Live BMI and WHO category">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{formatBmi(grade.bmi)}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {bmiCategoryColor(
					grade.bmiCategory
				)}"
			>
				{bmiCategoryLabel(grade.bmiCategory)}
			</span>
		</span>
	</Field>

	<Field label="Live body surface area">
		<span class="text-sm text-base-content/80">
			Mosteller {formatBsa(grade.bsaMosteller)} · Du Bois {formatBsa(grade.bsaDuBois)}
		</span>
	</Field>

	<Field label="Preferred BSA formula" inputId="results-bsaFormula">
		<Select id="results-bsaFormula" label="Preferred BSA formula" bind:value={r.bsaFormula}>
			<option value="mosteller">Mosteller</option>
			<option value="du-bois">Du Bois</option>
		</Select>
	</Field>

	<Field label="Clinical note" inputId="results-clinicalNote">
		<TextAreaInput
			id="results-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={r.clinicalNote}
		/>
	</Field>
</Fieldset>
