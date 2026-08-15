<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const s = $state(assessment.data.statementContext);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Statement Context">
	<p class="hint">Help us understand why you are making this advance statement and when it should apply</p>
	<Field label="Why are you making this advance statement?" inputId="reasonForStatement"><TextAreaInput id="reasonForStatement" label="Why are you making this advance statement?" rows={4} placeholder="e.g. I have been diagnosed with a progressive condition and wish to record my preferences while I have capacity..." bind:value={s.reasonForStatement} /></Field>

	<Field label="Current diagnosis or medical conditions" inputId="currentDiagnosis"><TextAreaInput id="currentDiagnosis" label="Current diagnosis or medical conditions" rows={3} placeholder="List any current medical conditions or diagnoses..." bind:value={s.currentDiagnosis} /></Field>

	<Field label="Your understanding of your condition" inputId="understandingOfCondition"><TextAreaInput id="understandingOfCondition" label="Your understanding of your condition" rows={4} placeholder="Describe what you understand about your condition and its likely progression..." bind:value={s.understandingOfCondition} /></Field>

	<Field label="When should this statement apply?" inputId="whenStatementShouldApply"><TextAreaInput id="whenStatementShouldApply" label="When should this statement apply?" rows={4} placeholder="e.g. When I am no longer able to make decisions for myself, or when I can no longer communicate my wishes..." bind:value={s.whenStatementShouldApply} /></Field>

	<Field label="Have you made any previous advance statements?"><RadioGroup label="Have you made any previous advance statements?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="previousStatements" value={opt.value} bind:group={s.previousAdvanceStatements}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if s.previousAdvanceStatements === 'yes'}
		<Field label="Details of previous advance statements" inputId="previousStatementDetails"><TextAreaInput id="previousStatementDetails" label="Details of previous advance statements" rows={3} placeholder="Where are they held? This statement supersedes any previous versions." bind:value={s.previousStatementDetails} /></Field>
	{/if}
</Fieldset>
