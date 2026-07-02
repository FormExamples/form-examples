<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateWaterlowGrade } from '$lib/engine/waterlow-grader';
	import { riskBandLabel, riskBandColor, preventionActionLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateWaterlowGrade(assessment.data));
</script>

<Fieldset legend="Step 5 of 5 — Summary and score">
	<p class="hint">
		Live Waterlow total, risk band, recommended prevention, and a free-text clinical note. Submit to
		generate the full report.
	</p>

	<Field label="Live Waterlow score">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.waterlowScore}</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(
					grade.riskBand
				)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
		</span>
	</Field>

	<Field label="Recommended prevention">
		<p class="text-sm text-base-content/80">{preventionActionLabel(grade.riskBand)}</p>
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: support surface, repositioning schedule, skin care, and any escalation already actioned."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
