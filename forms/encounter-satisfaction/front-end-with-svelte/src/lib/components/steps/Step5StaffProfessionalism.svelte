<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { satisfactionQuestions, likertResponseOptions } from '$lib/engine/satisfaction-questions';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import type { LikertScore } from '$lib/engine/types';

	const section = assessment.data.staffProfessionalism;
	const questions = satisfactionQuestions.filter((q) => q.domain === 'Staff & Professionalism');

	function setScore(field: string, value: number) {
		(section as Record<string, LikertScore | null>)[field] = value as LikertScore;
	}
</script>

<Fieldset legend="Staff &amp; Professionalism">
	<p class="hint">Rate your satisfaction with staff interactions.</p>

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
							checked={(section as Record<string, LikertScore | null>)[question.field] === opt.value}
							onchange={() => setScore(question.field, opt.value)}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
