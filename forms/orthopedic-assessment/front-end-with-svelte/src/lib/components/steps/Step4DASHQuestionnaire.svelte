<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { dashQuestions, getResponseOptions } from '#lib/engine/dash-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import type { DASHScore } from '#lib/engine/types.js';

	const q = assessment.data.dashQuestionnaire;

	const questionKeys = [
		'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10',
		'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20',
		'q21', 'q22', 'q23', 'q24', 'q25', 'q26', 'q27', 'q28', 'q29', 'q30'
	] as const;

	function setScore(key: typeof questionKeys[number], value: number) {
		assessment.data.dashQuestionnaire[key] = value as DASHScore;
	}

	function isDomainChange(i: number): boolean {
		if (i === 0) return true;
		return dashQuestions[i].domain !== dashQuestions[i - 1].domain;
	}
</script>

<Fieldset legend="DASH Questionnaire">
	<p class="hint">Disabilities of the Arm, Shoulder and Hand — rate your ability to perform the following activities in the past week (minimum 27 of 30 items required).</p>

	{#each dashQuestions as question, i}
		{#if isDomainChange(i)}
			<h3 class="step-subhead">{question.domain}</h3>
		{/if}
		<div class="dash-row">
			<p class="dash-q-text"><span class="dash-q-num">{i + 1}.</span> {question.text}</p>
			<fieldset class="radio-group" role="radiogroup" aria-label={`Question ${i + 1}`}>
				{#each getResponseOptions(question.questionNumber) as opt}
					<label>
						<input
							type="radio"
							class="radio-input"
							name="dash-q{i + 1}"
							value={opt.value}
							checked={q[questionKeys[i]] === opt.value}
							onchange={() => setScore(questionKeys[i], opt.value)}
						/>
						{opt.label}
					</label>
				{/each}
			</fieldset>
		</div>
	{/each}
</Fieldset>

<style>
	.step-subhead {
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-primary);
		margin: 1.25rem 0 0.5rem;
		padding-bottom: 0.25rem;
		border-bottom: 1px solid var(--color-border);
	}
	.dash-row { margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-border); }
	.dash-row:last-child { border-bottom: 0; }
	.dash-q-text { margin: 0 0 0.5rem; font-size: 0.9375rem; }
	.dash-q-num { color: var(--color-primary); font-weight: 700; margin-right: 0.25rem; }
</style>
