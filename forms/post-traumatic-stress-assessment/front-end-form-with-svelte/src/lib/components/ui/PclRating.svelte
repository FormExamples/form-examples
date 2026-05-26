<script lang="ts">
	import type { PclItemScore } from '$lib/engine/types';

	let {
		label,
		name,
		value = $bindable(null as PclItemScore)
	}: {
		label: string;
		name: string;
		value: PclItemScore;
	} = $props();

	const choices: { score: 0 | 1 | 2 | 3 | 4; label: string }[] = [
		{ score: 0, label: 'Not at all' },
		{ score: 1, label: 'A little bit' },
		{ score: 2, label: 'Moderately' },
		{ score: 3, label: 'Quite a bit' },
		{ score: 4, label: 'Extremely' }
	];
</script>

<fieldset class="pcl-fieldset" aria-label={label}>
	<legend class="pcl-legend">{label}</legend>
	<div class="pcl-grid">
		{#each choices as c (c.score)}
			<label class="pcl-choice" class:pcl-choice--selected={value === c.score}>
				<input type="radio" class="radio-input" {name} bind:group={value} value={c.score} />
				<span><span class="pcl-score">{c.score}</span> {c.label}</span>
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.pcl-fieldset {
		border: 1px solid var(--color-border);
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		margin: 0 0 0.75rem;
	}
	.pcl-legend {
		font-size: 0.875rem;
		font-weight: 500;
		padding: 0 0.25rem;
		color: var(--color-text);
	}
	.pcl-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	@media (max-width: 640px) {
		.pcl-grid { grid-template-columns: 1fr; }
	}
	.pcl-choice {
		display: flex; align-items: center; gap: 0.375rem;
		border: 1px solid var(--color-border-strong);
		background: var(--color-surface);
		padding: 0.375rem 0.5rem;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		cursor: pointer;
	}
	.pcl-choice--selected {
		border-color: var(--color-primary);
		background: var(--color-primary-light);
		font-weight: 600;
	}
	.pcl-score {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--color-muted);
	}
</style>
