<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.psychosocial;
	const severityOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Psychosocial">
	<p class="hint">Emotional wellbeing, coping, and support.</p>

	<Field label="Distress Thermometer (0-10)" description="0 = no distress, 10 = extreme distress" inputId="distress">
		<NumberInput id="distress" label="Distress" min={0} max={10} step={1} bind:value={p.distressThermometer} />
	</Field>

	<Field label="Anxiety" inputId="anxiety">
		<Select id="anxiety" label="Anxiety" bind:value={p.anxiety}>
			<option value="">-- Select --</option>
			{#each severityOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Depression" inputId="depression">
		<Select id="depression" label="Depression" bind:value={p.depression}>
			<option value="">-- Select --</option>
			{#each severityOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Coping Ability" inputId="copingAbility">
		<Select id="copingAbility" label="Coping Ability" bind:value={p.copingAbility}>
			<option value="">-- Select --</option>
			<option value="coping-well">Coping well</option>
			<option value="some-difficulty">Some difficulty coping</option>
			<option value="significant-difficulty">Significant difficulty coping</option>
		</Select>
	</Field>

	<Field label="Support System" inputId="supportSystem">
		<Select id="supportSystem" label="Support System" bind:value={p.supportSystem}>
			<option value="">-- Select --</option>
			<option value="strong">Strong support</option>
			<option value="moderate">Moderate support</option>
			<option value="limited">Limited support</option>
			<option value="none">No support</option>
		</Select>
	</Field>

	<Field label="Advance care planning documented?">
		<RadioGroup label="Advance care planning">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="advanceCare" value={opt.value} bind:group={p.advanceCarePlanning} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.advanceCarePlanning === 'yes'}
		<Field label="Advance care planning details" inputId="advanceCareDetails">
			<TextAreaInput id="advanceCareDetails" label="Advance care details" rows={2} placeholder="e.g., DNACPR, preferred place of care" bind:value={p.advanceCareDetails} />
		</Field>
	{/if}
</Fieldset>
