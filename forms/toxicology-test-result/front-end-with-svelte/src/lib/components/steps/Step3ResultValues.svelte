<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Result Values">
	<p class="hint">The measured assay levels, the drugs-of-abuse screen, and any named specific drug.</p>

	<Field label="Paracetamol level (mg/L)" inputId="paracetamolLevelMgL">
		<NumberInput
			id="paracetamolLevelMgL"
			label="Paracetamol level (mg/L)"
			min={0}
			max={10000}
			step={0.1}
			bind:value={d.paracetamolLevelMgL}
		/>
	</Field>

	<Field label="Salicylate level (mg/L)" inputId="salicylateLevelMgL">
		<NumberInput
			id="salicylateLevelMgL"
			label="Salicylate level (mg/L)"
			min={0}
			max={10000}
			step={0.1}
			bind:value={d.salicylateLevelMgL}
		/>
	</Field>

	<Field label="Ethanol level" inputId="ethanolLevel" description="Blood alcohol in laboratory units.">
		<NumberInput
			id="ethanolLevel"
			label="Ethanol level"
			min={0}
			max={100000}
			step={0.1}
			bind:value={d.ethanolLevel}
		/>
	</Field>

	<Field label="Lithium level (mmol/L)" inputId="lithiumLevelMmolL">
		<NumberInput
			id="lithiumLevelMmolL"
			label="Lithium level (mmol/L)"
			min={0}
			max={100}
			step={0.01}
			bind:value={d.lithiumLevelMmolL}
		/>
	</Field>

	<Field label="Digoxin level" inputId="digoxinLevel" description="Laboratory units (e.g. ng/mL).">
		<NumberInput
			id="digoxinLevel"
			label="Digoxin level"
			min={0}
			max={100}
			step={0.01}
			bind:value={d.digoxinLevel}
		/>
	</Field>

	<Field label="Carboxyhaemoglobin (%)" inputId="carboxyhaemoglobinPercent">
		<NumberInput
			id="carboxyhaemoglobinPercent"
			label="Carboxyhaemoglobin (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.carboxyhaemoglobinPercent}
		/>
	</Field>

	<Field label="Drugs-of-abuse screen" inputId="drugsOfAbuseScreen">
		<TextAreaInput
			id="drugsOfAbuseScreen"
			label="Drugs-of-abuse screen"
			rows={2}
			placeholder="Opiates, benzodiazepines, cocaine, amphetamines, etc."
			bind:value={d.drugsOfAbuseScreen}
		/>
	</Field>

	<Field label="Specific drug level" inputId="specificDrugLevel">
		<TextAreaInput
			id="specificDrugLevel"
			label="Specific drug level"
			rows={2}
			placeholder="Named specific drug result for an agent not captured above…"
			bind:value={d.specificDrugLevel}
		/>
	</Field>
</Fieldset>
