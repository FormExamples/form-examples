<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { satisfactionQuestions, likertResponseOptions } from '$lib/engine/satisfaction-questions';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import type { LikertScore } from '$lib/engine/types';

	const section = assessment.data.overallSatisfaction;
	const questions = satisfactionQuestions.filter((q) => q.domain === 'Overall Satisfaction');

	function setScore(field: string, value: number) {
		(section as Record<string, LikertScore | null | string>)[field] = value as LikertScore;
	}
</script>

<Fieldset legend="Overall Satisfaction">
	<p class="hint">Rate your overall experience and provide any additional comments.</p>

	{#each questions as question, i (question.id)}
		<Field label={`${i + 1}. ${question.text}`}>
			<RadioGroup label={question.text}>
				{#each likertResponseOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`ess-${question.id}`}
							value={opt.value}
							checked={(section as Record<string, LikertScore | null | string>)[question.field] === opt.value}
							onchange={() => setScore(question.field, opt.value)}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Additional Comments" inputId="comments">
		<TextAreaInput
			id="comments"
			label="Additional Comments"
			placeholder="Please share any additional feedback about your experience..."
			rows={4}
			bind:value={section.comments}
		/>
	</Field>
</Fieldset>
