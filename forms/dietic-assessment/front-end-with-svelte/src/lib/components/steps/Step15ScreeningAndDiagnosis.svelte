<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="15. Screening Scores and Nutrition Diagnosis">
	<p class="hint">The remaining MUST and refeeding inputs, the estimated requirements, and the PES statement.</p>

	<Field label="Acutely ill" inputId="screening-acutelyIll">
		<Select id="screening-acutelyIll" label="Acutely ill" bind:value={d.screening.acutelyIll}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="No nutritional intake, or unlikely intake, for more than 5 days" inputId="screening-noNutritionalIntakeOver5Days" description="Both must be yes for the MUST acute disease effect to score 2.">
		<Select id="screening-noNutritionalIntakeOver5Days" label="No nutritional intake, or unlikely intake, for more than 5 days" bind:value={d.screening.noNutritionalIntakeOver5Days}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Days of negligible intake" inputId="screening-daysOfNegligibleIntake" description="Used for the NICE CG32 refeeding-syndrome risk criteria.">
		<NumberInput id="screening-daysOfNegligibleIntake" label="Days of negligible intake" min={0} max={365} bind:value={d.screening.daysOfNegligibleIntake} />
	</Field>
	<Field label="NRS-2002 score (0–7)" inputId="screening-nrs2002Score" description="At-risk threshold is 3, for the acute inpatient setting.">
		<NumberInput id="screening-nrs2002Score" label="NRS-2002 score (0–7)" min={0} max={7} bind:value={d.screening.nrs2002Score} />
	</Field>
	<Field label="Energy requirement (kcal/day)" inputId="screening-energyRequirementKcal">
		<NumberInput id="screening-energyRequirementKcal" label="Energy requirement (kcal/day)" min={0} max={10000} bind:value={d.screening.energyRequirementKcal} />
	</Field>
	<Field label="Protein requirement (g/day)" inputId="screening-proteinRequirementG">
		<NumberInput id="screening-proteinRequirementG" label="Protein requirement (g/day)" min={0} max={500} bind:value={d.screening.proteinRequirementG} />
	</Field>
	<Field label="Fluid requirement (ml/day)" inputId="screening-fluidRequirementMl">
		<NumberInput id="screening-fluidRequirementMl" label="Fluid requirement (ml/day)" min={0} max={10000} bind:value={d.screening.fluidRequirementMl} />
	</Field>
	<Field label="Equation used" inputId="screening-requirementEquation" description="The form records which equation you used; it does not compute requirements, because local policy governs the choice.">
		<Select id="screening-requirementEquation" label="Equation used" bind:value={d.screening.requirementEquation}>
			<option value="">— Select —</option>
			{#each OPTIONS.requirementEquation as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="PES problem — the nutrition and dietetic diagnosis" inputId="screening-pesProblem">
		<TextAreaInput id="screening-pesProblem" label="PES problem — the nutrition and dietetic diagnosis" rows={2} bind:value={d.screening.pesProblem} />
	</Field>
	<Field label="PES etiology — related to" inputId="screening-pesEtiology">
		<TextAreaInput id="screening-pesEtiology" label="PES etiology — related to" rows={2} bind:value={d.screening.pesEtiology} />
	</Field>
	<Field label="PES signs and symptoms — as evidenced by" inputId="screening-pesSignsSymptoms">
		<TextAreaInput id="screening-pesSignsSymptoms" label="PES signs and symptoms — as evidenced by" rows={2} bind:value={d.screening.pesSignsSymptoms} />
	</Field>
</Fieldset>
