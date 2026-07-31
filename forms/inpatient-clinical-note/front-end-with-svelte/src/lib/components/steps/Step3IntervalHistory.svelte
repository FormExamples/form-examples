<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import * as options from '$lib/config/options';
	import { TOTAL_STEPS } from '$lib/config/steps';

	const s = assessment.data.interval;
</script>

<Fieldset legend={`Step 3 of ${TOTAL_STEPS} — Interval history`}>
	<p class="hint">
		What has happened since the last entry. Required component — record events, or tick "no interval
		events" as a deliberate negative.
	</p>

	<Field label="Interval history" inputId="interval-intervalHistory">
		<TextAreaInput
			id="interval-intervalHistory"
			label="Interval history"
			rows={4}
			placeholder="e.g. Settled overnight. One episode of chest pain at 03:00, ECG unchanged."
			bind:value={s.intervalHistory}
		/>
	</Field>

	<Field
		label="No events since the last entry?"
		description="Yes documents the interval-history component as a deliberate negative."
		inputId="interval-noIntervalEvents"
	>
		<Select id="interval-noIntervalEvents" label="No events since the last entry?" bind:value={s.noIntervalEvents}>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Overnight events" inputId="interval-overnightEvents">
		<TextAreaInput
			id="interval-overnightEvents"
			label="Overnight events"
			rows={2}
			placeholder="As handed over by the night team or nursing staff."
			bind:value={s.overnightEvents}
		/>
	</Field>

	<Field label="Patient-reported symptoms" inputId="interval-patientReportedSymptoms">
		<TextAreaInput
			id="interval-patientReportedSymptoms"
			label="Patient-reported symptoms"
			rows={2}
			placeholder="In the patient's own words where possible."
			bind:value={s.patientReportedSymptoms}
		/>
	</Field>

	<Field label="Nursing concerns" inputId="interval-nursingConcerns">
		<TextAreaInput
			id="interval-nursingConcerns"
			label="Nursing concerns"
			rows={2}
			bind:value={s.nursingConcerns}
		/>
	</Field>

	<Field label="Pain score" description="0–10." inputId="interval-painScore">
		<NumberInput id="interval-painScore" label="Pain score" min={0} max={10} step={1} bind:value={s.painScore} />
	</Field>

	<Field label="Sleep" inputId="interval-sleepQuality">
		<Select id="interval-sleepQuality" label="Sleep" bind:value={s.sleepQuality}>
			<option value="">— Select —</option>
			{#each options.sleepQuality as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Oral intake" inputId="interval-oralIntake">
		<Select id="interval-oralIntake" label="Oral intake" bind:value={s.oralIntake}>
			<option value="">— Select —</option>
			{#each options.oralIntake as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Bowels last opened" inputId="interval-bowelsLastOpened">
		<DateInput id="interval-bowelsLastOpened" label="Bowels last opened" bind:value={s.bowelsLastOpened} />
	</Field>

	<Field label="Mobility" inputId="interval-mobilityStatus">
		<Select id="interval-mobilityStatus" label="Mobility" bind:value={s.mobilityStatus}>
			<option value="">— Select —</option>
			{#each options.mobilityStatus as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
