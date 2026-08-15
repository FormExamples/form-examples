<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';

	const reg = assessment.data.registrationScores;

	type ScoreKey = keyof typeof reg;

	const items: { key: ScoreKey; label: string; example: string }[] = [
		{ key: 'object1', label: 'Object 1', example: 'e.g., Apple' },
		{ key: 'object2', label: 'Object 2', example: 'e.g., Table' },
		{ key: 'object3', label: 'Object 3', example: 'e.g., Penny' }
	];

	function setScore(key: ScoreKey, value: 0 | 1) {
		reg[key] = value;
	}
</script>

<Fieldset legend="Registration">
	<p class="hint">Name three objects and ask the patient to repeat them (3 points). Record the number of trials needed to learn all three.</p>

	{#each items as item (item.key)}
		<div class="mmse-item">
			<p class="mmse-q">{item.label}</p>
			<p class="mmse-ex">{item.example}</p>
			<fieldset class="radio-group" aria-label={item.label}>
				<label><input type="radio" class="radio-input" name="reg-{item.key}" checked={reg[item.key] === 1} onchange={() => setScore(item.key, 1)} /> Correct (1)</label>
				<label><input type="radio" class="radio-input" name="reg-{item.key}" checked={reg[item.key] === 0} onchange={() => setScore(item.key, 0)} /> Incorrect (0)</label>
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
