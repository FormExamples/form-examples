<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const b = assessment.data.breathing;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Breathing (B)"
	description="Primary survey: breathing assessment and interventions."
>
	<Checkbox label="Normal (NML)" name="breathingNormal" bind:checked={b.normal} />

	<RadioGroup
		label="Spontaneous respiration"
		name="spontaneousRespiration"
		options={yesNo}
		bind:value={b.spontaneousRespiration}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Chest rise</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Shallow" name="chestRiseShallow" bind:checked={b.chestRiseShallow} />
		<Checkbox
			label="Retractions"
			name="chestRiseRetractions"
			bind:checked={b.chestRiseRetractions}
		/>
		<Checkbox
			label="Paradoxical"
			name="chestRiseParadoxical"
			bind:checked={b.chestRiseParadoxical}
		/>
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Trachea</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Midline" name="tracheaMidline" bind:checked={b.tracheaMidline} />
		<Checkbox
			label="Deviated to L"
			name="tracheaDeviatedLeft"
			bind:checked={b.tracheaDeviatedLeft}
		/>
		<Checkbox
			label="Deviated to R"
			name="tracheaDeviatedRight"
			bind:checked={b.tracheaDeviatedRight}
		/>
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Breath sounds</h3>
	<Checkbox label="Normal (NML)" name="breathSoundsNormal" bind:checked={b.breathSoundsNormal} />
	<TextAreaInput
		label="Breath sounds notes"
		name="breathSoundsNotes"
		bind:value={b.breathSoundsNotes}
		rows={2}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Interventions</h3>
	<NumberInput
		label="Oxygen"
		name="oxygenLitres"
		bind:value={b.oxygenLitres}
		unit="L/min"
		step={0.5}
		min={0}
		max={30}
	/>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox
			label="Nasal cannula (NC)"
			name="oxygenNasalCannula"
			bind:checked={b.oxygenNasalCannula}
		/>
		<Checkbox
			label="Face mask"
			name="oxygenFaceMask"
			bind:checked={b.oxygenFaceMask}
		/>
		<Checkbox
			label="Non-rebreather mask"
			name="oxygenNonRebreather"
			bind:checked={b.oxygenNonRebreather}
		/>
		<Checkbox label="BVM" name="oxygenBvm" bind:checked={b.oxygenBvm} />
		<Checkbox
			label="BiPAP / CPAP"
			name="oxygenBipapCpap"
			bind:checked={b.oxygenBipapCpap}
		/>
	</div>
	<TextInput
		label="Other intervention"
		name="oxygenOther"
		bind:value={b.oxygenOther}
	/>

	<TextAreaInput label="Notes" name="breathingNotes" bind:value={b.notes} rows={2} />
</Fieldset>
