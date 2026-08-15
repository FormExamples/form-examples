<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeOET } from '#lib/engine/oet-grader.js';
	import { gradeLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const ci = assessment.data.clinicalIndicators;

	// Live preview of the engine output as the examiner completes the form.
	const preview = $derived(gradeOET(assessment.data));
</script>

<Fieldset legend="Lefel CEFR gyffredinol ac adborth / Overall CEFR level & feedback">
	<p class="hint">
		The overall CEFR-mapped grade is computed from the linguistic and clinical ratings. Add any
		summary feedback for the candidate before submitting.
	</p>

	<div class="preview">
		<div class="preview-row">
			<span class="preview-key">Provisional grade</span>
			<span class="preview-val">{gradeLabel(preview.grade)}</span>
		</div>
		<div class="preview-row">
			<span class="preview-key">Scaled score</span>
			<span class="preview-val">{preview.scaledScore} / 500</span>
		</div>
		<div class="preview-row">
			<span class="preview-key">Linguistic total</span>
			<span class="preview-val">{preview.linguisticTotal} / 24</span>
		</div>
		<div class="preview-row">
			<span class="preview-key">Clinical total</span>
			<span class="preview-val">{preview.clinicalTotal} / 15</span>
		</div>
	</div>

	<Field
		label="Examiner feedback / Adborth yr arholwr"
		inputId="clinExaminerNotes"
		description="Overall narrative feedback on the candidate's Welsh-language clinical communication."
	>
		<TextAreaInput
			id="clinExaminerNotes"
			label="Examiner feedback"
			rows={5}
			placeholder="Cryfderau, meysydd i'w gwella, ac argymhellion ar gyfer ymarfer cyfrwng Cymraeg…"
			bind:value={ci.examinerNotes}
		/>
	</Field>
</Fieldset>

<style>
	.preview {
		margin: 0.5rem 0 1.25rem;
		padding: 1rem;
		border: 1px solid var(--color-base-300, #ddd);
		border-radius: 0.5rem;
	}
	.preview-row {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.25rem 0;
	}
	.preview-key {
		opacity: 0.7;
	}
	.preview-val {
		font-weight: 600;
	}
</style>
