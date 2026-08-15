<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';

	const lang = assessment.data.languageScores;

	type ScoreKey = keyof typeof lang;

	const items: { key: ScoreKey; label: string; instruction: string }[] = [
		{ key: 'naming1', label: 'Naming 1', instruction: 'Show a pencil. Ask: "What is this?"' },
		{ key: 'naming2', label: 'Naming 2', instruction: 'Show a watch. Ask: "What is this?"' }
	];

	function setScore(key: ScoreKey, value: 0 | 1) {
		lang[key] = value;
	}
</script>

<Fieldset legend="Language">
	<p class="hint">Naming tasks (2 points). Show objects and ask the patient to name them.</p>

	{#each items as item (item.key)}
		<div class="mmse-item">
			<p class="mmse-q">{item.label}</p>
			<p class="mmse-ex">{item.instruction}</p>
			<fieldset class="radio-group" aria-label={item.label}>
				<label><input type="radio" class="radio-input" name="lang-{item.key}" checked={lang[item.key] === 1} onchange={() => setScore(item.key, 1)} /> Correct (1)</label>
				<label><input type="radio" class="radio-input" name="lang-{item.key}" checked={lang[item.key] === 0} onchange={() => setScore(item.key, 0)} /> Incorrect (0)</label>
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
		margin: 0 0 0.125rem;
		font-size: 0.9375rem;
		font-weight: 500;
	}
	.mmse-ex {
		margin: 0 0 0.375rem;
		font-size: 0.75rem;
		color: var(--color-muted);
	}
</style>
