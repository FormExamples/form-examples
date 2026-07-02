<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.physical;
</script>

<Fieldset legend="Step 4 of 10 — Physical health">
	<p class="hint">
		Record each physical-health component with a finding, then collate any actions for the Health
		Action Plan.
	</p>

	<Field label="Weight and BMI" inputId="physical-weightBmiStatus">
		<Select id="physical-weightBmiStatus" label="Weight and BMI" bind:value={p.weightBmiStatus}>
			<option value="">— Select —</option>
			<option value="recorded">Recorded</option>
			<option value="declined">Declined</option>
			<option value="not-recorded">Not recorded</option>
		</Select>
	</Field>

	<Field
		label="BMI (kg/m²)"
		description="Optional; record if weight and height were measured."
		inputId="physical-bmi"
	>
		<NumberInput
			id="physical-bmi"
			label="BMI (kg/m²)"
			min={8}
			max={80}
			step={0.1}
			bind:value={p.bmi}
		/>
	</Field>

	<Field label="Blood pressure" inputId="physical-bloodPressureStatus">
		<Select
			id="physical-bloodPressureStatus"
			label="Blood pressure"
			bind:value={p.bloodPressureStatus}
		>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="raised">Raised</option>
			<option value="recorded">Recorded (see note)</option>
			<option value="not-recorded">Not recorded</option>
		</Select>
	</Field>

	<Field label="Epilepsy review" inputId="physical-epilepsyStatus">
		<Select id="physical-epilepsyStatus" label="Epilepsy review" bind:value={p.epilepsyStatus}>
			<option value="">— Select —</option>
			<option value="reviewed">Reviewed</option>
			<option value="not-applicable">Not applicable (no epilepsy)</option>
			<option value="not-reviewed">Not reviewed</option>
		</Select>
	</Field>

	<Field label="Constipation" inputId="physical-constipationStatus">
		<Select id="physical-constipationStatus" label="Constipation" bind:value={p.constipationStatus}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="present">Present</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field
		label="Dysphagia (swallowing)"
		description="A recorded swallowing difficulty raises a high-priority choking-risk flag."
		inputId="physical-dysphagiaStatus"
	>
		<Select
			id="physical-dysphagiaStatus"
			label="Dysphagia (swallowing)"
			bind:value={p.dysphagiaStatus}
		>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="present">Present</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field label="Continence" inputId="physical-continenceStatus">
		<Select id="physical-continenceStatus" label="Continence" bind:value={p.continenceStatus}>
			<option value="">— Select —</option>
			<option value="ok">OK / no concern</option>
			<option value="issue">Issue found</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field label="Mobility and falls" inputId="physical-mobilityFallsStatus">
		<Select
			id="physical-mobilityFallsStatus"
			label="Mobility and falls"
			bind:value={p.mobilityFallsStatus}
		>
			<option value="">— Select —</option>
			<option value="ok">OK / no concern</option>
			<option value="issue">Issue found</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field label="Dental / oral health" inputId="physical-dentalStatus">
		<Select id="physical-dentalStatus" label="Dental / oral health" bind:value={p.dentalStatus}>
			<option value="">— Select —</option>
			<option value="ok">OK / no concern</option>
			<option value="issue">Issue found</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field label="Vision" inputId="physical-visionStatus">
		<Select id="physical-visionStatus" label="Vision" bind:value={p.visionStatus}>
			<option value="">— Select —</option>
			<option value="ok">OK / no concern</option>
			<option value="issue">Issue found</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field label="Hearing" inputId="physical-hearingStatus">
		<Select id="physical-hearingStatus" label="Hearing" bind:value={p.hearingStatus}>
			<option value="">— Select —</option>
			<option value="ok">OK / no concern</option>
			<option value="issue">Issue found</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field label="Foot health" inputId="physical-footHealthStatus">
		<Select id="physical-footHealthStatus" label="Foot health" bind:value={p.footHealthStatus}>
			<option value="">— Select —</option>
			<option value="ok">OK / no concern</option>
			<option value="issue">Issue found</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field label="Skin" inputId="physical-skinStatus">
		<Select id="physical-skinStatus" label="Skin" bind:value={p.skinStatus}>
			<option value="">— Select —</option>
			<option value="ok">OK / no concern</option>
			<option value="issue">Issue found</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field
		label="Physical-health actions"
		description="Record an action for every physical-health problem found; these feed the Health Action Plan."
		inputId="physical-physicalHealthActions"
	>
		<TextAreaInput
			id="physical-physicalHealthActions"
			label="Physical-health actions"
			rows={3}
			placeholder="e.g. Refer to podiatry for foot ulcer; recheck BP in 2 weeks."
			bind:value={p.physicalHealthActions}
		/>
	</Field>
</Fieldset>
