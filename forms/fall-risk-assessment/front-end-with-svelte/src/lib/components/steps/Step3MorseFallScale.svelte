<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { mfsItems } from '$lib/engine/mfs-rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.mfs;
</script>

<Fieldset legend="Morse Fall Scale (MFS)">
	<p class="hint">
		Six-item validated bedside instrument. Total score 0-125: 0-24 Low, 25-44 Moderate, ≥45 High.
	</p>

	{#each mfsItems as item (item.id)}
		<fieldset class="mfs-item">
			<legend><span class="mfs-id">{item.id}</span> {item.label}</legend>
			<p class="hint mfs-desc">{item.description}</p>
			<RadioGroup label={item.label}>
				{#each item.options as opt (opt.score)}
					<label class="mfs-option">
						<input type="radio" class="radio-input" name={`mfs-${item.field}`} value={opt.score} bind:group={m[item.field]} />
						<span>{opt.label}</span>
						<span class="score-tag" aria-label={`score ${opt.score}`}>+{opt.score}</span>
					</label>
				{/each}
			</RadioGroup>
		</fieldset>
	{/each}
</Fieldset>

<style>
	.mfs-item {
		border: 1px solid var(--color-base-300, #d1d5db);
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		margin: 0 0 1rem;
	}
	.mfs-item legend {
		font-weight: 600;
		padding: 0 0.25rem;
	}
	.mfs-id {
		font-family: monospace;
		font-size: 0.75rem;
		opacity: 0.6;
		margin-right: 0.25rem;
	}
	.mfs-desc {
		margin: 0 0 0.5rem;
	}
	.mfs-option {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.score-tag {
		margin-left: auto;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		opacity: 0.7;
	}
</style>
