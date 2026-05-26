<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const l = assessment.data.laboratoryResults;
	const bloodTypes = ['A', 'B', 'AB', 'O'];
	const rhOptions = [{ value: 'positive', label: 'Positive (+)' }, { value: 'negative', label: 'Negative (-)' }];
	const gbsOptions = [{ value: 'yes', label: 'Positive' }, { value: 'no', label: 'Negative' }];
</script>

<Fieldset legend="Laboratory Results">
	<p class="hint">Blood work and test results.</p>

	<div class="field-grid">
		<Field label="Blood Type" required inputId="bloodType">
			<Select id="bloodType" label="Blood type" required bind:value={l.bloodType}>
				<option value="">-- Select --</option>
				{#each bloodTypes as t}<option value={t}>Type {t}</option>{/each}
			</Select>
		</Field>

		<Field label="Rh Factor" required>
			<RadioGroup label="Rh factor">
				{#each rhOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="rhFactor" value={opt.value} bind:group={l.rhFactor} required /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Hemoglobin (g/dL)" inputId="hemoglobin">
			<NumberInput id="hemoglobin" label="Hemoglobin" min={3} max={20} step={0.1} bind:value={l.hemoglobin} />
		</Field>
		<Field label="Glucose (mmol/L)" inputId="glucose">
			<NumberInput id="glucose" label="Glucose" min={1} max={30} step={0.1} bind:value={l.glucose} />
		</Field>
	</div>

	<Field label="Urinalysis Results" inputId="urinalysis">
		<TextInput id="urinalysis" label="Urinalysis" bind:value={l.urinalysis} />
	</Field>

	<Field label="Group B Streptococcus (GBS)">
		<RadioGroup label="GBS">
			{#each gbsOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="gbs" value={opt.value} bind:group={l.gbs} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
