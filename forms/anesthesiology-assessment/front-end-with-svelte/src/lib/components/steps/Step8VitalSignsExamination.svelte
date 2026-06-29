<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateBMI, bmiCategory } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import YesNoField from '$lib/components/ui/YesNoField.svelte';

	const v = assessment.data.vitalSigns;
	const ex = assessment.data.physicalExam;

	// BMI (feeds STOP-BANG and the obesity flags) is auto-calculated.
	$effect(() => {
		assessment.data.vitalSigns.bmi = calculateBMI(v.weight, v.height);
	});
</script>

<Fieldset legend="Vital Signs & Physical Examination">
	<p class="hint">
		Baseline observations, anthropometry, and the airway / cardiorespiratory examination. Neck
		circumference and BMI feed the STOP-BANG score; airway findings feed the Mallampati assessment.
	</p>

	<h3 class="group-title">Vital signs</h3>
	<div class="field-grid field-grid-3">
		<Field label="Systolic BP (mmHg)" inputId="systolicBp">
			<NumberInput id="systolicBp" label="Systolic BP" min={40} max={300} bind:value={v.systolicBp} />
		</Field>
		<Field label="Diastolic BP (mmHg)" inputId="diastolicBp">
			<NumberInput id="diastolicBp" label="Diastolic BP" min={20} max={200} bind:value={v.diastolicBp} />
		</Field>
		<Field label="Heart rate (bpm)" inputId="heartRate">
			<NumberInput id="heartRate" label="Heart rate" min={20} max={250} bind:value={v.heartRate} />
		</Field>
		<Field label="Respiratory rate (/min)" inputId="respiratoryRate">
			<NumberInput id="respiratoryRate" label="Respiratory rate" min={4} max={60} bind:value={v.respiratoryRate} />
		</Field>
		<Field label="SpO2 (%)" inputId="spo2">
			<NumberInput id="spo2" label="SpO2" min={50} max={100} bind:value={v.spo2} />
		</Field>
		<Field label="Temperature (°C)" inputId="temperature">
			<NumberInput id="temperature" label="Temperature" min={30} max={45} step={0.1} bind:value={v.temperature} />
		</Field>
	</div>

	<h3 class="group-title">Anthropometry</h3>
	<div class="field-grid field-grid-3">
		<Field label="Height (cm)" inputId="height">
			<NumberInput id="height" label="Height" min={50} max={250} bind:value={v.height} />
		</Field>
		<Field label="Weight (kg)" inputId="weight">
			<NumberInput id="weight" label="Weight" min={1} max={400} bind:value={v.weight} />
		</Field>
		<Field label="BMI" description="Auto-calculated">
			{#if v.bmi}
				<p class="readout">{v.bmi} <span class="readout-sub">({bmiCategory(v.bmi)})</span></p>
			{:else}
				<p class="readout readout-empty">—</p>
			{/if}
		</Field>
		<Field label="Neck circumference (cm)" inputId="neckCircumference">
			<NumberInput id="neckCircumference" label="Neck circumference" min={20} max={70} step={0.5} bind:value={v.neckCircumference} />
		</Field>
	</div>

	<h3 class="group-title">Airway examination</h3>
	<div class="field-grid field-grid-3">
		<Field label="Mallampati class" inputId="mallampatiClass">
			<Select id="mallampatiClass" label="Mallampati class" bind:value={ex.mallampatiClass}>
				<option value="">Select…</option>
				<option value="i">Class I</option>
				<option value="ii">Class II</option>
				<option value="iii">Class III</option>
				<option value="iv">Class IV</option>
			</Select>
		</Field>
		<Field label="Mouth opening (cm)" inputId="mouthOpening">
			<NumberInput id="mouthOpening" label="Mouth opening" min={0} max={10} step={0.1} bind:value={ex.mouthOpening} />
		</Field>
		<Field label="Thyromental distance (cm)" inputId="thyromentalDistance">
			<NumberInput id="thyromentalDistance" label="Thyromental distance" min={0} max={15} step={0.1} bind:value={ex.thyromentalDistance} />
		</Field>
		<Field label="Neck mobility" inputId="neckMobility">
			<Select id="neckMobility" label="Neck mobility" bind:value={ex.neckMobility}>
				<option value="">Select…</option>
				<option value="full">Full</option>
				<option value="limited">Limited</option>
				<option value="fixed">Fixed</option>
			</Select>
		</Field>
		<Field label="Jaw protrusion" inputId="jawProtrusion">
			<Select id="jawProtrusion" label="Jaw protrusion" bind:value={ex.jawProtrusion}>
				<option value="">Select…</option>
				<option value="normal">Normal</option>
				<option value="limited">Limited</option>
			</Select>
		</Field>
	</div>

	<Field label="Dentition">
		<div class="check-grid">
			<label class="check-row"><CheckboxInput label="Intact" bind:checked={ex.dentitionIntact} /> Intact</label>
			<label class="check-row"><CheckboxInput label="Dentures" bind:checked={ex.dentitionDentures} /> Dentures</label>
			<label class="check-row"><CheckboxInput label="Loose teeth" bind:checked={ex.dentitionLooseTeeth} /> Loose teeth</label>
			<label class="check-row"><CheckboxInput label="Crowns" bind:checked={ex.dentitionCrowns} /> Crowns / bridges</label>
			<label class="check-row"><CheckboxInput label="Prominent incisors" bind:checked={ex.dentitionProminentIncisors} /> Prominent incisors</label>
		</div>
	</Field>

	<h3 class="group-title">Cardiorespiratory examination</h3>
	<div class="field-grid field-grid-3">
		<Field label="Heart sounds" inputId="heartSounds">
			<Select id="heartSounds" label="Heart sounds" bind:value={ex.heartSounds}>
				<option value="">Select…</option>
				<option value="normal">Normal</option>
				<option value="murmur">Murmur</option>
				<option value="irregular">Irregular</option>
				<option value="added-sounds">Added sounds</option>
			</Select>
		</Field>
		<Field label="Peripheral oedema" inputId="peripheralEdema">
			<Select id="peripheralEdema" label="Peripheral oedema" bind:value={ex.peripheralEdema}>
				<option value="">Select…</option>
				<option value="none">None</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
		<Field label="JVP" inputId="jvp">
			<Select id="jvp" label="JVP" bind:value={ex.jvp}>
				<option value="">Select…</option>
				<option value="normal">Normal</option>
				<option value="raised">Raised</option>
			</Select>
		</Field>
		<Field label="Breath sounds" inputId="breathSounds">
			<Select id="breathSounds" label="Breath sounds" bind:value={ex.breathSounds}>
				<option value="">Select…</option>
				<option value="normal">Normal</option>
				<option value="wheeze">Wheeze</option>
				<option value="crackles">Crackles</option>
				<option value="reduced">Reduced</option>
			</Select>
		</Field>
	</div>

	<YesNoField label="Accessory muscle use at rest?" name="accessoryMuscleUse" bind:value={ex.accessoryMuscleUse} />
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
	.readout {
		margin: 0;
		font-weight: 500;
	}
	.readout-sub {
		opacity: 0.7;
		font-weight: 400;
	}
	.readout-empty {
		opacity: 0.6;
	}
	.check-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem 1.5rem;
	}
	.check-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3,
		.check-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
