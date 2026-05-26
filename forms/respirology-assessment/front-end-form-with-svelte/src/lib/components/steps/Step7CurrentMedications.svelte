<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const m = assessment.data.currentMedications;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const deliveryOptions = [
		{ value: 'nasal-cannula', label: 'Nasal Cannula' },
		{ value: 'venturi', label: 'Venturi Mask' },
		{ value: 'non-rebreather', label: 'Non-Rebreather Mask' },
		{ value: 'cpap', label: 'CPAP' },
		{ value: 'bipap', label: 'BiPAP' }
	];
</script>

<Fieldset legend="Current Medications">
	<p class="hint">Respiratory medications and therapies.</p>

	<Field label="Inhalers">
		<MedicationEntry bind:medications={m.inhalers} />
	</Field>

	<Field label="Nebulizers">
		<MedicationEntry bind:medications={m.nebulizers} />
	</Field>

	<Field label="Are you on long-term oxygen therapy?">
		<RadioGroup label="Oxygen therapy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="oxygenTherapy" value={opt.value} bind:group={m.oxygenTherapy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.oxygenTherapy === 'yes'}
		<Field label="Oxygen Delivery Method" inputId="oxygenDelivery">
			<Select id="oxygenDelivery" label="Oxygen delivery" bind:value={m.oxygenDelivery}>
				<option value="">-- Select --</option>
				{#each deliveryOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Flow Rate (L/min)" inputId="flowRate">
			<NumberInput id="flowRate" label="Flow rate" min={0} max={15} bind:value={m.oxygenFlowRate} />
		</Field>
	{/if}

	<Field label="Are you on oral corticosteroids?">
		<RadioGroup label="Oral steroids">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="oralSteroids" value={opt.value} bind:group={m.oralSteroids} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.oralSteroids === 'yes'}
		<Field label="Steroid Details" inputId="steroidDetails">
			<TextInput id="steroidDetails" label="Steroid details" bind:value={m.oralSteroidDetails} />
		</Field>
	{/if}

	<Field label="Are you currently taking antibiotics for a respiratory infection?">
		<RadioGroup label="Antibiotics">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="antibiotics" value={opt.value} bind:group={m.antibiotics} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.antibiotics === 'yes'}
		<Field label="Antibiotic Details" inputId="antibioticDetails">
			<TextInput id="antibioticDetails" label="Antibiotic details" bind:value={m.antibioticDetails} />
		</Field>
	{/if}
</Fieldset>
