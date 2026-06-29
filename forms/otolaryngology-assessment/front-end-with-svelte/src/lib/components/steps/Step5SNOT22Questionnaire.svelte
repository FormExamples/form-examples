<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { SNOT22_ITEMS, SNOT22_OPTIONS } from '$lib/engine/types';
	import { calculateSnot22 } from '$lib/engine/snot22-grader';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';

	const s = assessment.data.snot22;

	// Live running total as the patient completes the questionnaire.
	const running = $derived(calculateSnot22(assessment.data));
</script>

<Fieldset legend="SNOT-22 Questionnaire">
	<p class="hint">
		Rate each symptom over the past two weeks from 0 (no problem) to 5 (as bad as it can be). Total
		score ranges 0-110.
	</p>

	<div class="running-total">
		Running total: <strong>{running.totalScore}</strong> / 110
		<span class="text-base-content/60">({running.answeredCount}/22 answered)</span>
	</div>

	<div class="snot-grid" role="group" aria-label="SNOT-22 items">
		<div class="snot-head" aria-hidden="true">
			<span></span>
			{#each SNOT22_OPTIONS as o (o.value)}
				<span class="snot-head-cell" title={o.label}>{o.value}</span>
			{/each}
		</div>
		{#each SNOT22_ITEMS as item, idx (item.key)}
			<fieldset class="snot-row">
				<legend class="snot-label">{idx + 1}. {item.label}</legend>
				{#each SNOT22_OPTIONS as o (o.value)}
					<label class="snot-opt" title={o.label}>
						<input
							type="radio"
							class="radio-input"
							name={`snot-${item.key}`}
							value={o.value}
							bind:group={s[item.key]}
						/>
						<span class="snot-opt-num">{o.value}</span>
					</label>
				{/each}
			</fieldset>
		{/each}
	</div>
</Fieldset>

<style>
	.running-total {
		margin-bottom: 1rem;
		font-size: 0.95rem;
	}
	.snot-grid {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.snot-head {
		display: grid;
		grid-template-columns: 1fr repeat(6, 2.25rem);
		gap: 0.25rem;
		align-items: center;
		padding: 0 0.25rem;
		font-size: 0.75rem;
		color: var(--color-muted, currentColor);
	}
	.snot-head-cell {
		text-align: center;
	}
	.snot-row {
		display: grid;
		grid-template-columns: 1fr repeat(6, 2.25rem);
		gap: 0.25rem;
		align-items: center;
		border: 0;
		padding: 0.25rem;
		margin: 0;
	}
	.snot-row:nth-child(odd) {
		background: var(--color-base-200, transparent);
		border-radius: 0.375rem;
	}
	.snot-label {
		font-size: 0.875rem;
		padding: 0;
	}
	.snot-opt {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.snot-opt-num {
		display: none;
	}
	@media (max-width: 640px) {
		.snot-head {
			display: none;
		}
		.snot-row {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
		.snot-opt {
			justify-content: flex-start;
			gap: 0.4rem;
		}
		.snot-opt-num {
			display: inline;
			font-size: 0.8rem;
		}
	}
</style>
