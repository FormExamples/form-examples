<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import SupplementEntry from '$lib/components/ui/SupplementEntry.svelte';

	const c = assessment.data.currentNutritionalSupport;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Nutritional Support">
	<p class="hint">
		Current oral, enteral, and parenteral support; vitamin/mineral supplementation; dietician
		involvement.
	</p>

	<Field label="Are you taking oral nutritional supplements (e.g. Ensure, Fortisip)?">
		<RadioGroup label="Oral supplements">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="oralSupplements" value={opt.value} bind:group={c.oralSupplements} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.oralSupplements === 'yes'}
		<Field label="Oral nutritional supplements">
			<SupplementEntry bind:supplements={c.oralSupplementList} addLabel="Add oral supplement" />
		</Field>
	{/if}

	<Field label="Are you receiving enteral (tube) feeding?">
		<RadioGroup label="Enteral feeding">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="enteralFeeding" value={opt.value} bind:group={c.enteralFeeding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.enteralFeeding === 'yes'}
		<Field label="Enteral feeding route" inputId="enteralRoute">
			<Select id="enteralRoute" label="Enteral feeding route" bind:value={c.enteralRoute}>
				<option value="">— Select —</option>
				<option value="NG">Nasogastric (NG)</option>
				<option value="NJ">Nasojejunal (NJ)</option>
				<option value="PEG">Percutaneous endoscopic gastrostomy (PEG)</option>
				<option value="PEJ">Percutaneous endoscopic jejunostomy (PEJ)</option>
				<option value="RIG">Radiologically inserted gastrostomy (RIG)</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Enteral formula" inputId="enteralFormula">
			<TextInput id="enteralFormula" label="Enteral formula" placeholder="e.g. Nutrison Energy Multi Fibre 1500 ml/24h" bind:value={c.enteralFormula} />
		</Field>
	{/if}

	<Field label="Are you receiving parenteral nutrition (intravenous nutrition)?">
		<RadioGroup label="Parenteral nutrition">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="parenteralNutrition" value={opt.value} bind:group={c.parenteralNutrition} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.parenteralNutrition === 'yes'}
		<Field label="Parenteral nutrition details" inputId="parenteralDetails">
			<TextAreaInput id="parenteralDetails" label="Parenteral nutrition details" rows={2} placeholder="Regimen, line type, duration…" bind:value={c.parenteralDetails} />
		</Field>
	{/if}

	<Field label="Are you taking vitamin or mineral supplements?">
		<RadioGroup label="Vitamin / mineral supplements">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vitaminMineralSupplements" value={opt.value} bind:group={c.vitaminMineralSupplements} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.vitaminMineralSupplements === 'yes'}
		<Field label="Vitamin / mineral supplements">
			<SupplementEntry bind:supplements={c.vitaminMineralList} addLabel="Add vitamin / mineral" />
		</Field>
	{/if}

	<Field label="Are you currently under the care of a dietician?">
		<RadioGroup label="Dietician involvement">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dieticianInvolvement" value={opt.value} bind:group={c.dieticianInvolvement} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Date of last dietician review" inputId="lastDieticianReviewDate">
		<DateInput id="lastDieticianReviewDate" label="Last dietician review date" bind:value={c.lastDieticianReviewDate} />
	</Field>
</Fieldset>
