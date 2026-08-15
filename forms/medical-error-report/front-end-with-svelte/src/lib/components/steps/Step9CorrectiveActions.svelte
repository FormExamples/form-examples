<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.correctiveActions;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Corrective Actions" description="Actions to prevent recurrence">
	<TextAreaInput label="Immediate Corrective Actions" name="immediateCorrectiveActions" rows={3} bind:value={d.immediateCorrectiveActions} />
	<TextAreaInput label="Long-term Corrective Actions" name="longTermCorrectiveActions" rows={3} bind:value={d.longTermCorrectiveActions} />

	<RadioGroup label="Policy change required?" name="policyChangeRequired" options={yesNo} bind:value={d.policyChangeRequired} />
	{#if d.policyChangeRequired === 'yes'}
		<TextInput label="Policy Change Details" name="policyChangeDetails" bind:value={d.policyChangeDetails} />
	{/if}

	<RadioGroup label="Training required?" name="trainingRequired" options={yesNo} bind:value={d.trainingRequired} />
	{#if d.trainingRequired === 'yes'}
		<TextInput label="Training Details" name="trainingDetails" bind:value={d.trainingDetails} />
	{/if}

	<RadioGroup label="Equipment change required?" name="equipmentChangeRequired" options={yesNo} bind:value={d.equipmentChangeRequired} />
	{#if d.equipmentChangeRequired === 'yes'}
		<TextInput label="Equipment Change Details" name="equipmentChangeDetails" bind:value={d.equipmentChangeDetails} />
	{/if}

	<RadioGroup label="Process redesign required?" name="processRedesignRequired" options={yesNo} bind:value={d.processRedesignRequired} />
	{#if d.processRedesignRequired === 'yes'}
		<TextInput label="Process Redesign Details" name="processRedesignDetails" bind:value={d.processRedesignDetails} />
	{/if}

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Responsible Person" name="responsiblePerson" bind:value={d.responsiblePerson} />
		<TextInput label="Target Completion Date" name="targetCompletionDate" type="date" bind:value={d.targetCompletionDate} />
	</div>

	<Select
		label="Actions Status"
		name="actionsStatus"
		options={[
			{ value: 'planned', label: 'Planned' },
			{ value: 'in-progress', label: 'In Progress' },
			{ value: 'completed', label: 'Completed' },
			{ value: 'overdue', label: 'Overdue' }
		]}
		bind:value={d.actionsStatus}
	/>
</Fieldset>
