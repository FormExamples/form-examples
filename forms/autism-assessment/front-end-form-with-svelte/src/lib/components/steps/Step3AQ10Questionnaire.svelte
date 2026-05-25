<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { aq10Questions, aq10ResponseOptions, aq10ScoringDirections } from '$lib/engine/aq10-rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import type { AQ10Score } from '$lib/engine/types';

	const questionKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'] as const;

	let rawResponses = $state<Record<string, string>>({});

	function handleResponse(key: typeof questionKeys[number], questionNumber: number, responseValue: string) {
		rawResponses[key] = responseValue;
		const direction = aq10ScoringDirections[questionNumber];
		const isAgree = responseValue === 'definitely-agree' || responseValue === 'slightly-agree';
		const isDisagree = responseValue === 'definitely-disagree' || responseValue === 'slightly-disagree';

		if (direction === 'agree') {
			assessment.data.aq10Questionnaire[key] = (isAgree ? 1 : 0) as AQ10Score;
		} else {
			assessment.data.aq10Questionnaire[key] = (isDisagree ? 1 : 0) as AQ10Score;
		}
	}
</script>

<Fieldset legend="AQ-10 Questionnaire">
	<p class="hint">Autism Spectrum Quotient-10 — indicate how strongly you agree or disagree with each statement.</p>

	{#each aq10Questions as question, i (question.questionNumber)}
		<Field label={`${i + 1}. ${question.text}`} description={`Domain: ${question.domain}`}>
			<RadioGroup label={`AQ-10 Q${i + 1}`}>
				{#each aq10ResponseOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`aq10-q${i + 1}`}
							value={opt.value}
							checked={rawResponses[questionKeys[i]] === opt.value}
							onchange={() => handleResponse(questionKeys[i], question.questionNumber, opt.value)}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
