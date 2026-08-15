<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCentorGrade } from '#lib/engine/centor-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.fever;
	const point = $derived(calculateCentorGrade(assessment.data).feverPoint);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 5 of 8 — Fever">
	<p class="hint">
		Criterion 3 — scores 1 point when the temperature is above 38 °C or there is a history of fever.
		A measured temperature above 38 °C sets the criterion even if the flag is left unanswered.
	</p>

	<Field label="Temperature above 38 °C or a history of fever?">
		<RadioGroup label="Temperature above 38 °C or a history of fever?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="fever-feverOver38"
						value={opt.value}
						bind:group={f.feverOver38}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Measured temperature (°C)"
		description="Optional. A reading above 38.0 °C scores the fever criterion."
		inputId="fever-measuredTemperatureCelsius"
	>
		<NumberInput
			id="fever-measuredTemperatureCelsius"
			label="Measured temperature in Celsius"
			min={30}
			max={45}
			step={0.1}
			bind:value={f.measuredTemperatureCelsius}
		/>
	</Field>

	<Field label="Criterion 3 point">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} point {point === 1 ? '(positive)' : '(negative)'}
		</span>
	</Field>
</Fieldset>
