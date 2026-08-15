<script lang="ts">
	// LikertItem — a single 1-5 Likert agreement radio group for one survey
	// item. Emits the Lily fieldset/radio-group class contract.
	import { LIKERT_AGREEMENT } from '#lib/engine/rules.js';
	import type { LikertValue } from '#lib/engine/types.js';

	let {
		id,
		label,
		value = $bindable<LikertValue>(null)
	}: {
		id: string;
		label: string;
		value?: LikertValue;
	} = $props();
</script>

<fieldset class="field likert-group" {id}>
	<legend class="label">
		<span class="item-id">{id.toUpperCase()}</span>
		{label}
	</legend>
	<div class="radio-group likert-options" role="radiogroup" aria-label={label}>
		{#each LIKERT_AGREEMENT as opt (opt.value)}
			<label class="likert-option" for={`${id}-${opt.value}`}>
				<input
					class="radio-input"
					type="radio"
					id={`${id}-${opt.value}`}
					name={id}
					value={opt.value}
					checked={value === opt.value}
					onchange={() => (value = opt.value as LikertValue)}
				/>
				<span class="likert-num">{opt.value}</span>
				<span class="likert-label">{opt.label}</span>
			</label>
		{/each}
	</div>
</fieldset>

<style>
	.likert-group {
		margin-bottom: 1.25rem;
	}
	.item-id {
		display: inline-block;
		margin-right: 0.5rem;
		font-family: var(--font-mono, monospace);
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--color-primary, currentColor);
	}
	.likert-options {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	.likert-option {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: 0.5rem 0.25rem;
		border: 1px solid var(--color-base-300, #ccc);
		border-radius: 0.5rem;
		cursor: pointer;
		text-align: center;
		font-size: 0.8rem;
	}
	.likert-num {
		font-weight: 700;
	}
	@media (max-width: 640px) {
		.likert-options {
			grid-template-columns: 1fr;
		}
		.likert-option {
			flex-direction: row;
			justify-content: flex-start;
			gap: 0.5rem;
			text-align: left;
		}
	}
</style>
