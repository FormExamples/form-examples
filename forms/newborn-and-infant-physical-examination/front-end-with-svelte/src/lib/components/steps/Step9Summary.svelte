<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateNipeGrade } from '$lib/engine/nipe-grader';
	import { outcomeColor, outcomeLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.summary;
	const grade = $derived(calculateNipeGrade(assessment.data));
</script>

<Fieldset legend="Step 9 of 9 — Summary and outcome">
	<p class="hint">
		Live overall screening outcome, optional practitioner-recorded results, and a free-text note.
		Submit to generate the full report.
	</p>

	<Field label="Live overall screening outcome">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {outcomeColor(
					grade.overallOutcome
				)}"
			>
				{outcomeLabel(grade.overallOutcome)}
			</span>
			<span class="text-sm text-base-content/70">
				Completeness {grade.completenessPercent}% · {grade.completeness}
			</span>
		</span>
	</Field>

	<Field
		label="Recorded eyes result (optional cross-check)"
		inputId="summary-eyesResultRecorded"
	>
		<Select
			id="summary-eyesResultRecorded"
			label="Recorded eyes result (optional cross-check)"
			bind:value={m.eyesResultRecorded}
		>
			<option value="">— Select —</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="refer">Refer</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field
		label="Recorded heart result (optional cross-check)"
		inputId="summary-heartResultRecorded"
	>
		<Select
			id="summary-heartResultRecorded"
			label="Recorded heart result (optional cross-check)"
			bind:value={m.heartResultRecorded}
		>
			<option value="">— Select —</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="refer">Refer</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field
		label="Recorded hips result (optional cross-check)"
		inputId="summary-hipsResultRecorded"
	>
		<Select
			id="summary-hipsResultRecorded"
			label="Recorded hips result (optional cross-check)"
			bind:value={m.hipsResultRecorded}
		>
			<option value="">— Select —</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="refer">Refer</option>
			<option value="not-examined">Not examined</option>
		</Select>
	</Field>

	<Field
		label="Recorded testes result (optional cross-check)"
		inputId="summary-testesResultRecorded"
	>
		<Select
			id="summary-testesResultRecorded"
			label="Recorded testes result (optional cross-check)"
			bind:value={m.testesResultRecorded}
		>
			<option value="">— Select —</option>
			<option value="satisfactory">Satisfactory</option>
			<option value="refer">Refer</option>
			<option value="not-examined">Not examined</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Clinical note" inputId="summary-clinicalNote">
		<TextAreaInput
			id="summary-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: findings, decisions, and any referral already actioned."
			bind:value={m.clinicalNote}
		/>
	</Field>
</Fieldset>
