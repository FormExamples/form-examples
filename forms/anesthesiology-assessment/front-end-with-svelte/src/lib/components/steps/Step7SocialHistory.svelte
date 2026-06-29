<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import YesNoField from '$lib/components/ui/YesNoField.svelte';

	const d = assessment.data.socialHistory;
</script>

<Fieldset legend="Social History & Functional Capacity">
	<p class="hint">
		Smoking, alcohol, functional capacity, and the subjective STOP-BANG items (snoring, daytime
		sleepiness, observed apnea).
	</p>

	<div class="field-grid field-grid-3">
		<Field label="Smoking status" inputId="smoking">
			<Select id="smoking" label="Smoking status" bind:value={d.smoking}>
				<option value="">Select…</option>
				<option value="never">Never</option>
				<option value="ex">Ex-smoker</option>
				<option value="current">Current</option>
			</Select>
		</Field>
		<Field label="Pack-years" inputId="packYears">
			<NumberInput id="packYears" label="Pack-years" min={0} max={200} bind:value={d.packYears} />
		</Field>
		<Field label="Alcohol (units / week)" inputId="alcoholUnitsPerWeek">
			<NumberInput id="alcoholUnitsPerWeek" label="Alcohol units per week" min={0} max={200} bind:value={d.alcoholUnitsPerWeek} />
		</Field>
	</div>

	<YesNoField label="Recreational drug use?" name="recreationalDrugUse" bind:value={d.recreationalDrugUse} />
	{#if d.recreationalDrugUse === 'yes'}
		<Field label="Recreational drug details" inputId="recreationalDrugDetails">
			<TextAreaInput id="recreationalDrugDetails" label="Recreational drug details" rows={2} bind:value={d.recreationalDrugDetails} />
		</Field>
	{/if}

	<div class="field-grid">
		<Field label="Exercise tolerance" inputId="exerciseTolerance">
			<Select id="exerciseTolerance" label="Exercise tolerance" bind:value={d.exerciseTolerance}>
				<option value="">Select…</option>
				<option value="gt-4-mets">Good (&gt; 4 METs)</option>
				<option value="le-4-mets">Poor (≤ 4 METs)</option>
				<option value="unknown">Unknown</option>
			</Select>
		</Field>
		<Field label="Pregnancy status" inputId="pregnancyStatus">
			<Select id="pregnancyStatus" label="Pregnancy status" bind:value={d.pregnancyStatus}>
				<option value="">Select…</option>
				<option value="not-applicable">Not applicable</option>
				<option value="not-pregnant">Not pregnant</option>
				<option value="pregnant">Pregnant</option>
			</Select>
		</Field>
	</div>

	<YesNoField label="Can climb two flights of stairs?" name="canClimbTwoFlights" bind:value={d.canClimbTwoFlights} />

	<Field label="Occupation" inputId="occupation">
		<TextInput id="occupation" label="Occupation" bind:value={d.occupation} />
	</Field>

	<h3 class="group-title">STOP-BANG subjective items</h3>
	<div class="yn-grid">
		<YesNoField label="Snores loudly?" name="snoresLoudly" bind:value={d.snoresLoudly} />
		<YesNoField label="Tired or sleepy during the day?" name="tiredDuringDay" bind:value={d.tiredDuringDay} />
		<YesNoField label="Observed apnea during sleep?" name="observedApnea" bind:value={d.observedApnea} />
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.group-title {
		margin: 1.25rem 0 0.25rem;
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--color-base-content);
		opacity: 0.7;
	}
	.yn-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem 1.5rem;
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3,
		.yn-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
