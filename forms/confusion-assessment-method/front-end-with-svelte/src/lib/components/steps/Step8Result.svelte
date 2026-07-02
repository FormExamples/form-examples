<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCamGrade } from '$lib/engine/cam-grader';
	import { classificationLabel, classificationColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.result;
	const grade = $derived(calculateCamGrade(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Result and disposition">
	<p class="hint">
		Suspected precipitants, recommended actions, and a free-text clinical note. Submit to generate
		the full report.
	</p>

	<Field label="Live CAM classification">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {classificationColor(
					grade.classification
				)}"
			>
				{classificationLabel(grade.classification)}
			</span>
			<span class="text-sm text-base-content/70">
				{grade.positiveFeatures.length
					? `Positive features: ${grade.positiveFeatures.join(', ')}`
					: 'No positive features recorded yet.'}
			</span>
		</span>
	</Field>

	<Field
		label="Suspected precipitants (PINCH ME screen)"
		inputId="result-suspectedPrecipitants"
	>
		<TextAreaInput
			id="result-suspectedPrecipitants"
			label="Suspected precipitants (PINCH ME screen)"
			rows={3}
			placeholder="Pain, Infection, Nutrition, Constipation, Hydration, Medication, Environment."
			bind:value={r.suspectedPrecipitants}
		/>
	</Field>

	<Field
		label="Recommended actions and disposition"
		required
		inputId="result-recommendedActions"
	>
		<TextAreaInput
			id="result-recommendedActions"
			label="Recommended actions and disposition"
			rows={3}
			required
			placeholder="Investigations, escalation, and management plan."
			bind:value={r.recommendedActions}
		/>
	</Field>

	<Field label="Clinical note" inputId="result-clinicalNote">
		<TextAreaInput
			id="result-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, decisions, and any escalation already actioned."
			bind:value={r.clinicalNote}
		/>
	</Field>
</Fieldset>
