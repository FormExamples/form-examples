<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateSofaGrade } from '#lib/engine/sofa-grader.js';
	import { mortalityBandLabel, mortalityBandColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
	const grade = $derived(calculateSofaGrade(assessment.data));
</script>

<Fieldset legend="Step 9 of 9 — Summary and sign-off">
	<p class="hint">
		Live total SOFA, delta-SOFA versus baseline, and the mortality-risk band. Submit to generate the
		full report.
	</p>

	<Field label="Live total SOFA">
		<span class="inline-flex flex-wrap items-center gap-3">
			<strong class="text-lg text-base-content">{grade.totalSofa} of 24</strong>
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {mortalityBandColor(
					grade.mortalityBand
				)}"
			>
				{mortalityBandLabel(grade.mortalityBand)}
			</span>
			{#if grade.deltaSofa !== null}
				<span class="text-sm text-base-content/70">
					Delta-SOFA {grade.deltaSofa >= 0 ? '+' : ''}{grade.deltaSofa}
				</span>
			{/if}
			{#if grade.sepsis3}
				<span
					class="inline-block rounded-full border border-error bg-error px-3 py-1 text-sm font-bold text-error-content"
				>
					Meets Sepsis-3
				</span>
			{/if}
		</span>
	</Field>

	{#if !grade.complete}
		<p class="hint">
			One or more organ systems are not yet scored — the total may understate the true risk.
		</p>
	{/if}

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
