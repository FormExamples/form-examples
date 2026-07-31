<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import * as options from '$lib/config/options';
	import { TOTAL_STEPS } from '$lib/config/steps';
	import { deriveNews2 } from '$lib/engine/news2';

	const s = assessment.data.observations;

	// Live NEWS2 readout. The derived total is advisory: an entered total always
	// wins, and when the two disagree we say so rather than silently resolving it.
	const derivation = $derived(deriveNews2(s));
	const entered = $derived(typeof s.news2Total === 'number' ? s.news2Total : null);
	const disagree = $derived(
		entered !== null && derivation.complete && entered !== derivation.total
	);
</script>

<Fieldset legend={`Step 4 of ${TOTAL_STEPS} — Observations and NEWS2`}>
	<p class="hint">
		The observation set this note refers to. Required component — record a NEWS2 total, or all seven
		parameters so the engine can derive one.
	</p>

	<Field label="Observation time" inputId="observations-observedAt">
		<TextInput
			id="observations-observedAt"
			label="Observation time"
			type="datetime-local"
			class="date-input"
			bind:value={s.observedAt}
		/>
	</Field>

	<Field label="Respiratory rate (per minute)" inputId="observations-respiratoryRate">
		<NumberInput
			id="observations-respiratoryRate"
			label="Respiratory rate (per minute)"
			min={0}
			max={80}
			step={1}
			bind:value={s.respiratoryRate}
		/>
	</Field>

	<Field label="Oxygen saturation (%)" inputId="observations-oxygenSaturation">
		<NumberInput
			id="observations-oxygenSaturation"
			label="Oxygen saturation (%)"
			min={0}
			max={100}
			step={1}
			bind:value={s.oxygenSaturation}
		/>
	</Field>

	<Field
		label="SpO2 scale"
		description="Scale 2 only for a prescribed target of 88–92% in confirmed hypercapnic respiratory failure."
		inputId="observations-spo2Scale"
	>
		<Select id="observations-spo2Scale" label="SpO2 scale" bind:value={s.spo2Scale}>
			{#each options.spo2Scale as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Air or oxygen" inputId="observations-oxygenDelivery">
		<Select id="observations-oxygenDelivery" label="Air or oxygen" bind:value={s.oxygenDelivery}>
			<option value="">— Select —</option>
			{#each options.oxygenDelivery as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Oxygen flow (L/min)" inputId="observations-oxygenFlowLitresPerMinute">
		<NumberInput
			id="observations-oxygenFlowLitresPerMinute"
			label="Oxygen flow (L/min)"
			min={0}
			max={100}
			step={0.5}
			bind:value={s.oxygenFlowLitresPerMinute}
		/>
	</Field>

	<Field label="Systolic blood pressure (mmHg)" inputId="observations-systolicBloodPressure">
		<NumberInput
			id="observations-systolicBloodPressure"
			label="Systolic blood pressure (mmHg)"
			min={0}
			max={300}
			step={1}
			bind:value={s.systolicBloodPressure}
		/>
	</Field>

	<Field
		label="Diastolic blood pressure (mmHg)"
		description="Recorded for completeness; not a NEWS2 parameter."
		inputId="observations-diastolicBloodPressure"
	>
		<NumberInput
			id="observations-diastolicBloodPressure"
			label="Diastolic blood pressure (mmHg)"
			min={0}
			max={200}
			step={1}
			bind:value={s.diastolicBloodPressure}
		/>
	</Field>

	<Field label="Pulse (per minute)" inputId="observations-pulseRate">
		<NumberInput
			id="observations-pulseRate"
			label="Pulse (per minute)"
			min={0}
			max={300}
			step={1}
			bind:value={s.pulseRate}
		/>
	</Field>

	<Field label="Consciousness (ACVPU)" inputId="observations-acvpu">
		<Select id="observations-acvpu" label="Consciousness (ACVPU)" bind:value={s.acvpu}>
			<option value="">— Select —</option>
			{#each options.acvpu as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Temperature (°C)" inputId="observations-temperatureCelsius">
		<NumberInput
			id="observations-temperatureCelsius"
			label="Temperature (°C)"
			min={20}
			max={45}
			step={0.1}
			bind:value={s.temperatureCelsius}
		/>
	</Field>

	<Field
		label="NEWS2 total from the chart"
		description="Optional. When present this wins over the derived total; both are recorded."
		inputId="observations-news2Total"
	>
		<NumberInput
			id="observations-news2Total"
			label="NEWS2 total from the chart"
			min={0}
			max={20}
			step={1}
			bind:value={s.news2Total}
		/>
	</Field>

	<div class="readout" aria-live="polite">
		<span class="label">NEWS2 aggregate</span>
		{#if !derivation.complete && entered === null}
			<p class="hint">Enter a NEWS2 total, or all seven parameters, to see the aggregate.</p>
		{:else}
			{#if derivation.complete}
				<p>Derived from the seven parameters: <strong>{derivation.total}</strong></p>
			{:else}
				<p class="hint">Not all seven parameters recorded — no derived total.</p>
			{/if}
			{#if entered !== null}
				<p>Entered from the chart: <strong>{entered}</strong></p>
			{/if}
			{#if disagree}
				<p class="warn">
					The entered total ({entered}) and the derived total ({derivation.total}) disagree. The
					entered value is used; both are recorded so the discrepancy is visible.
				</p>
			{/if}
			{#if derivation.anyParameterScoresThree}
				<p class="warn">
					A single parameter scores 3 — acuity is at least Watch regardless of the aggregate.
				</p>
			{/if}
		{/if}
	</div>

	<Field
		label="NEWS2 trend"
		description="A worsening trend raises the acuity band to at least Watch."
		inputId="observations-news2Trend"
	>
		<Select id="observations-news2Trend" label="NEWS2 trend" bind:value={s.news2Trend}>
			<option value="">— Select —</option>
			{#each options.news2Trend as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Does NEWS2 apply to this patient?"
		description="NEWS2 is not validated in pregnancy, under 16, or in spinal-cord injury."
		inputId="observations-news2Applicable"
	>
		<Select id="observations-news2Applicable" label="Does NEWS2 apply to this patient?" bind:value={s.news2Applicable}>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Reason NEWS2 was not used" inputId="observations-news2NotApplicableReason">
		<TextInput
			id="observations-news2NotApplicableReason"
			label="Reason NEWS2 was not used"
			placeholder="Only if NEWS2 does not apply."
			bind:value={s.news2NotApplicableReason}
		/>
	</Field>
</Fieldset>
