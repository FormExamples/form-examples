<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { phq9Items } from '#lib/engine/sad-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const m = assessment.data.currentMood;
</script>

<Fieldset legend="Current Mood Assessment (PHQ-9)">
	<p class="hint">
		Over the last 2 weeks, how often have you been bothered by any of the following problems? Each
		item is scored 0 (Not at all) to 3 (Nearly every day).
	</p>

	{#each phq9Items as item (item.id)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each item.options as opt (opt.value)}
					<label
						><input
							type="radio"
							class="radio-input"
							name={item.id}
							value={opt.value}
							bind:group={m.phq9[item.field]}
						/> {opt.value} — {opt.label}</label
					>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field
		label="If you have had any problems, how difficult have they made it to do your work, take care of things at home, or get along with other people?"
		inputId="difficultyLevel"
	>
		<Select id="difficultyLevel" label="Functional difficulty" bind:value={m.difficultyLevel}>
			<option value="">-- Select --</option>
			<option value="not-difficult">Not difficult at all</option>
			<option value="somewhat">Somewhat difficult</option>
			<option value="very">Very difficult</option>
			<option value="extremely">Extremely difficult</option>
		</Select>
	</Field>
</Fieldset>
