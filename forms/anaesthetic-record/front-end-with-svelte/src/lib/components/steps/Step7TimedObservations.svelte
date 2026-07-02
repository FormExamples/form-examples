<script lang="ts">
	import { assessment, createDefaultObservation } from '$lib/stores/assessment.svelte';
	import { calculateGrade } from '$lib/engine/anaesthetic-record-grader';
	import { statusLabel, statusColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	const d = assessment.data;
	const grade = $derived(calculateGrade(assessment.data));

	function addObservation() {
		d.observations.push(createDefaultObservation());
	}
	function removeObservation(i: number) {
		d.observations.splice(i, 1);
	}
</script>

<Fieldset legend="Step 7 of 12 — Timed observations">
	<p class="hint">
		Periodic vital-sign rows. At least one set is required for a complete record. SpO2 &lt; 92 % or
		systolic BP &lt; 90 mmHg raises a physiological-derangement flag.
	</p>

	{#if d.observations.length === 0}
		<p class="hint">No observations added yet. Add one row per timed vital-sign set.</p>
	{/if}

	{#each d.observations as obs, i (i)}
		<div class="repeating-row">
			<div class="repeating-row-header">
				<h4 class="repeating-row-title">Observation {i + 1}</h4>
				<Button data-variant="danger" label={`Remove observation ${i + 1}`} onclick={() => removeObservation(i)}>
					Remove
				</Button>
			</div>

			<Field label="Time observed" inputId={`observations-${i}-observedAt`}>
				<TextInput
					id={`observations-${i}-observedAt`}
					label="Time observed"
					type="datetime-local"
					class="date-input"
					bind:value={obs.observedAt}
				/>
			</Field>

			<Field label="Systolic BP (mmHg)" inputId={`observations-${i}-systolicBloodPressure`}>
				<NumberInput id={`observations-${i}-systolicBloodPressure`} label="Systolic BP (mmHg)" min={0} step="any" bind:value={obs.systolicBloodPressure} />
			</Field>

			<Field label="Diastolic BP (mmHg)" inputId={`observations-${i}-diastolicBloodPressure`}>
				<NumberInput id={`observations-${i}-diastolicBloodPressure`} label="Diastolic BP (mmHg)" min={0} step="any" bind:value={obs.diastolicBloodPressure} />
			</Field>

			<Field label="Heart rate (bpm)" inputId={`observations-${i}-heartRate`}>
				<NumberInput id={`observations-${i}-heartRate`} label="Heart rate (bpm)" min={0} step="any" bind:value={obs.heartRate} />
			</Field>

			<Field label="SpO2 (%)" inputId={`observations-${i}-spo2`}>
				<NumberInput id={`observations-${i}-spo2`} label="SpO2 (%)" min={0} max={100} step="any" bind:value={obs.spo2} />
			</Field>

			<Field label="EtCO2 (kPa)" inputId={`observations-${i}-endTidalCo2`}>
				<NumberInput id={`observations-${i}-endTidalCo2`} label="EtCO2 (kPa)" min={0} step="any" bind:value={obs.endTidalCo2} />
			</Field>

			<Field label="Temperature (°C)" inputId={`observations-${i}-temperature`}>
				<NumberInput id={`observations-${i}-temperature`} label="Temperature (°C)" min={0} step="any" bind:value={obs.temperature} />
			</Field>

			<Field label="Agent (%)" inputId={`observations-${i}-agentPercent`}>
				<NumberInput id={`observations-${i}-agentPercent`} label="Agent (%)" min={0} step="any" bind:value={obs.agentPercent} />
			</Field>

			<Field label="Fresh-gas flow (L/min)" inputId={`observations-${i}-freshGasFlowL`}>
				<NumberInput id={`observations-${i}-freshGasFlowL`} label="Fresh-gas flow (L/min)" min={0} step="any" bind:value={obs.freshGasFlowL} />
			</Field>
		</div>
	{/each}

	<Button data-variant="secondary" onclick={addObservation}>+ Add observation</Button>

	<Field label="Live completeness">
		<span class="inline-flex items-center gap-3">
			<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {statusColor(grade.status)}">
				{statusLabel(grade.status)}
			</span>
			<strong class="text-base-content">{grade.completenessPercent}% complete</strong>
			<span class="text-base-content/70">
				{d.drugs.length} drug(s), {d.observations.length} observation(s), {d.events.length} event(s)
			</span>
		</span>
	</Field>
</Fieldset>
