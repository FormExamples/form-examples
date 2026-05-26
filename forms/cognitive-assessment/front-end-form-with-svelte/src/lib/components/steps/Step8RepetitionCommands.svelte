<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';

	const lang = assessment.data.repetitionCommands;

	type ScoreKey = keyof typeof lang;

	const repetitionItems: { key: ScoreKey; label: string; instruction: string }[] = [
		{ key: 'repetition', label: 'Repetition', instruction: 'Ask patient to repeat: "No ifs, ands, or buts"' }
	];

	const commandItems: { key: ScoreKey; label: string; instruction: string }[] = [
		{ key: 'command1', label: 'Command 1', instruction: 'Take this paper in your right hand' },
		{ key: 'command2', label: 'Command 2', instruction: 'Fold it in half' },
		{ key: 'command3', label: 'Command 3', instruction: 'Put it on the floor' }
	];

	const readWriteItems: { key: ScoreKey; label: string; instruction: string }[] = [
		{ key: 'reading', label: 'Reading', instruction: 'Show card: "CLOSE YOUR EYES". Ask patient to read and do what it says.' },
		{ key: 'writing', label: 'Writing', instruction: 'Ask patient to write a sentence (must contain a subject and a verb, and make sense).' }
	];

	function setScore(key: ScoreKey, value: 0 | 1) {
		lang[key] = value;
	}
</script>

<Fieldset legend="Repetition & Commands">
	<p class="hint">Repetition (1 point), three-stage command (3 points), reading (1 point), and writing (1 point).</p>

	<h3 class="mmse-subhead">Repetition (1 point)</h3>
	{#each repetitionItems as item (item.key)}
		<div class="mmse-item">
			<p class="mmse-q">{item.label}</p>
			<p class="mmse-ex">{item.instruction}</p>
			<fieldset class="radio-group" aria-label={item.label}>
				<label><input type="radio" class="radio-input" name="lang-{item.key}" checked={lang[item.key] === 1} onchange={() => setScore(item.key, 1)} /> Correct (1)</label>
				<label><input type="radio" class="radio-input" name="lang-{item.key}" checked={lang[item.key] === 0} onchange={() => setScore(item.key, 0)} /> Incorrect (0)</label>
			</fieldset>
		</div>
	{/each}

	<h3 class="mmse-subhead">Three-Stage Command (3 points)</h3>
	{#each commandItems as item (item.key)}
		<div class="mmse-item">
			<p class="mmse-q">{item.label}</p>
			<p class="mmse-ex">{item.instruction}</p>
			<fieldset class="radio-group" aria-label={item.label}>
				<label><input type="radio" class="radio-input" name="lang-{item.key}" checked={lang[item.key] === 1} onchange={() => setScore(item.key, 1)} /> Correct (1)</label>
				<label><input type="radio" class="radio-input" name="lang-{item.key}" checked={lang[item.key] === 0} onchange={() => setScore(item.key, 0)} /> Incorrect (0)</label>
			</fieldset>
		</div>
	{/each}

	<h3 class="mmse-subhead">Reading & Writing (2 points)</h3>
	{#each readWriteItems as item (item.key)}
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
