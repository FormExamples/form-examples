<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { scoreCns } from '#lib/engine/sofa-rules.js';
	import { subScoreColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const cns = assessment.data.cns;
	const sub = $derived(scoreCns(assessment.data).score);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 7 of 9 — Central nervous system">
	<p class="hint">
		Glasgow Coma Scale total (3-15). Bands: 15 = 0, 13-14 = 1, 10-12 = 2, 6-9 = 3, &lt; 6 = 4. If
		the patient is sedated, use the pre-sedation GCS or best available estimate.
	</p>

	<Field label="Glasgow Coma Scale total" inputId="cns-glasgowComaScale">
		<NumberInput
			id="cns-glasgowComaScale"
			label="Glasgow Coma Scale total"
			min={3}
			max={15}
			step={1}
			bind:value={cns.glasgowComaScale}
		/>
	</Field>

	<Field label="Is the patient sedated?">
		<RadioGroup label="Is the patient sedated?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cns-sedated"
						value={opt.value}
						bind:group={cns.sedated}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="CNS sub-score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subScoreColor(sub)}">
			{sub === null ? 'Not scored' : `Sub-score ${sub}`}
		</span>
	</Field>
</Fieldset>
