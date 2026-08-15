<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateAuditcGrade } from '#lib/engine/auditc-grader.js';
	import { pointColor, FREQUENCY_OPTIONS } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const items = assessment.data.items;
	const point = $derived(calculateAuditcGrade(assessment.data).frequencyOfDrinkingPoint);
</script>

<Fieldset legend="Step 3 of 6 — Q1 Frequency of drinking">
	<p class="hint">
		Item 1 (Q1) — scores the chosen response 0-4. A unit is 8 g / 10 mL of pure alcohol.
	</p>

	<Field
		label="How often do you have a drink containing alcohol?"
		inputId="items-frequencyOfDrinking"
	>
		<RadioGroup label="How often do you have a drink containing alcohol?">
			{#each FREQUENCY_OPTIONS as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="items-frequencyOfDrinking"
						value={opt.value}
						bind:group={items.frequencyOfDrinking}
					/>
					{opt.label} ({opt.value})
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Item 1 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} of 4
		</span>
	</Field>
</Fieldset>
