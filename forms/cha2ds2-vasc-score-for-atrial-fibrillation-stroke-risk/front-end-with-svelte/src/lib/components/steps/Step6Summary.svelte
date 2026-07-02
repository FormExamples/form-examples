<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCha2ds2VascGrade } from '$lib/engine/cha2ds2vasc-grader';
	import { riskBandLabel, riskBandColor, anticoagulationLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateCha2ds2VascGrade(assessment.data));
</script>

<Fieldset legend="Step 6 of 6 — Summary and score">
	<p class="hint">
		Live CHA2DS2-VASc total, estimated annual stroke rate, and a free-text clinical note. Submit to
		generate the full report.
	</p>

	<Field label="Live CHA2DS2-VASc score">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.cha2ds2VascScore} of 9</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(grade.riskBand)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
			<span class="text-sm text-base-content/70">
				~{grade.annualStrokeRatePercent}% annual stroke rate
			</span>
		</span>
	</Field>

	<Field label="Anticoagulation recommendation">
		<span class="text-sm font-semibold text-base-content">
			{anticoagulationLabel(grade.anticoagulationRecommendation)}
		</span>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, the anticoagulation decision, and any HAS-BLED cross-reference."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
