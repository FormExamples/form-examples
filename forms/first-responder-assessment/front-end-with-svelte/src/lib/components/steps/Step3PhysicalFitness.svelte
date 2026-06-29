<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.physicalFitness;
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

<Fieldset legend="Physical Fitness Assessment">
	<p class="hint">Cardiovascular, strength, and mobility competencies with objective measures.</p>

	<div class="field-grid">
		<Field label="Cardiovascular fitness" inputId="cardiovascularFitness">
			<Select id="cardiovascularFitness" label="Cardiovascular fitness" bind:value={p.cardiovascularFitness}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Muscular strength" inputId="muscularStrength">
			<Select id="muscularStrength" label="Muscular strength" bind:value={p.muscularStrength}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Manual handling competency" inputId="manualHandlingCompetency">
			<Select id="manualHandlingCompetency" label="Manual handling competency" bind:value={p.manualHandlingCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Flexibility & mobility" inputId="flexibilityMobility">
			<Select id="flexibilityMobility" label="Flexibility & mobility" bind:value={p.flexibilityMobility}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Balance & coordination" inputId="balanceCoordination">
			<Select id="balanceCoordination" label="Balance & coordination" bind:value={p.balanceCoordination}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Able to carry/lift a patient?">
			<RadioGroup label="Able to carry/lift a patient?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="patientCarryAbility" value={opt.value} bind:group={p.patientCarryAbility} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Shuttle run level" inputId="shuttleRunLevel">
			<NumberInput id="shuttleRunLevel" label="Shuttle run level" min={0} max={21} bind:value={p.shuttleRunLevel} />
		</Field>
		<Field label="VO2 max (ml/kg/min)" inputId="vo2Max">
			<NumberInput id="vo2Max" label="VO2 max" min={0} max={90} bind:value={p.vo2Max} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Grip strength (kg)" inputId="gripStrengthKg">
			<NumberInput id="gripStrengthKg" label="Grip strength" min={0} max={120} bind:value={p.gripStrengthKg} />
		</Field>
		<Field label="Resting heart rate (bpm)" inputId="restingHeartRateBpm">
			<NumberInput id="restingHeartRateBpm" label="Resting heart rate" min={30} max={150} bind:value={p.restingHeartRateBpm} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Blood pressure systolic (mmHg)" inputId="bloodPressureSystolic">
			<NumberInput id="bloodPressureSystolic" label="Blood pressure systolic" min={70} max={250} bind:value={p.bloodPressureSystolic} />
		</Field>
		<Field label="Blood pressure diastolic (mmHg)" inputId="bloodPressureDiastolic">
			<NumberInput id="bloodPressureDiastolic" label="Blood pressure diastolic" min={40} max={150} bind:value={p.bloodPressureDiastolic} />
		</Field>
	</div>

	<Field label="Physical fitness notes" inputId="physicalFitnessNotes">
		<TextAreaInput id="physicalFitnessNotes" label="Physical fitness notes" rows={3} bind:value={p.physicalFitnessNotes} />
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
