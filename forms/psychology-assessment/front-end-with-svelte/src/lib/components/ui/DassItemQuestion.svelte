<script lang="ts">
	import type { DassItem } from '$lib/engine/types';

	let {
		itemNumber,
		text,
		name,
		value = $bindable<DassItem>(null)
	}: {
		itemNumber: number;
		text: string;
		name: string;
		value: DassItem;
	} = $props();

	const options: { value: 0 | 1 | 2 | 3; label: string; sub: string }[] = [
		{ value: 0, label: '0', sub: 'Did not apply to me at all' },
		{ value: 1, label: '1', sub: 'Applied to me to some degree, or some of the time' },
		{ value: 2, label: '2', sub: 'Applied to me to a considerable degree, or a good part of time' },
		{ value: 3, label: '3', sub: 'Applied to me very much, or most of the time' }
	];

	function selectValue(v: 0 | 1 | 2 | 3) { value = v; }
</script>

<fieldset class="dass-fieldset" aria-label={text}>
	<legend class="dass-legend">
		<span class="dass-num">{itemNumber}.</span>{text}
	</legend>
	<div class="dass-grid">
		{#each options as opt (opt.value)}
			<label class="dass-choice" class:dass-choice--selected={value === opt.value}>
				<input type="radio" class="radio-input" {name} checked={value === opt.value} onchange={() => selectValue(opt.value)} />
				<span class="dass-choice-num">{opt.label}</span>
				<span class="dass-choice-sub">{opt.sub}</span>
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.dass-fieldset {
		border: 0;
		padding: 0 0 1rem;
		margin: 0;
		border-bottom: 1px solid var(--color-border);
	}
	.dass-fieldset:last-child { border-bottom: 0; }
	.dass-legend {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text);
		display: block;
		margin-bottom: 0.5rem;
	}
	.dass-num { color: var(--color-muted); margin-right: 0.5rem; }
	.dass-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.5rem;
	}
	@media (max-width: 640px) {
		.dass-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
	}
	.dass-choice {
		display: flex; flex-direction: column; align-items: center; gap: 0.125rem;
		padding: 0.5rem;
		text-align: center;
		border: 1px solid var(--color-border-strong);
		background: var(--color-surface);
		border-radius: 0.375rem;
		cursor: pointer;
	}
	.dass-choice--selected {
		border-color: var(--color-primary);
		background: var(--color-primary-light);
		font-weight: 600;
	}
	.dass-choice input { position: absolute; opacity: 0; pointer-events: none; }
	.dass-choice-num { font-size: 1rem; font-weight: 700; }
	.dass-choice-sub { font-size: 0.75rem; color: var(--color-muted); }
</style>
