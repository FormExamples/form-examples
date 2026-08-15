<script lang="ts">
	import { assessment, createDefaultObservation } from '#lib/stores/assessment.svelte.js';
	import { calculateGrade } from '#lib/engine/partogram-grader.js';
	import { progressLabel, progressColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	const d = assessment.data;
	const grade = $derived(calculateGrade(assessment.data));

	function addObservation() {
		d.observations.push(createDefaultObservation());
	}
	function removeObservation(i: number) {
		d.observations.splice(i, 1);
	}
</script>

<Fieldset legend="Step 4 of 5 — Observation series">
	<p class="hint">
		One row per timed set of observations. The latest row carrying a cervical dilatation is plotted
		against the alert line (4 + t cm) and the action line (t cm). Fetal heart rate outside 110-160
		bpm, meconium-stained liquor, temperature &ge; 37.5 &deg;C, or blood pressure &ge; 140/90 raise
		high-priority flags.
	</p>

	{#if d.observations.length === 0}
		<p class="hint">No observations added yet. Add one row per timed set of observations.</p>
	{/if}

	{#each d.observations as obs, i (i)}
		<div class="repeating-row">
			<div class="repeating-row-header">
				<h4 class="repeating-row-title">Observation {i + 1}</h4>
				<Button
					data-variant="danger"
					label={`Remove observation ${i + 1}`}
					onclick={() => removeObservation(i)}
				>
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

			<Field label="Cervical dilatation (cm)" inputId={`observations-${i}-cervicalDilatationCm`}>
				<NumberInput
					id={`observations-${i}-cervicalDilatationCm`}
					label="Cervical dilatation (cm)"
					min={0}
					max={10}
					step={0.5}
					bind:value={obs.cervicalDilatationCm}
				/>
			</Field>

			<Field
				label="Descent (fifths palpable)"
				description="Fifths of head palpable above the brim, 5 → 0."
				inputId={`observations-${i}-descentFifths`}
			>
				<NumberInput
					id={`observations-${i}-descentFifths`}
					label="Descent (fifths palpable)"
					min={0}
					max={5}
					step={1}
					bind:value={obs.descentFifths}
				/>
			</Field>

			<Field label="Contractions per 10 min" inputId={`observations-${i}-contractionsPer10Min`}>
				<NumberInput
					id={`observations-${i}-contractionsPer10Min`}
					label="Contractions per 10 min"
					min={0}
					max={10}
					step={1}
					bind:value={obs.contractionsPer10Min}
				/>
			</Field>

			<Field label="Contraction duration" inputId={`observations-${i}-contractionDurationBand`}>
				<Select
					id={`observations-${i}-contractionDurationBand`}
					label="Contraction duration"
					bind:value={obs.contractionDurationBand}
				>
					<option value="">— Select —</option>
					<option value="<20s">&lt; 20 s</option>
					<option value="20-40s">20-40 s</option>
					<option value=">40s">&gt; 40 s</option>
				</Select>
			</Field>

			<Field label="Contraction strength" inputId={`observations-${i}-contractionStrength`}>
				<Select
					id={`observations-${i}-contractionStrength`}
					label="Contraction strength"
					bind:value={obs.contractionStrength}
				>
					<option value="">— Select —</option>
					<option value="mild">Mild</option>
					<option value="moderate">Moderate</option>
					<option value="strong">Strong</option>
				</Select>
			</Field>

			<Field label="Fetal heart rate (bpm)" inputId={`observations-${i}-fetalHeartRate`}>
				<NumberInput
					id={`observations-${i}-fetalHeartRate`}
					label="Fetal heart rate (bpm)"
					min={0}
					max={240}
					step={1}
					bind:value={obs.fetalHeartRate}
				/>
			</Field>

			<Field label="Liquor" inputId={`observations-${i}-liquorState`}>
				<Select id={`observations-${i}-liquorState`} label="Liquor" bind:value={obs.liquorState}>
					<option value="">— Select —</option>
					<option value="intact">Membranes intact</option>
					<option value="clear">Clear</option>
					<option value="meconium">Meconium-stained</option>
					<option value="blood-stained">Blood-stained</option>
					<option value="absent">Absent</option>
				</Select>
			</Field>

			<Field label="Moulding" inputId={`observations-${i}-moulding`}>
				<Select id={`observations-${i}-moulding`} label="Moulding" bind:value={obs.moulding}>
					<option value="">— Select —</option>
					<option value="0">0 (none)</option>
					<option value="+">+</option>
					<option value="++">++</option>
					<option value="+++">+++</option>
				</Select>
			</Field>

			<Field label="Systolic BP (mmHg)" inputId={`observations-${i}-systolicBloodPressure`}>
				<NumberInput
					id={`observations-${i}-systolicBloodPressure`}
					label="Systolic BP (mmHg)"
					min={0}
					max={300}
					step={1}
					bind:value={obs.systolicBloodPressure}
				/>
			</Field>

			<Field label="Diastolic BP (mmHg)" inputId={`observations-${i}-diastolicBloodPressure`}>
				<NumberInput
					id={`observations-${i}-diastolicBloodPressure`}
					label="Diastolic BP (mmHg)"
					min={0}
					max={200}
					step={1}
					bind:value={obs.diastolicBloodPressure}
				/>
			</Field>

			<Field label="Maternal pulse (bpm)" inputId={`observations-${i}-pulse`}>
				<NumberInput
					id={`observations-${i}-pulse`}
					label="Maternal pulse (bpm)"
					min={0}
					max={240}
					step={1}
					bind:value={obs.pulse}
				/>
			</Field>

			<Field label="Temperature (&deg;C)" inputId={`observations-${i}-temperature`}>
				<NumberInput
					id={`observations-${i}-temperature`}
					label="Temperature (°C)"
					min={30}
					max={45}
					step={0.1}
					bind:value={obs.temperature}
				/>
			</Field>

			<Field label="Urine volume (mL)" inputId={`observations-${i}-urineVolumeMl`}>
				<NumberInput
					id={`observations-${i}-urineVolumeMl`}
					label="Urine volume (mL)"
					min={0}
					step={1}
					bind:value={obs.urineVolumeMl}
				/>
			</Field>

			<Field label="Urine protein" inputId={`observations-${i}-urineProtein`}>
				<Select
					id={`observations-${i}-urineProtein`}
					label="Urine protein"
					bind:value={obs.urineProtein}
				>
					<option value="">— Select —</option>
					<option value="negative">Negative</option>
					<option value="trace">Trace</option>
					<option value="+">+</option>
					<option value="++">++</option>
					<option value="+++">+++</option>
				</Select>
			</Field>

			<Field label="Urine ketones" inputId={`observations-${i}-urineKetones`}>
				<Select
					id={`observations-${i}-urineKetones`}
					label="Urine ketones"
					bind:value={obs.urineKetones}
				>
					<option value="">— Select —</option>
					<option value="negative">Negative</option>
					<option value="trace">Trace</option>
					<option value="+">+</option>
					<option value="++">++</option>
					<option value="+++">+++</option>
				</Select>
			</Field>

			<Field label="Urine glucose" inputId={`observations-${i}-urineGlucose`}>
				<Select
					id={`observations-${i}-urineGlucose`}
					label="Urine glucose"
					bind:value={obs.urineGlucose}
				>
					<option value="">— Select —</option>
					<option value="negative">Negative</option>
					<option value="trace">Trace</option>
					<option value="+">+</option>
					<option value="++">++</option>
					<option value="+++">+++</option>
				</Select>
			</Field>

			<Field label="Oxytocin rate (drops/min or mU/min)" inputId={`observations-${i}-oxytocinRate`}>
				<NumberInput
					id={`observations-${i}-oxytocinRate`}
					label="Oxytocin rate (drops/min or mU/min)"
					min={0}
					step={0.1}
					bind:value={obs.oxytocinRate}
				/>
			</Field>

			<Field label="Drugs and IV fluids" inputId={`observations-${i}-drugsAndFluids`}>
				<TextInput
					id={`observations-${i}-drugsAndFluids`}
					label="Drugs and IV fluids"
					placeholder="e.g. Hartmann 500 mL"
					bind:value={obs.drugsAndFluids}
				/>
			</Field>
		</div>
	{/each}

	<Button data-variant="secondary" onclick={addObservation}>+ Add observation</Button>

	<Field label="Live labour-progress status">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {progressColor(
					grade.progressClassification
				)}"
			>
				{progressLabel(grade.progressClassification)}
			</span>
			<strong class="text-base-content">
				{grade.latestDilatationCm === null
					? 'No dilatation recorded'
					: `${grade.latestDilatationCm} cm`}
			</strong>
			<span class="text-base-content/70">
				{grade.elapsedHours === null ? '—' : `${grade.elapsedHours.toFixed(1)} h`} elapsed ·
				{d.observations.length} observation(s) · {grade.flaggedIssues.length} flag(s)
			</span>
		</span>
	</Field>
</Fieldset>
