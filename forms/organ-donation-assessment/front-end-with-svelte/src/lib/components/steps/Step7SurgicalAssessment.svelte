<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.surgicalAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="7. Surgical Assessment">
	<p class="hint">Anaesthetic risk and surgical fitness for the donation procedure.</p>

	<Field label="ASA Grade" inputId="asaGrade">
		<Select id="asaGrade" label="ASA Grade" bind:value={d.asaGrade}>
			<option value="">-- Select --</option>
			<option value="I">ASA I — Healthy donor</option>
			<option value="II">ASA II — Mild systemic disease</option>
			<option value="III">ASA III — Severe systemic disease</option>
			<option value="IV">ASA IV — Life-threatening disease</option>
			<option value="V">ASA V — Moribund</option>
		</Select>
	</Field>

	<Field label="Have you had a general anaesthetic before?">
		<RadioGroup label="Have you had a general anaesthetic before?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousAnaesthetic" value={opt.value} bind:group={d.previousAnaesthetic} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Any complications with previous anaesthetics?">
		<RadioGroup label="Any complications with previous anaesthetics?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="anaestheticComplications" value={opt.value} bind:group={d.anaestheticComplications} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.anaestheticComplications === 'yes'}
		<Field label="Complication details" inputId="complicationDetails">
			<TextAreaInput id="complicationDetails" label="Complication details" rows={2} placeholder="Type, severity, recovery…" bind:value={d.complicationDetails} />
		</Field>
	{/if}

	<Field label="Mallampati Score" inputId="mallampatiScore">
		<Select id="mallampatiScore" label="Mallampati Score" bind:value={d.mallampatiScore}>
			<option value="">-- Select --</option>
			<option value="I">I — Easy intubation</option>
			<option value="II">II</option>
			<option value="III">III — Anticipate difficult airway</option>
			<option value="IV">IV — Difficult airway</option>
		</Select>
	</Field>

	<Field label="Any other airway concerns?">
		<RadioGroup label="Any other airway concerns?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="airwayConcerns" value={opt.value} bind:group={d.airwayConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.airwayConcerns === 'yes'}
		<Field label="Airway details" inputId="airwayDetails">
			<TextAreaInput id="airwayDetails" label="Airway details" rows={2} placeholder="Specific concerns…" bind:value={d.airwayDetails} />
		</Field>
	{/if}

	<Field label="Overall surgical fitness" inputId="surgicalFitness">
		<Select id="surgicalFitness" label="Overall surgical fitness" bind:value={d.surgicalFitness}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="pending">Pending</option>
		</Select>
	</Field>
	{#if d.surgicalFitness === 'abnormal'}
		<Field label="Surgical fitness notes" inputId="surgicalFitnessNotes">
			<TextAreaInput id="surgicalFitnessNotes" label="Surgical fitness notes" rows={2} placeholder="Specific concerns…" bind:value={d.surgicalFitnessNotes} />
		</Field>
	{/if}

	<Field label="Planned procedure" inputId="plannedProcedure">
		<TextInput id="plannedProcedure" label="Planned procedure" placeholder="e.g. open / laparoscopic donor nephrectomy" bind:value={d.plannedProcedure} />
	</Field>

	<Field label="Smoking status">
		<RadioGroup label="Smoking status">
			<label><input type="radio" class="radio-input" name="smokingStatus" value="current" bind:group={d.smokingStatus} /> Current smoker</label>
			<label><input type="radio" class="radio-input" name="smokingStatus" value="ex" bind:group={d.smokingStatus} /> Ex-smoker</label>
			<label><input type="radio" class="radio-input" name="smokingStatus" value="never" bind:group={d.smokingStatus} /> Never smoked</label>
		</RadioGroup>
	</Field>

	<Field label="Alcohol use" inputId="alcoholUse">
		<Select id="alcoholUse" label="Alcohol use" bind:value={d.alcoholUse}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="occasional">Occasional</option>
			<option value="moderate">Moderate</option>
			<option value="heavy">Heavy</option>
		</Select>
	</Field>
</Fieldset>
