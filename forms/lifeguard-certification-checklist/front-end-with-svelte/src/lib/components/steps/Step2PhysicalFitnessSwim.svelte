<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';

	const p = assessment.data.physicalFitnessSwim;
</script>

<Fieldset legend="Physical Fitness & Swim Competency">
	<p class="hint">NPLQ standard: 50 m timed swim in 60 seconds or less is a critical competency.</p>

	<Field label="50 m swim time (seconds)" description="Critical: target ≤ 60 s." inputId="swim50mTimeSeconds">
		<NumberInput id="swim50mTimeSeconds" label="50 m swim time in seconds" min={0} step="0.1" bind:value={p.swim50mTimeSeconds} />
	</Field>
	<TriStateField label="50 m timed swim completed within 60 seconds" name="swim50mWithinTime" critical bind:value={p.swim50mWithinTime} />

	<Field label="Surface dive depth (metres)" description="Suggested NPLQ minimum 1.5 m." inputId="surfaceDiveDepthMetres">
		<NumberInput id="surfaceDiveDepthMetres" label="Surface dive depth in metres" min={0} step="0.1" bind:value={p.surfaceDiveDepthMetres} />
	</Field>
	<TriStateField label="Sustained surface dive to depth and recovered an object" name="sustainedSurfaceDive" bind:value={p.sustainedSurfaceDive} />

	<Field label="200 m swim time (seconds)" description="Suggested target ≤ 360 s." inputId="swim200mTimeSeconds">
		<NumberInput id="swim200mTimeSeconds" label="200 m swim time in seconds" min={0} step="1" bind:value={p.swim200mTimeSeconds} />
	</Field>
	<TriStateField label="Sustained 200 m swim using mixed strokes" name="swim200mMixedStrokes" bind:value={p.swim200mMixedStrokes} />

	<TriStateField label="Treads water for 2 minutes with hands clear of the surface" name="treadWaterTwoMinutes" bind:value={p.treadWaterTwoMinutes} />
	<TriStateField label="Tows a casualty 50 m using an approved hold" name="towCasualty50m" bind:value={p.towCasualty50m} />
</Fieldset>
