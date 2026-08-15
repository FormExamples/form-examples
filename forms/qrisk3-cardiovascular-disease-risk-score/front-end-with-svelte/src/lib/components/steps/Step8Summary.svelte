<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateQrisk3Grade } from '#lib/engine/qrisk3-grader.js';
	import { riskBandLabel, riskBandColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateQrisk3Grade(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Summary and score">
	<p class="hint">
		Live 10-year CVD risk and a free-text clinical note. Submit to generate the full report. This is
		a representative model, not the official QRISK3-2017 algorithm.
	</p>

	<Field label="Live 10-year CVD risk">
		{#if grade.computable && grade.tenYearRiskPercent !== null}
			<span class="inline-flex items-center gap-3">
				<strong class="text-lg text-base-content">{grade.tenYearRiskPercent}%</strong>
				<Badge label={riskBandLabel(grade.riskBand)} colorClass={riskBandColor(grade.riskBand)} />
			</span>
		{:else}
			<span class="text-sm text-base-content/70">
				Not computable yet — enter age, sex, BMI, cholesterol : HDL ratio, and systolic blood
				pressure.
			</span>
		{/if}
	</Field>

	{#if grade.computable && grade.heartAge !== null}
		<Field label="Estimated heart age">
			<span class="text-base-content">{grade.heartAge} years</span>
		</Field>
	{/if}

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any lifestyle or statin advice given."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
