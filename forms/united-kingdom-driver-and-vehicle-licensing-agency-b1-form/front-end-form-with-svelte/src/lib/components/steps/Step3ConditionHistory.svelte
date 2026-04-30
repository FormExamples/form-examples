<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const c = assessment.data.conditionHistory;
</script>

<SectionCard
	title="Question 1 — Condition history"
	description="Please tick the appropriate box(es) if you have ever had any of the following. Provide the date for each condition you tick."
>
	<Checkbox
		label="a) Brain haemorrhage (including subarachnoid, aneurysm and AVM)"
		name="brainHaemorrhage"
		bind:checked={c.brainHaemorrhage}
	/>
	{#if c.brainHaemorrhage}
		<TextInput
			label="Date of brain haemorrhage"
			name="brainHaemorrhageDate"
			type="date"
			bind:value={c.brainHaemorrhageDate}
			required
		/>
		<TextArea
			label="Brain haemorrhage details"
			name="brainHaemorrhageDetails"
			bind:value={c.brainHaemorrhageDetails}
			rows={2}
		/>
	{/if}

	<Checkbox
		label="b) Severe head injury involving in-patient treatment"
		name="severeHeadInjury"
		bind:checked={c.severeHeadInjury}
	/>
	{#if c.severeHeadInjury}
		<TextInput
			label="Date of severe head injury"
			name="severeHeadInjuryDate"
			type="date"
			bind:value={c.severeHeadInjuryDate}
			required
		/>
		<TextArea
			label="Severe head injury details"
			name="severeHeadInjuryDetails"
			bind:value={c.severeHeadInjuryDetails}
			rows={2}
		/>
	{/if}

	<Checkbox
		label="c) Any other condition (e.g. subdural haematoma, brain abscess/cyst, encephalitis, hydrocephalus, hypoxic brain damage, Lewy body dementia, transient global amnesia, VP shunt, etc.)"
		name="otherCondition"
		bind:checked={c.otherCondition}
	/>
	{#if c.otherCondition}
		<TextInput
			label="Date of other condition"
			name="otherConditionDate"
			type="date"
			bind:value={c.otherConditionDate}
		/>
		<TextArea
			label="Other condition details"
			name="otherConditionDetails"
			bind:value={c.otherConditionDetails}
			rows={3}
			required
		/>
	{/if}

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">d) Brain surgery</h3>
	<Checkbox
		label="Not applicable — I have never had brain surgery"
		name="brainSurgeryNotApplicable"
		bind:checked={c.brainSurgeryNotApplicable}
	/>
	{#if !c.brainSurgeryNotApplicable}
		<TextInput
			label="Date of any brain surgery"
			name="brainSurgeryDate"
			type="date"
			bind:value={c.brainSurgeryDate}
		/>
	{/if}
</SectionCard>
