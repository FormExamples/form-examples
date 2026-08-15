<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import EpdsItemField from './EpdsItemField.svelte';
	import { itemByNumber, scoreForOption } from '#lib/engine/epds-rules.js';

	const item10 = itemByNumber(10)!;
	const raw = $derived(assessment.data.items.item10);
	const score = $derived(scoreForOption('reverse', raw));
	const answered = $derived(raw !== null && raw !== undefined);
	const flag = $derived(score !== null && score > 0);
</script>

<Fieldset legend="Step 5 of 6 — Item 10 — safety item">
	<p class="hint">
		This item asks about thoughts of self-harm. Any answer other than "Never" prompts an immediate
		safety review, regardless of the total score.
	</p>

	<EpdsItemField item={item10} />

	<Field label="Item 10 safety check">
		{#if !answered}
			<span class="text-sm text-base-content/60">Item 10 not yet answered.</span>
		{:else if flag}
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold bg-error text-error-content border-error"
			>
				Self-harm flag RAISED (score {score} of 3) — an immediate self-harm risk assessment is
				required, regardless of the total.
			</span>
		{:else}
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold bg-success text-success-content border-success"
			>
				No self-harm response recorded (item 10 = "Never").
			</span>
		{/if}
	</Field>
</Fieldset>
