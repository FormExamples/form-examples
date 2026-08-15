<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const l = assessment.data.lesionCharacteristics;

	const numberOptions = [
		{ value: 'single', label: 'Single' },
		{ value: 'few', label: 'Few (2-5)' },
		{ value: 'multiple', label: 'Multiple (6-20)' },
		{ value: 'numerous', label: 'Numerous (>20)' }
	];
</script>

<Fieldset legend="Lesion Characteristics">
	<p class="hint">Describe the appearance of the skin lesion(s).</p>

	<Field label="Lesion Type" required inputId="lesionType">
		<Select id="lesionType" label="Lesion Type" required bind:value={l.type}>
			<option value="">-- Select --</option>
			<option value="macule">Macule (flat, discoloured spot)</option>
			<option value="papule">Papule (small raised bump)</option>
			<option value="patch">Patch (large flat area)</option>
			<option value="plaque">Plaque (raised, flat-topped)</option>
			<option value="nodule">Nodule (firm, deep bump)</option>
			<option value="vesicle">Vesicle (small fluid-filled blister)</option>
			<option value="bulla">Bulla (large fluid-filled blister)</option>
			<option value="pustule">Pustule (pus-filled bump)</option>
			<option value="wheal">Wheal (hive, raised itchy area)</option>
			<option value="erosion">Erosion (superficial skin loss)</option>
			<option value="ulcer">Ulcer (deep skin loss)</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Lesion Colour" required inputId="lesionColor">
		<Select id="lesionColor" label="Lesion Colour" required bind:value={l.color}>
			<option value="">-- Select --</option>
			<option value="erythematous">Erythematous (red)</option>
			<option value="hyperpigmented">Hyperpigmented (darker than surrounding skin)</option>
			<option value="hypopigmented">Hypopigmented (lighter than surrounding skin)</option>
			<option value="violaceous">Violaceous (purple/violet)</option>
			<option value="flesh-colored">Flesh-coloured</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Border" required inputId="lesionBorder">
		<Select id="lesionBorder" label="Border" required bind:value={l.border}>
			<option value="">-- Select --</option>
			<option value="well-defined">Well-defined</option>
			<option value="poorly-defined">Poorly defined</option>
			<option value="irregular">Irregular</option>
			<option value="raised">Raised</option>
		</Select>
	</Field>

	<Field label="Size (mm)" inputId="lesionSize">
		<NumberInput id="lesionSize" label="Size" min={0} max={500} step={0.5} bind:value={l.sizeMillimeters} />
	</Field>

	<Field label="Distribution" inputId="lesionDistribution">
		<Select id="lesionDistribution" label="Distribution" bind:value={l.distribution}>
			<option value="">-- Select --</option>
			<option value="localized">Localised</option>
			<option value="generalized">Generalised</option>
			<option value="symmetrical">Symmetrical</option>
			<option value="asymmetrical">Asymmetrical</option>
			<option value="dermatomal">Dermatomal</option>
			<option value="sun-exposed">Sun-exposed areas</option>
		</Select>
	</Field>

	<Field label="Number of lesions">
		<RadioGroup label="Number of lesions">
			{#each numberOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="lesionNumber" value={opt.value} bind:group={l.number} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Surface" inputId="lesionSurface">
		<Select id="lesionSurface" label="Surface" bind:value={l.surface}>
			<option value="">-- Select --</option>
			<option value="smooth">Smooth</option>
			<option value="rough">Rough</option>
			<option value="scaly">Scaly</option>
			<option value="crusted">Crusted</option>
			<option value="verrucous">Verrucous (wart-like)</option>
			<option value="ulcerated">Ulcerated</option>
		</Select>
	</Field>
</Fieldset>
