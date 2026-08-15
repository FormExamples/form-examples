<script lang="ts">
	// Renders all HSE items for one domain as a vertical list of Likert
	// radio-groups, bound directly into the reactive store section. The first
	// radio of each item carries the item id so the ErrorSummary can anchor to a
	// real input.
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { stressItems, likertOptions } from '#lib/engine/rules.js';
	import type { DomainKey } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	let {
		domain,
		legend,
		description
	}: {
		domain: DomainKey;
		legend: string;
		description: string;
	} = $props();

	// Live reference to the store section; identity preserved across loadForId.
	const section = $derived(assessment.data[domain] as unknown as Record<string, number | null>);
	const items = $derived(stressItems.filter((it) => it.domain === domain));
</script>

<Fieldset legend={legend}>
	<p class="hint">{description}</p>

	{#each items as item (item.id)}
		<Field label={item.label} inputId={item.id}>
			<RadioGroup label={item.label}>
				{#each likertOptions(item.scale) as opt, i (opt.value)}
					<label class="likert-option">
						<input
							type="radio"
							class="radio-input"
							id={i === 0 ? item.id : undefined}
							name={item.id}
							value={opt.value}
							bind:group={section[item.id]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>

<style>
	.likert-option {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-right: 1rem;
	}
</style>
