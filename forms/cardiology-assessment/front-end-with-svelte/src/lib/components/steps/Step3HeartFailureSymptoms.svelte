<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const h = assessment.data.heartFailureSymptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Heart Failure Symptoms">
	<p class="hint">Dyspnoea, orthopnoea, oedema, and NYHA classification.</p>

	<Field label="Do you experience shortness of breath (dyspnoea)?">
		<RadioGroup label="Do you experience shortness of breath (dyspnoea)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dyspnoea" value={opt.value} bind:group={h.dyspnoea} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if h.dyspnoea === 'yes'}
		<Field label="Is the shortness of breath on exertion?">
			<RadioGroup label="Is the shortness of breath on exertion?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="dyspnoeaOnExertion" value={opt.value} bind:group={h.dyspnoeaOnExertion} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Do you need to sit upright to breathe comfortably (orthopnoea)?">
		<RadioGroup label="Do you need to sit upright to breathe comfortably (orthopnoea)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="orthopnoea" value={opt.value} bind:group={h.orthopnoea} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you wake at night gasping for breath (PND)?">
		<RadioGroup label="Do you wake at night gasping for breath (PND)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pnd" value={opt.value} bind:group={h.pnd} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have swelling of the ankles or legs (peripheral oedema)?">
		<RadioGroup label="Do you have swelling of the ankles or legs (peripheral oedema)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="oedema" value={opt.value} bind:group={h.peripheralOedema} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="NYHA Heart Failure Class" inputId="nyhaClass">
		<Select id="nyhaClass" label="NYHA Heart Failure Class" bind:value={h.nyhaClass}>
			<option value="">-- Select --</option>
			<option value="1">Class I - No limitation of physical activity</option>
			<option value="2">Class II - Slight limitation of physical activity</option>
			<option value="3">Class III - Marked limitation of physical activity</option>
			<option value="4">Class IV - Symptoms at rest</option>
		</Select>
	</Field>
</Fieldset>
