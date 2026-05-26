<script lang="ts">
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const c = assessment.data.capacityDeclaration;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Capacity Declaration">
	<p class="hint">Confirmation that you have the mental capacity to make this decision</p>
	<div class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
		<p class="font-semibold">Important Legal Notice</p>
		<p class="mt-1">Under the Mental Capacity Act 2005, you must have the mental capacity to make this advance decision. This means you must be able to understand, retain, and weigh the information relevant to the decision, and communicate your decision.</p>
	</div>

	<Field label="I confirm that I have the mental capacity to make this advance decision" required><RadioGroup label="I confirm that I have the mental capacity to make this advance decision">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="confirmsCapacity" value={opt.value} bind:group={c.confirmsCapacity} required/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="I understand the consequences of refusing the treatments specified in this document, including that I may die as a result" required><RadioGroup label="I understand the consequences of refusing the treatments specified in this document, including that I may die as a result">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="understandsConsequences" value={opt.value} bind:group={c.understandsConsequences} required/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="I confirm that I am making this decision freely and without undue influence from any other person" required><RadioGroup label="I confirm that I am making this decision freely and without undue influence from any other person">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="noUndueInfluence" value={opt.value} bind:group={c.noUndueInfluence} required/> {opt.label}</label>{/each}</RadioGroup></Field>

	<div class="mt-6 border-t border-gray-200 pt-4">
		<h3 class="mb-3 text-sm font-semibold text-gray-700">Professional Capacity Assessment (if available)</h3>
		<Field label="Has a healthcare professional assessed your mental capacity?"><RadioGroup label="Has a healthcare professional assessed your mental capacity?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="professionalCapacityAssessment" value={opt.value} bind:group={c.professionalCapacityAssessment}/> {opt.label}</label>{/each}</RadioGroup></Field>
		{#if c.professionalCapacityAssessment === 'yes'}
			<Field label="Assessed by (name)" inputId="assessedByName"><TextInput id="assessedByName" label="Assessed by (name)" bind:value={c.assessedByName} /></Field>
			<Field label="Role/Title" inputId="assessedByRole"><TextInput id="assessedByRole" label="Role/Title" bind:value={c.assessedByRole} /></Field>
			<Field label="Assessment Date" inputId="assessmentDate"><DateInput id="assessmentDate" label="Assessment Date" bind:value={c.assessmentDate} /></Field>
			<Field label="Assessment Details" inputId="assessmentDetails"><TextAreaInput id="assessmentDetails" label="Assessment Details" placeholder="Summary of the capacity assessment findings" bind:value={c.assessmentDetails} /></Field>
		{/if}
	</div>
</Fieldset>
