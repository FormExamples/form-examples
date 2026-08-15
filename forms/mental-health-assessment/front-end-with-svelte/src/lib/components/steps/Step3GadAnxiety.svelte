<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gad7Questions, gadAnswerOptions } from '#lib/engine/mh-rules.js';
	import type { GadScore } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const g = assessment.data.gadResponses;

	const gadKeys: (keyof typeof g)[] = [
		'nervousness',
		'uncontrollableWorry',
		'excessiveWorry',
		'troubleRelaxing',
		'restlessness',
		'irritability',
		'fearfulness'
	];

	function setScore(key: keyof typeof g, value: number) {
		(g[key] as GadScore) = value as GadScore;
	}
</script>

<Fieldset legend="GAD-7 Anxiety Screen">
	<p class="hint">
		Over the last 2 weeks, how often have you been bothered by any of the following problems?
	</p>

	{#each gadKeys as key, i (key)}
		<Field label={`${i + 1}. ${gad7Questions[i]}`}>
			<RadioGroup label={`GAD-7 item ${i + 1}`}>
				{#each gadAnswerOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`gad_${key}`}
							value={opt.value}
							checked={g[key] === opt.value}
							onchange={() => setScore(key, opt.value)}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
