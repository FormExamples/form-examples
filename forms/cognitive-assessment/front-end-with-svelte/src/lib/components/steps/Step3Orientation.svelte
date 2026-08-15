<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';

	const o = assessment.data.orientationScores;

	type ScoreKey = keyof typeof o;

	const timeItems: { key: ScoreKey; label: string }[] = [
		{ key: 'year', label: 'What year is it?' },
		{ key: 'season', label: 'What season is it?' },
		{ key: 'date', label: 'What is the date today?' },
		{ key: 'day', label: 'What day of the week is it?' },
		{ key: 'month', label: 'What month is it?' }
	];

	const placeItems: { key: ScoreKey; label: string }[] = [
		{ key: 'country', label: 'What country are we in?' },
		{ key: 'county', label: 'What county/region are we in?' },
		{ key: 'town', label: 'What town/city are we in?' },
		{ key: 'hospital', label: 'What building are we in?' },
		{ key: 'floor', label: 'What floor are we on?' }
	];

	function setScore(key: ScoreKey, value: 0 | 1) {
		o[key] = value;
	}
</script>

<Fieldset legend="Orientation">
	<p class="hint">Orientation to time and place (10 points total).</p>

	<h3 class="mmse-subhead">Orientation to Time (5 points)</h3>
	{#each timeItems as item (item.key)}
		<div class="mmse-item">
			<p class="mmse-q">{item.label}</p>
			<fieldset class="radio-group" aria-label={item.label}>
				<label><input type="radio" class="radio-input" name="orient-{item.key}" checked={o[item.key] === 1} onchange={() => setScore(item.key, 1)} /> Correct (1)</label>
				<label><input type="radio" class="radio-input" name="orient-{item.key}" checked={o[item.key] === 0} onchange={() => setScore(item.key, 0)} /> Incorrect (0)</label>
			</fieldset>
		</div>
	{/each}

	<h3 class="mmse-subhead">Orientation to Place (5 points)</h3>
	{#each placeItems as item (item.key)}
		<div class="mmse-item">
			<p class="mmse-q">{item.label}</p>
			<fieldset class="radio-group" aria-label={item.label}>
				<label><input type="radio" class="radio-input" name="orient-{item.key}" checked={o[item.key] === 1} onchange={() => setScore(item.key, 1)} /> Correct (1)</label>
				<label><input type="radio" class="radio-input" name="orient-{item.key}" checked={o[item.key] === 0} onchange={() => setScore(item.key, 0)} /> Incorrect (0)</label>
			</fieldset>
		</div>
	{/each}
</Fieldset>

<style>
	.mmse-subhead {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 1rem 0 0.5rem;
	}
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
