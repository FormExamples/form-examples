<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.pretest;
	const options = [
		{ value: 'low', label: 'Low' },
		{ value: 'not-low', label: 'Not low (moderate or high)' }
	];
</script>

<Fieldset legend="Step 3 of 6 — Pre-test probability">
	<p class="hint">
		PERC applies only when your gestalt pre-test probability of pulmonary embolism is
		<strong>low</strong>. If it is moderate or high, PERC cannot rule out PE and the result is
		PERC-positive regardless of the eight criteria — proceed to D-dimer and/or imaging.
	</p>

	<Field label="Gestalt pre-test probability of PE" required>
		<RadioGroup label="Gestalt pre-test probability of PE">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="pretest-pretestProbability"
						value={opt.value}
						bind:group={p.pretestProbability}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
