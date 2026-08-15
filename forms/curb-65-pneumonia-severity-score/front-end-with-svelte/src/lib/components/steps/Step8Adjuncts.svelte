<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const a = assessment.data.adjuncts;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 8 of 9 — Adjuncts (advisory)">
	<p class="hint">Recorded for context but not part of the CURB-65 / CRB-65 score.</p>

	<Field
		label="Oxygen saturation (SpO2, %)"
		description="Raises a hypoxia flag when below 92%."
		inputId="adjuncts-oxygenSaturation"
	>
		<NumberInput
			id="adjuncts-oxygenSaturation"
			label="Oxygen saturation (SpO2, %)"
			min={0}
			max={100}
			step={1}
			bind:value={a.oxygenSaturation}
		/>
	</Field>

	<Field label="Temperature (degrees Celsius)" inputId="adjuncts-temperatureC">
		<NumberInput
			id="adjuncts-temperatureC"
			label="Temperature (degrees Celsius)"
			min={25}
			max={45}
			step={0.1}
			bind:value={a.temperatureC}
		/>
	</Field>

	<Field label="Significant comorbidity present?">
		<RadioGroup label="Significant comorbidity present?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="adjuncts-significantComorbidity"
						value={opt.value}
						bind:group={a.significantComorbidity}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Bilateral / multilobar changes on chest imaging?">
		<RadioGroup label="Bilateral / multilobar changes on chest imaging?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="adjuncts-multilobarChanges"
						value={opt.value}
						bind:group={a.multilobarChanges}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
