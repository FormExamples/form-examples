<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);
</script>

<Fieldset legend="13. Functional &amp; Quality-of-life Impact">
	<p class="hint">A simple 0–4 self-report composite (0 = no difficulty, 4 = unable) covering difficulty with reading, driving, and daily activities.</p>

	<Field label="Difficulty reading (0–4)" inputId="functional-functionalDifficultyReading">
		<NumberInput id="functional-functionalDifficultyReading" label="Difficulty reading (0–4)" min={0} max={4} step="1" bind:value={d.functional.functionalDifficultyReading} />
	</Field>
	<Field label="Difficulty driving (0–4)" inputId="functional-functionalDifficultyDriving">
		<NumberInput id="functional-functionalDifficultyDriving" label="Difficulty driving (0–4)" min={0} max={4} step="1" bind:value={d.functional.functionalDifficultyDriving} />
	</Field>
	<Field label="Difficulty with daily activities (0–4)" inputId="functional-functionalDifficultyDailyActivities">
		<NumberInput id="functional-functionalDifficultyDailyActivities" label="Difficulty with daily activities (0–4)" min={0} max={4} step="1" bind:value={d.functional.functionalDifficultyDailyActivities} />
	</Field>
	<Field label="Functional impact score" inputId="functional-functionalImpactScore" description="Computed live: the sum of the three sub-scores above, 0–12.">
		<input id="functional-functionalImpactScore" class="text-input" type="text" readonly value={result.functionalImpactScore === null ? '—' : `${result.functionalImpactScore} / 12`} />
	</Field>
	<Field label="Functional impact notes" inputId="functional-functionalImpactNotes">
		<TextAreaInput id="functional-functionalImpactNotes" label="Functional impact notes" rows={2} bind:value={d.functional.functionalImpactNotes} />
	</Field>
</Fieldset>
