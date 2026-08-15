<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="9. Fluid Intake and Hydration">
	<p class="hint">Fluid consumption, drink types, alcohol, and any thickened fluids or fluid restriction.</p>

	<Field label="Fluid intake (ml/day)" inputId="hydration-fluidIntakeMlPerDay">
		<NumberInput id="hydration-fluidIntakeMlPerDay" label="Fluid intake (ml/day)" min={0} max={10000} bind:value={d.hydration.fluidIntakeMlPerDay} />
	</Field>
	<Field label="Drink types" inputId="hydration-fluidTypes">
		<TextInput id="hydration-fluidTypes" label="Drink types"
			placeholder="Water, tea, juice, milk-based drinks" bind:value={d.hydration.fluidTypes} />
	</Field>
	<Field label="Caffeinated drinks per day" inputId="hydration-caffeinatedDrinksPerDay">
		<NumberInput id="hydration-caffeinatedDrinksPerDay" label="Caffeinated drinks per day" min={0} max={30} bind:value={d.hydration.caffeinatedDrinksPerDay} />
	</Field>
	<Field label="Alcohol (units/week)" inputId="hydration-alcoholUnitsPerWeek" description="Above 14 units per week raises a flag and is a NICE CG32 refeeding minor criterion.">
		<NumberInput id="hydration-alcoholUnitsPerWeek" label="Alcohol (units/week)" min={0} max={300} step="0.1" bind:value={d.hydration.alcoholUnitsPerWeek} />
	</Field>
	<Field label="Thickened fluids" inputId="hydration-thickenedFluids">
		<Select id="hydration-thickenedFluids" label="Thickened fluids" bind:value={d.hydration.thickenedFluids}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="IDDSI drink level" inputId="hydration-thickenedFluidsIddsiLevel">
		<Select id="hydration-thickenedFluidsIddsiLevel" label="IDDSI drink level" bind:value={d.hydration.thickenedFluidsIddsiLevel}>
			<option value="">— Select —</option>
			{#each OPTIONS.iddsiDrink as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Hydration signs" inputId="hydration-hydrationSigns">
		<Select id="hydration-hydrationSigns" label="Hydration signs" bind:value={d.hydration.hydrationSigns}>
			<option value="">— Select —</option>
			{#each OPTIONS.hydrationSigns as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Fluid restriction in place" inputId="hydration-fluidRestriction">
		<Select id="hydration-fluidRestriction" label="Fluid restriction in place" bind:value={d.hydration.fluidRestriction}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Restriction target (ml/day)" inputId="hydration-fluidRestrictionMlPerDay">
		<NumberInput id="hydration-fluidRestrictionMlPerDay" label="Restriction target (ml/day)" min={0} max={5000} bind:value={d.hydration.fluidRestrictionMlPerDay} />
	</Field>
	<Field label="Hydration notes" inputId="hydration-hydrationNotes">
		<TextAreaInput id="hydration-hydrationNotes" label="Hydration notes" rows={2} bind:value={d.hydration.hydrationNotes} />
	</Field>
</Fieldset>
