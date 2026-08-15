<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const n = assessment.data.nutrition;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Nutrition">
	<p class="hint">Weight changes, appetite, swallowing, and nutritional status.</p>

	<Field label="Any weight changes in the last 6 months?">
		<RadioGroup label="Weight change in 6 months">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="weightChange" value={opt.value} bind:group={n.weightChangeLastSixMonths} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if n.weightChangeLastSixMonths === 'yes'}
		<Field label="How much weight change? (kg)" inputId="weightChangeKg"><NumberInput id="weightChangeKg" label="Weight change kg" min={0} max={100} step={0.1} bind:value={n.weightChangeKg} /></Field>
		<Field label="Weight change direction" required inputId="weightChangeDirection">
			<Select id="weightChangeDirection" label="Weight change direction" required bind:value={n.weightChangeDirection}>
				<option value="">-- Select --</option>
				<option value="gain">Weight gain</option>
				<option value="loss">Weight loss</option>
			</Select>
		</Field>
	{/if}

	<Field label="Appetite" required inputId="appetite">
		<Select id="appetite" label="Appetite" required bind:value={n.appetite}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="reduced">Reduced</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<Field label="Any swallowing difficulties (dysphagia)?">
		<RadioGroup label="Swallowing difficulties">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="swallowingDifficulties" value={opt.value} bind:group={n.swallowingDifficulties} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="Dental Status" inputId="dentalStatus">
		<Select id="dentalStatus" label="Dental Status" bind:value={n.dentalStatus}>
			<option value="">-- Select --</option>
			<option value="good">Good</option>
			<option value="fair">Fair</option>
			<option value="poor">Poor</option>
			<option value="edentulous">Edentulous (no teeth)</option>
		</Select>
	</Field>

	<Field label="Mini Nutritional Assessment (MNA) Score" inputId="mnaScore"><NumberInput id="mnaScore" label="MNA Score" min={0} max={30} step={0.5} bind:value={n.mnaScore} /></Field>
</Fieldset>
