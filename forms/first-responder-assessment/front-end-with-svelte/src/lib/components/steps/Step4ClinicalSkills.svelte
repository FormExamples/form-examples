<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.clinicalSkills;
	const competency = [
		{ value: 'not-competent', label: 'Not Competent' },
		{ value: 'developing', label: 'Developing' },
		{ value: 'competent', label: 'Competent' },
		{ value: 'expert', label: 'Expert' }
	];
</script>

<Fieldset legend="Clinical Skills Competency">
	<p class="hint">Assess clinical competency across core first-responder skill domains.</p>

	<div class="field-grid">
		<Field label="Basic life support" inputId="basicLifeSupport">
			<Select id="basicLifeSupport" label="Basic life support" bind:value={c.basicLifeSupport}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Advanced life support" inputId="advancedLifeSupport">
			<Select id="advancedLifeSupport" label="Advanced life support" bind:value={c.advancedLifeSupport}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Airway management" inputId="airwayManagement">
			<Select id="airwayManagement" label="Airway management" bind:value={c.airwayManagement}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="IV cannulation" inputId="ivCannulation">
			<Select id="ivCannulation" label="IV cannulation" bind:value={c.ivCannulation}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Drug administration" inputId="drugAdministration">
			<Select id="drugAdministration" label="Drug administration" bind:value={c.drugAdministration}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Trauma assessment" inputId="traumaAssessment">
			<Select id="traumaAssessment" label="Trauma assessment" bind:value={c.traumaAssessment}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Immobilisation & splinting" inputId="immobilisationSplinting">
			<Select id="immobilisationSplinting" label="Immobilisation & splinting" bind:value={c.immobilisationSplinting}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="ECG interpretation" inputId="ecgInterpretation">
			<Select id="ecgInterpretation" label="ECG interpretation" bind:value={c.ecgInterpretation}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Patient assessment" inputId="patientAssessment">
			<Select id="patientAssessment" label="Patient assessment" bind:value={c.patientAssessment}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Triage competency" inputId="triageCompetency">
			<Select id="triageCompetency" label="Triage competency" bind:value={c.triageCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Paediatric competency" inputId="paediatricCompetency">
			<Select id="paediatricCompetency" label="Paediatric competency" bind:value={c.paediatricCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Obstetric competency" inputId="obstetricCompetency">
			<Select id="obstetricCompetency" label="Obstetric competency" bind:value={c.obstetricCompetency}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<Field label="Clinical skills notes" inputId="clinicalSkillsNotes">
		<TextAreaInput id="clinicalSkillsNotes" label="Clinical skills notes" rows={3} bind:value={c.clinicalSkillsNotes} />
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
