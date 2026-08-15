<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';

	const att = assessment.data.attentionScores;

	type ScoreKey = keyof typeof att;

	const items: { key: ScoreKey; label: string }[] = [
		{ key: 'serial1', label: '100 - 7 = 93' },
		{ key: 'serial2', label: '93 - 7 = 86' },
		{ key: 'serial3', label: '86 - 7 = 79' },
		{ key: 'serial4', label: '79 - 7 = 72' },
		{ key: 'serial5', label: '72 - 7 = 65' }
	];

	function setScore(key: ScoreKey, value: 0 | 1) {
		att[key] = value;
	}
</script>

<Fieldset legend="Attention & Calculation">
	<p class="hint">Serial 7s: Ask the patient to subtract 7 from 100 repeatedly (5 points). Alternative: spell WORLD backwards.</p>

	{#each items as item (item.key)}
		<div class="mmse-item">
			<p class="mmse-q">{item.label}</p>
			<fieldset class="radio-group" aria-label={item.label}>
				<label><input type="radio" class="radio-input" name="att-{item.key}" checked={att[item.key] === 1} onchange={() => setScore(item.key, 1)} /> Correct (1)</label>
				<label><input type="radio" class="radio-input" name="att-{item.key}" checked={att[item.key] === 0} onchange={() => setScore(item.key, 0)} /> Incorrect (0)</label>
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
