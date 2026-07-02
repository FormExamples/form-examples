<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateHasBledGrade } from '$lib/engine/hasbled-grader';
	import { riskBandLabel, riskBandColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateHasBledGrade(assessment.data));
</script>

<Fieldset legend="Step 9 of 9 — Summary and score">
	<p class="hint">
		Live HAS-BLED total and a free-text clinical note. A score &ge; 3 flags higher bleeding risk —
		not a contraindication to anticoagulation, but a prompt to correct modifiable factors. Submit to
		generate the full report.
	</p>

	<Field label="Live HAS-BLED score">
		<span class="inline-flex items-center gap-3">
			<strong class="text-lg text-base-content">{grade.hasBledScore} of 9</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskBandColor(
					grade.riskBand
				)}"
			>
				{riskBandLabel(grade.riskBand)}
			</span>
		</span>
	</Field>

	{#if grade.modifiableFactors}
		<Field label="Modifiable factors present">
			<span class="text-sm text-base-content/70">{grade.modifiableFactors}</span>
		</Field>
	{/if}

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any modifiable factors being addressed."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
