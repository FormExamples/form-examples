<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.mandatoryTraining;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const levels = [
		{ value: 'level-1', label: 'Level 1' },
		{ value: 'level-2', label: 'Level 2' },
		{ value: 'level-3', label: 'Level 3' }
	];
</script>

<Fieldset legend="Mandatory Training" description="Statutory and mandatory training modules.">
	<div class="field-grid">
		<RadioGroup name="fireSafetyCompleted" label="Fire safety completed?" options={yesNo} bind:value={d.fireSafetyCompleted} />
		<div class="field">
			<label class="label" for="fireSafetyDate">Fire safety date</label>
			<DateInput label="Fire safety date" bind:value={d.fireSafetyDate} {...{ id: 'fireSafetyDate' }} />
		</div>
	</div>
	<div class="field-grid">
		<RadioGroup name="manualHandlingCompleted" label="Manual handling completed?" options={yesNo} bind:value={d.manualHandlingCompleted} />
		<div class="field">
			<label class="label" for="manualHandlingDate">Manual handling date</label>
			<DateInput label="Manual handling date" bind:value={d.manualHandlingDate} {...{ id: 'manualHandlingDate' }} />
		</div>
	</div>
	<div class="field-grid">
		<RadioGroup name="infectionControlCompleted" label="Infection control completed?" options={yesNo} bind:value={d.infectionControlCompleted} />
		<div class="field">
			<label class="label" for="infectionControlDate">Infection control date</label>
			<DateInput label="Infection control date" bind:value={d.infectionControlDate} {...{ id: 'infectionControlDate' }} />
		</div>
	</div>
	<div class="field-grid">
		<RadioGroup name="safeguardingAdultsCompleted" label="Safeguarding adults completed?" options={yesNo} bind:value={d.safeguardingAdultsCompleted} />
		<Select name="safeguardingAdultsLevel" label="Safeguarding adults level" options={levels} bind:value={d.safeguardingAdultsLevel} />
	</div>
	<div class="field-grid">
		<RadioGroup name="safeguardingChildrenCompleted" label="Safeguarding children completed?" options={yesNo} bind:value={d.safeguardingChildrenCompleted} />
		<Select name="safeguardingChildrenLevel" label="Safeguarding children level" options={levels} bind:value={d.safeguardingChildrenLevel} />
	</div>
	<div class="field-grid">
		<RadioGroup name="informationGovernanceCompleted" label="Information governance completed?" options={yesNo} bind:value={d.informationGovernanceCompleted} />
		<div class="field">
			<label class="label" for="informationGovernanceDate">Information governance date</label>
			<DateInput label="Information governance date" bind:value={d.informationGovernanceDate} {...{ id: 'informationGovernanceDate' }} />
		</div>
	</div>
	<div class="field-grid">
		<RadioGroup name="basicLifeSupportCompleted" label="Basic life support completed?" options={yesNo} bind:value={d.basicLifeSupportCompleted} />
		<div class="field">
			<label class="label" for="basicLifeSupportDate">Basic life support date</label>
			<DateInput label="Basic life support date" bind:value={d.basicLifeSupportDate} {...{ id: 'basicLifeSupportDate' }} />
		</div>
	</div>
	<RadioGroup name="equalityDiversityCompleted" label="Equality &amp; diversity completed?" options={yesNo} bind:value={d.equalityDiversityCompleted} />
	<RadioGroup name="healthSafetyCompleted" label="Health &amp; safety completed?" options={yesNo} bind:value={d.healthSafetyCompleted} />
	<RadioGroup name="conflictResolutionCompleted" label="Conflict resolution completed?" options={yesNo} bind:value={d.conflictResolutionCompleted} />

	<TextAreaInput name="mandatoryTrainingNotes" label="Notes" rows={3} bind:value={d.mandatoryTrainingNotes} />
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
