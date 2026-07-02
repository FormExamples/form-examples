<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCentorGrade } from '$lib/engine/centor-grader';
	import { riskBandLabel, riskBandColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateCentorGrade(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Summary and score">
	<p class="hint">
		Live Centor total, McIsaac modified score, risk band, and a free-text clinical note. Submit to
		generate the full report.
	</p>

	<Field label="Live Centor total">
		<strong class="text-lg text-base-content">{grade.centorScore} of 4</strong>
	</Field>

	<Field label="Modified McIsaac score">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{grade.mcIsaacScore}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(grade.riskBand)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
		</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, testing / antibiotic decision, and any safety-netting advice."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
