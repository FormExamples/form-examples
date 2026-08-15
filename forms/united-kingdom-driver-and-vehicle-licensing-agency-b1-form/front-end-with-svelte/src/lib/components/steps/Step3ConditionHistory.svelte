<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const c = assessment.data.conditionHistory;
</script>

<Fieldset legend="Question 1 — Condition history">
	<p class="hint">Please tick the appropriate box(es) if you have ever had any of the following. Provide the date for each condition you tick.</p>

	<label class="checkbox-row">
		<input type="checkbox" class="checkbox-input" name="brainHaemorrhage" bind:checked={c.brainHaemorrhage} />
		<span>a) Brain haemorrhage (including subarachnoid, aneurysm and AVM)</span>
	</label>
	{#if c.brainHaemorrhage}
		<Field label="Date of brain haemorrhage" required inputId="brainHaemorrhageDate">
			<DateInput id="brainHaemorrhageDate" label="Date" required bind:value={c.brainHaemorrhageDate} />
		</Field>
		<Field label="Brain haemorrhage details" inputId="brainHaemorrhageDetails">
			<TextAreaInput id="brainHaemorrhageDetails" label="Brain haemorrhage details" rows={2} bind:value={c.brainHaemorrhageDetails} />
		</Field>
	{/if}

	<label class="checkbox-row">
		<input type="checkbox" class="checkbox-input" name="severeHeadInjury" bind:checked={c.severeHeadInjury} />
		<span>b) Severe head injury involving in-patient treatment</span>
	</label>
	{#if c.severeHeadInjury}
		<Field label="Date of severe head injury" required inputId="severeHeadInjuryDate">
			<DateInput id="severeHeadInjuryDate" label="Date" required bind:value={c.severeHeadInjuryDate} />
		</Field>
		<Field label="Severe head injury details" inputId="severeHeadInjuryDetails">
			<TextAreaInput id="severeHeadInjuryDetails" label="Severe head injury details" rows={2} bind:value={c.severeHeadInjuryDetails} />
		</Field>
	{/if}

	<label class="checkbox-row">
		<input type="checkbox" class="checkbox-input" name="otherCondition" bind:checked={c.otherCondition} />
		<span>c) Any other condition (e.g. subdural haematoma, brain abscess/cyst, encephalitis, hydrocephalus, hypoxic brain damage, Lewy body dementia, transient global amnesia, VP shunt, etc.)</span>
	</label>
	{#if c.otherCondition}
		<Field label="Date of other condition" inputId="otherConditionDate">
			<DateInput id="otherConditionDate" label="Date" bind:value={c.otherConditionDate} />
		</Field>
		<Field label="Other condition details" required inputId="otherConditionDetails">
			<TextAreaInput id="otherConditionDetails" label="Other condition details" rows={3} required bind:value={c.otherConditionDetails} />
		</Field>
	{/if}

	<h3 class="step-subhead">d) Brain surgery</h3>
	<label class="checkbox-row">
		<input type="checkbox" class="checkbox-input" name="brainSurgeryNotApplicable" bind:checked={c.brainSurgeryNotApplicable} />
		<span>Not applicable — I have never had brain surgery</span>
	</label>
	{#if !c.brainSurgeryNotApplicable}
		<Field label="Date of any brain surgery" inputId="brainSurgeryDate">
			<DateInput id="brainSurgeryDate" label="Date of brain surgery" bind:value={c.brainSurgeryDate} />
		</Field>
	{/if}
</Fieldset>

<style>
	.checkbox-row {
		display: flex; align-items: flex-start; gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border-strong);
		border-radius: 0.375rem;
		background: var(--color-surface);
		margin: 0 0 0.75rem;
		cursor: pointer;
	}
	.step-subhead { font-size: 1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
</style>
