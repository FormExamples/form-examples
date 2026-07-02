<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGrade } from '$lib/engine/fluid-balance-grader';
	import { fluidStatusLabel, fluidStatusColor, formatSignedMl } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data;
	const grade = $derived(calculateGrade(assessment.data));
</script>

<Fieldset legend="Step 5 of 5 — Summary and note">
	<p class="hint">
		Live totals, net balance, urine-output rate, and fluid-status classification, plus a free-text
		clinical note. Submit to generate the full report.
	</p>

	<Field label="Chart summary">
		<div class="space-y-2 text-sm">
			<div class="flex flex-wrap items-center gap-3">
				<span class="inline-block rounded-full border px-3 py-1 font-bold {fluidStatusColor(grade.fluidStatus)}">
					{fluidStatusLabel(grade.fluidStatus)}
				</span>
				<strong class="text-base-content">Net balance {formatSignedMl(grade.netBalanceMl)}</strong>
				<span class="text-base-content/70">over {grade.hoursObserved} h</span>
			</div>
			<div class="text-base-content/70">
				Intake <strong class="text-base-content">{grade.totalIntakeMl} mL</strong> · Output
				<strong class="text-base-content">{grade.totalOutputMl} mL</strong> · Urine
				<strong class="text-base-content">{grade.urineOutputMl} mL</strong>
			</div>
			<div class="text-base-content/70">
				Urine output rate:
				{#if grade.urineOutputRateMlPerKgPerHour === null}
					<span class="text-base-content/60">not computable (weight or hours missing)</span>
				{:else}
					<strong class="text-base-content">{grade.urineOutputRateMlPerKgPerHour.toFixed(2)} mL/kg/h</strong>
				{/if}
			</div>
			<div class="text-base-content/60">
				{d.intake.length} intake row(s), {d.output.length} output row(s)
			</div>
		</div>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, escalation, and any actions already taken."
			bind:value={d.note.clinicalNote}
		/>
	</Field>
</Fieldset>
