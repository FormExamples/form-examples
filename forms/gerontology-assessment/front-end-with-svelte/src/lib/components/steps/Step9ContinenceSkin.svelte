<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const c = assessment.data.continenceSkin;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Continence & Skin">
	<p class="hint">Urinary and faecal incontinence, pressure injury risk, and skin integrity.</p>

	<Field label="Urinary Incontinence" inputId="urinaryIncontinence">
		<Select id="urinaryIncontinence" label="Urinary Incontinence" bind:value={c.urinaryIncontinence}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="stress">Stress incontinence</option>
			<option value="urge">Urge incontinence</option>
			<option value="mixed">Mixed incontinence</option>
			<option value="functional">Functional incontinence</option>
		</Select>
	</Field>

	{#if c.urinaryIncontinence !== 'none' && c.urinaryIncontinence !== ''}
		<Field label="Urinary Incontinence Frequency" required inputId="urinaryIncontinenceFrequency">
			<Select id="urinaryIncontinenceFrequency" label="Urinary Incontinence Frequency" required bind:value={c.urinaryIncontinenceFrequency}>
				<option value="">-- Select --</option>
				<option value="occasional">Occasional</option>
				<option value="frequent">Frequent</option>
				<option value="continuous">Continuous</option>
			</Select>
		</Field>
	{/if}

	<Field label="Any faecal incontinence?">
		<RadioGroup label="Faecal incontinence">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="faecalIncontinence" value={opt.value} bind:group={c.faecalIncontinence} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if c.faecalIncontinence === 'yes'}
		<Field label="Faecal Incontinence Frequency" required inputId="faecalIncontinenceFrequency">
			<Select id="faecalIncontinenceFrequency" label="Faecal Incontinence Frequency" required bind:value={c.faecalIncontinenceFrequency}>
				<option value="">-- Select --</option>
				<option value="occasional">Occasional</option>
				<option value="frequent">Frequent</option>
				<option value="continuous">Continuous</option>
			</Select>
		</Field>
	{/if}

	<Field label="Braden Scale Score (pressure injury risk)" inputId="bradenScale"><NumberInput id="bradenScale" label="Braden Scale" min={6} max={23} bind:value={c.bradenScale} /></Field>

	<Field label="Are there any pressure injuries present?">
		<RadioGroup label="Pressure injury">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="pressureInjuryPresent" value={opt.value} bind:group={c.pressureInjuryPresent} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if c.pressureInjuryPresent === 'yes'}
		<Field label="Pressure Injury Stage" required inputId="pressureInjuryStage">
			<Select id="pressureInjuryStage" label="Pressure Injury Stage" required bind:value={c.pressureInjuryStage}>
				<option value="">-- Select --</option>
				<option value="1">Stage 1 - Non-blanchable erythema</option>
				<option value="2">Stage 2 - Partial thickness skin loss</option>
				<option value="3">Stage 3 - Full thickness skin loss</option>
				<option value="4">Stage 4 - Full thickness tissue loss</option>
			</Select>
		</Field>
	{/if}

	<Field label="Overall Skin Integrity" inputId="skinIntegrity">
		<Select id="skinIntegrity" label="Skin Integrity" bind:value={c.skinIntegrity}>
			<option value="">-- Select --</option>
			<option value="intact">Intact</option>
			<option value="impaired">Impaired</option>
			<option value="wound-present">Wound present</option>
		</Select>
	</Field>
</Fieldset>
