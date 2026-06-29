<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { dlqiQuestions, dlqiResponseOptions } from '$lib/engine/dlqi-rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import type { DLQIScore } from '$lib/engine/types';

	const q = assessment.data.dlqiQuestionnaire;

	const questionKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'] as const;

	function setScore(key: typeof questionKeys[number], value: number) {
		assessment.data.dlqiQuestionnaire[key] = value as DLQIScore;
	}
</script>

<Fieldset legend="DLQI Questionnaire">
	<p class="hint">Dermatology Life Quality Index — rate the impact of your skin condition over the last week.</p>

	{#each dlqiQuestions as question, i (i)}
		<div class="dlqi-item">
			<p class="dlqi-q"><span class="dlqi-num">{i + 1}.</span> {question.text}</p>
			<p class="dlqi-domain">Domain: {question.domain}</p>
			<fieldset class="radio-group" aria-label={question.text}>
				{#each dlqiResponseOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name="dlqi-q{i + 1}"
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
	.dlqi-item {
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--color-border);
	}
	.dlqi-item:last-child {
		border-bottom: 0;
	}
	.dlqi-q {
		margin: 0 0 0.125rem;
		font-size: 0.9375rem;
		font-weight: 500;
	}
	.dlqi-num {
		color: var(--color-primary);
		font-weight: 700;
		margin-right: 0.25rem;
	}
	.dlqi-domain {
		margin: 0 0 0.375rem;
		font-size: 0.75rem;
		color: var(--color-muted);
	}
</style>
