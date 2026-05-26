<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { phq9Questions, phqAnswerOptions } from '$lib/engine/mh-rules';
	import type { PhqScore } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.phqResponses;

	const phqKeys: (keyof typeof p)[] = [
		'interest',
		'depression',
		'sleep',
		'energy',
		'appetite',
		'selfEsteem',
		'concentration',
		'psychomotor',
		'suicidalThoughts'
	];

	function setScore(key: keyof typeof p, value: number) {
		(p[key] as PhqScore) = value as PhqScore;
	}
</script>

<Fieldset legend="PHQ-9 Depression Screen">
	<p class="hint">
		Over the last 2 weeks, how often have you been bothered by any of the following problems?
	</p>

	{#each phqKeys as key, i (key)}
		<Field label={`${i + 1}. ${phq9Questions[i]}`}>
			<RadioGroup label={`PHQ-9 item ${i + 1}`}>
				{#each phqAnswerOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`phq_${key}`}
							value={opt.value}
							checked={p[key] === opt.value}
							onchange={() => setScore(key, opt.value)}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
