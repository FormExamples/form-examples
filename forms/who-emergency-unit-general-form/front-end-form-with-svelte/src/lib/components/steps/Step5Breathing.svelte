<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const b = assessment.data.breathing;
</script>

<Fieldset
	title="Breathing (B)"
	description="Primary survey — chest rise, trachea, breath sounds, oxygenation and ventilation interventions."
>
	<Checkbox label="Normal (no abnormal findings)" name="breathingNormal" bind:checked={b.normal} />

	<NumberInput
		label="Spontaneous respiratory rate"
		name="spontaneousRespiratoryRate"
		bind:value={b.spontaneousRespiratoryRate}
		unit="/min"
		min={0}
		max={80}
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Chest rise</h3>
	<Checkbox label="Shallow" name="chestRiseShallow" bind:checked={b.chestRiseShallow} />
	<Checkbox label="Retractions" name="chestRiseRetractions" bind:checked={b.chestRiseRetractions} />
	<Checkbox label="Paradoxical" name="chestRiseParadoxical" bind:checked={b.chestRiseParadoxical} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Trachea</h3>
	<Checkbox label="Midline" name="tracheaMidline" bind:checked={b.tracheaMidline} />
	<Checkbox label="Deviated to L" name="tracheaDeviatedLeft" bind:checked={b.tracheaDeviatedLeft} />
	<Checkbox label="Deviated to R" name="tracheaDeviatedRight" bind:checked={b.tracheaDeviatedRight} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Breath sounds</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Left" name="breathSoundsLeft" bind:value={b.breathSoundsLeft} />
		<TextInput label="Right" name="breathSoundsRight" bind:value={b.breathSoundsRight} />
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Oxygen / ventilation</h3>
	<NumberInput label="Oxygen" name="oxygenLitres" bind:value={b.oxygenLitres} unit="L/min" min={0} max={30} step={0.5} />
	<Checkbox label="Nasal cannula (NC)" name="oxygenNasalCannula" bind:checked={b.oxygenNasalCannula} />
	<Checkbox label="Mask" name="oxygenMask" bind:checked={b.oxygenMask} />
	<Checkbox label="Non-rebreather (NRB)" name="oxygenNonRebreather" bind:checked={b.oxygenNonRebreather} />
	<Checkbox label="BVM" name="oxygenBvm" bind:checked={b.oxygenBvm} />
	<Checkbox label="CPAP / BIPAP" name="oxygenCpapBipap" bind:checked={b.oxygenCpapBipap} />
	<Checkbox label="Ventilator" name="oxygenVentilator" bind:checked={b.oxygenVentilator} />
	<Checkbox label="Bronchodilator" name="bronchodilator" bind:checked={b.bronchodilator} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Chest needle / tube</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="L — Size" name="chestNeedleLeftSize" bind:value={b.chestNeedleLeftSize} />
		<TextInput label="L — Depth (cm)" name="chestNeedleLeftDepth" bind:value={b.chestNeedleLeftDepth} />
		<TextInput label="R — Size" name="chestNeedleRightSize" bind:value={b.chestNeedleRightSize} />
		<TextInput label="R — Depth (cm)" name="chestNeedleRightDepth" bind:value={b.chestNeedleRightDepth} />
	</div>

	<TextAreaInput label="Notes" name="breathingNotes" bind:value={b.notes} rows={2} />
</Fieldset>
