<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateAuditcGrade } from '$lib/engine/auditc-grader';
	import { pointColor, QUANTITY_OPTIONS } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const items = assessment.data.items;
	const point = $derived(calculateAuditcGrade(assessment.data).typicalQuantityPoint);
</script>

<Fieldset legend="Step 4 of 6 — Q2 Typical quantity">
	<p class="hint">
		Item 2 (Q2) — scores the chosen response 0-4, in UK units on a day when drinking.
	</p>

	<Field
		label="How many units of alcohol do you drink on a typical day when you are drinking?"
		inputId="items-typicalQuantity"
	>
		<RadioGroup
			label="How many units of alcohol do you drink on a typical day when you are drinking?"
		>
			{#each QUANTITY_OPTIONS as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="items-typicalQuantity"
						value={opt.value}
						bind:group={items.typicalQuantity}
					/>
					{opt.label} ({opt.value})
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Item 2 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} of 4
		</span>
	</Field>
</Fieldset>
