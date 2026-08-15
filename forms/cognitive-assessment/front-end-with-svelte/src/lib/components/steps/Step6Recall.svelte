<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';

	const rec = assessment.data.recallScores;

	type ScoreKey = keyof typeof rec;

	const items: { key: ScoreKey; label: string }[] = [
		{ key: 'object1', label: 'Recall object 1' },
		{ key: 'object2', label: 'Recall object 2' },
		{ key: 'object3', label: 'Recall object 3' }
	];

	function setScore(key: ScoreKey, value: 0 | 1) {
		rec[key] = value;
	}
</script>

<Fieldset legend="Recall">
	<p class="hint">Ask the patient to recall the three objects named in the Registration step (3 points).</p>

	{#each items as item (item.key)}
		<div class="mmse-item">
			<p class="mmse-q">{item.label}</p>
			<fieldset class="radio-group" aria-label={item.label}>
				<label><input type="radio" class="radio-input" name="rec-{item.key}" checked={rec[item.key] === 1} onchange={() => setScore(item.key, 1)} /> Correct (1)</label>
				<label><input type="radio" class="radio-input" name="rec-{item.key}" checked={rec[item.key] === 0} onchange={() => setScore(item.key, 0)} /> Incorrect (0)</label>
			</fieldset>
		</div>
	{/each}
</Fieldset>

<style>
	.mmse-item {
		margin-bottom: 0.75rem;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border);
	}
	.mmse-item:last-child {
		border-bottom: 0;
	}
	.mmse-q {
		margin: 0 0 0.375rem;
		font-size: 0.9375rem;
		font-weight: 500;
	}
</style>
