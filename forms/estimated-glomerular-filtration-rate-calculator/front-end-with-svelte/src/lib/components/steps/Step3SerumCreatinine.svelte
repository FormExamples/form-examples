<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateEgfr } from '#lib/engine/egfr-grader.js';
	import { stageColor, stageLabel, formatEgfr } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const cr = assessment.data.creatinine;
	const grade = $derived(calculateEgfr(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 4 — Serum creatinine">
	<p class="hint">
		The single laboratory input — a standardised (IDMS-traceable) serum creatinine in µmol/L. The
		value is divided by 88.42 to mg/dL, then the CKD-EPI 2021 equation is applied with the age and
		sex from step 2.
	</p>

	<Field
		label="Serum creatinine (µmol/L)"
		description="Adult serum-creatinine results are typically around 60-110 µmol/L."
		inputId="creatinine-serumCreatinine"
	>
		<NumberInput
			id="creatinine-serumCreatinine"
			label="Serum creatinine"
			min={0}
			max={2000}
			step={1}
			bind:value={cr.serumCreatinine}
		/>
	</Field>

	<Field label="Specimen date" inputId="creatinine-specimenDate">
		<TextInput
			id="creatinine-specimenDate"
			label="Specimen date"
			type="date"
			class="date-input"
			bind:value={cr.specimenDate}
		/>
	</Field>

	<Field label="Is renal function at steady state?">
		<RadioGroup label="Is renal function at steady state?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="creatinine-steadyState"
						value={opt.value}
						bind:group={cr.steadyState}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Live eGFR">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{formatEgfr(grade.egfr)}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {stageColor(
					grade.egfrStage
				)}"
			>
				{stageLabel(grade.egfrStage)}
			</span>
		</span>
	</Field>
</Fieldset>
