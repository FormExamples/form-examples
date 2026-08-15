<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeReview } from '#lib/engine/heart-failure-review-grader.js';
	import {
		functionalStatusLabel,
		functionalStatusColor,
		optimisationStatusLabel,
		optimisationStatusColor,
		reviewStatusLabel,
		reviewStatusColor
	} from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';

	const s = assessment.data.summary;
	// Live preview of the derived statuses as the record is filled.
	const preview = $derived(gradeReview(assessment.data));
</script>

<Fieldset legend="Step 9 of 9 — Summary and plan">
	<p class="hint">
		Live derived statuses and a free-text clinical note. Submit to generate the full report.
	</p>

	<div class="mb-4 grid gap-3 sm:grid-cols-3">
		<div>
			<p class="mb-1 text-sm font-medium text-base-content/70">NYHA functional status</p>
			<Badge
				label={functionalStatusLabel(preview.functionalStatus)}
				colorClass={functionalStatusColor(preview.functionalStatus)}
			/>
		</div>
		<div>
			<p class="mb-1 text-sm font-medium text-base-content/70">Medication optimisation</p>
			<Badge
				label={optimisationStatusLabel(preview.medicationOptimisation.status)}
				colorClass={optimisationStatusColor(preview.medicationOptimisation.status)}
			/>
		</div>
		<div>
			<p class="mb-1 text-sm font-medium text-base-content/70">Review completeness</p>
			<Badge
				label={`${reviewStatusLabel(preview.reviewStatus)} (${preview.completenessScore}%)`}
				colorClass={reviewStatusColor(preview.reviewStatus)}
			/>
		</div>
	</div>

	<Field label="Clinical note" inputId="summary-reviewContext">
		<TextAreaInput
			id="summary-reviewContext"
			label="Clinical note"
			rows={4}
			placeholder="Free-text review context: agreed actions, next review interval, and any escalation already actioned."
			bind:value={s.reviewContext}
		/>
	</Field>
</Fieldset>
