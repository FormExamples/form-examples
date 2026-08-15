<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { hhiesQuestions, hhiesResponseOptions } from '#lib/engine/hhies-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import type { HHIESScore } from '#lib/engine/types.js';

	const q = assessment.data.hhiesQuestionnaire;

	const questionKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'] as const;

	function setScore(key: typeof questionKeys[number], value: number) {
		assessment.data.hhiesQuestionnaire[key] = value as HHIESScore;
	}
</script>

<Fieldset legend="HHIE-S Questionnaire">
	<p class="hint">Hearing Handicap Inventory for the Elderly — Screening. Rate how your hearing affects your daily life.</p>

	{#each hhiesQuestions as question, i (i)}
		<div class="hhies-item">
			<p class="hhies-q"><span class="hhies-num">{i + 1}.</span> {question.text}</p>
			<p class="hhies-domain">Domain: {question.domain}</p>
			<fieldset class="radio-group" aria-label={question.text}>
				{#each hhiesResponseOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name="hhies-q{i + 1}"
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
	.hhies-item { margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-border); }
	.hhies-item:last-child { border-bottom: 0; }
	.hhies-q { margin: 0 0 0.125rem; font-size: 0.9375rem; font-weight: 500; }
	.hhies-num { color: var(--color-primary); font-weight: 700; margin-right: 0.25rem; }
	.hhies-domain { margin: 0 0 0.375rem; font-size: 0.75rem; color: var(--color-muted); }
</style>
