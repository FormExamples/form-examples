<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const ps = assessment.data.psychologicalReadiness;
	const competency = [
		{ value: 'not-competent', label: 'Not Competent' },
		{ value: 'developing', label: 'Developing' },
		{ value: 'competent', label: 'Competent' },
		{ value: 'expert', label: 'Expert' }
	];
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Psychological Readiness">
	<p class="hint">Resilience, stress response, and screening for occupational psychological risk.</p>

	<div class="field-grid">
		<Field label="Stress management" inputId="stressManagement">
			<Select id="stressManagement" label="Stress management" bind:value={ps.stressManagement}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Resilience level" inputId="resilienceLevel">
			<Select id="resilienceLevel" label="Resilience level" bind:value={ps.resilienceLevel}>
				<option value="">-- Select --</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="good">Good</option>
				<option value="excellent">Excellent</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Decision making under pressure" inputId="decisionMakingUnderPressure">
			<Select id="decisionMakingUnderPressure" label="Decision making under pressure" bind:value={ps.decisionMakingUnderPressure}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Emotional regulation" inputId="emotionalRegulation">
			<Select id="emotionalRegulation" label="Emotional regulation" bind:value={ps.emotionalRegulation}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="PTSD screening performed?">
			<RadioGroup label="PTSD screening performed?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="ptsdScreening" value={opt.value} bind:group={ps.ptsdScreening} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if ps.ptsdScreening === 'yes'}
			<Field label="PTSD screening result" inputId="ptsdScreeningResult">
				<Select id="ptsdScreeningResult" label="PTSD screening result" bind:value={ps.ptsdScreeningResult}>
					<option value="">-- Select --</option>
					<option value="negative">Negative</option>
					<option value="positive">Positive</option>
					<option value="inconclusive">Inconclusive</option>
				</Select>
			</Field>
		{/if}
	</div>

	<div class="field-grid">
		<Field label="Critical incident exposure?">
			<RadioGroup label="Critical incident exposure?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="criticalIncidentExposure" value={opt.value} bind:group={ps.criticalIncidentExposure} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Critical incident debriefed?">
			<RadioGroup label="Critical incident debriefed?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="criticalIncidentDebriefed" value={opt.value} bind:group={ps.criticalIncidentDebriefed} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	{#if ps.criticalIncidentExposure === 'yes'}
		<Field label="Critical incident details" inputId="criticalIncidentDetails">
			<TextAreaInput id="criticalIncidentDetails" label="Critical incident details" rows={3} bind:value={ps.criticalIncidentDetails} />
		</Field>
	{/if}

	<div class="field-grid">
		<Field label="Sleep quality" inputId="sleepQuality">
			<Select id="sleepQuality" label="Sleep quality" bind:value={ps.sleepQuality}>
				<option value="">-- Select --</option>
				<option value="good">Good</option>
				<option value="fair">Fair</option>
				<option value="poor">Poor</option>
			</Select>
		</Field>
		<Field label="Burnout risk" inputId="burnoutRisk">
			<Select id="burnoutRisk" label="Burnout risk" bind:value={ps.burnoutRisk}>
				<option value="">-- Select --</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
			</Select>
		</Field>
	</div>

	<Field label="Psychological notes" inputId="psychologicalNotes">
		<TextAreaInput id="psychologicalNotes" label="Psychological notes" rows={3} bind:value={ps.psychologicalNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
