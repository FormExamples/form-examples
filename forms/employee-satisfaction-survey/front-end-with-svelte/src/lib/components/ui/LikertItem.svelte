<script lang="ts">
	// A single 1-5 Likert agreement item rendered as a Field + RadioGroup.
	// Positively worded: 1 = Strongly disagree, 5 = Strongly agree.
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
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

<Field {label} inputId={`${id}-1`}>
	<RadioGroup {label}>
		<div class="likert-scale">
			{#each LIKERT_AGREEMENT as opt (opt.value)}
				<label class="likert-option">
					<input
						type="radio"
						class="radio-input"
						id={`${id}-${opt.value}`}
						name={id}
						value={opt.value}
						bind:group={value}
					/>
					<span>{opt.label}</span>
				</label>
			{/each}
		</div>
	</RadioGroup>
</Field>

<style>
	.likert-scale {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.25rem;
	}
	.likert-option {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.875rem;
	}
</style>
