<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateAuditcGrade } from '#lib/engine/auditc-grader.js';
	import { pointColor, HEAVY_EPISODE_OPTIONS } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const items = assessment.data.items;
	const point = $derived(calculateAuditcGrade(assessment.data).heavyEpisodeFrequencyPoint);
</script>

<Fieldset legend="Step 5 of 6 — Q3 Heavy episodic drinking">
	<p class="hint">
		Item 3 (Q3) — scores the chosen response 0-4. Threshold: 6 or more units (female) / 8 or more
		units (male) on a single occasion.
	</p>

	<Field
		label="How often have you had 6 or more units (female) / 8 or more units (male) on a single occasion in the last year?"
		inputId="items-heavyEpisodeFrequency"
	>
		<RadioGroup
			label="How often have you had 6 or more units (female) / 8 or more units (male) on a single occasion in the last year?"
		>
			{#each HEAVY_EPISODE_OPTIONS as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="items-heavyEpisodeFrequency"
						value={opt.value}
						bind:group={items.heavyEpisodeFrequency}
					/>
					{opt.label} ({opt.value})
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Item 3 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} of 4
		</span>
	</Field>
</Fieldset>
