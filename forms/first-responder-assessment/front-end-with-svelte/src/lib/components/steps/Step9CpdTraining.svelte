<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.cpdTraining;
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

<Fieldset legend="CPD & Training Record">
	<p class="hint">Continuing professional development hours, recertifications, and training dates.</p>

	<div class="field-grid">
		<Field label="CPD hours last year" inputId="cpdHoursLastYear">
			<NumberInput id="cpdHoursLastYear" label="CPD hours last year" min={0} max={500} bind:value={t.cpdHoursLastYear} />
		</Field>
		<Field label="CPD hours required" inputId="cpdHoursRequired">
			<NumberInput id="cpdHoursRequired" label="CPD hours required" min={0} max={500} bind:value={t.cpdHoursRequired} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Mandatory training complete?">
			<RadioGroup label="Mandatory training complete?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="mandatoryTrainingComplete" value={opt.value} bind:group={t.mandatoryTrainingComplete} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Major incident training?">
			<RadioGroup label="Major incident training?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="majorIncidentTraining" value={opt.value} bind:group={t.majorIncidentTraining} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<Field label="Clinical supervision attendance?">
		<RadioGroup label="Clinical supervision attendance?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="clinicalSupervisionAttendance" value={opt.value} bind:group={t.clinicalSupervisionAttendance} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="BLS recertification date" inputId="blsRecertificationDate">
			<DateInput id="blsRecertificationDate" label="BLS recertification date" bind:value={t.blsRecertificationDate} />
		</Field>
		<Field label="ALS recertification date" inputId="alsRecertificationDate">
			<DateInput id="alsRecertificationDate" label="ALS recertification date" bind:value={t.alsRecertificationDate} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Manual handling recertification date" inputId="manualHandlingRecertificationDate">
			<DateInput id="manualHandlingRecertificationDate" label="Manual handling recertification date" bind:value={t.manualHandlingRecertificationDate} />
		</Field>
		<Field label="Safeguarding training date" inputId="safeguardingTrainingDate">
			<DateInput id="safeguardingTrainingDate" label="Safeguarding training date" bind:value={t.safeguardingTrainingDate} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Infection control training date" inputId="infectionControlTrainingDate">
			<DateInput id="infectionControlTrainingDate" label="Infection control training date" bind:value={t.infectionControlTrainingDate} />
		</Field>
		<Field label="Major incident training date" inputId="majorIncidentTrainingDate">
			<DateInput id="majorIncidentTrainingDate" label="Major incident training date" bind:value={t.majorIncidentTrainingDate} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Mentoring capability" inputId="mentoringCapability">
			<Select id="mentoringCapability" label="Mentoring capability" bind:value={t.mentoringCapability}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Reflective practice" inputId="reflectivePractice">
			<Select id="reflectivePractice" label="Reflective practice" bind:value={t.reflectivePractice}>
				<option value="">-- Select --</option>
				{#each competency as o (o.value)}<option value={o.value}>{o.label}</option>{/each}
			</Select>
		</Field>
	</div>

	<Field label="CPD & training notes" inputId="cpdTrainingNotes">
		<TextAreaInput id="cpdTrainingNotes" label="CPD & training notes" rows={3} bind:value={t.cpdTrainingNotes} />
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
