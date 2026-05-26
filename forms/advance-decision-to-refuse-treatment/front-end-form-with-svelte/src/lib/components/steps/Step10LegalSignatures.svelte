<script lang="ts">
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';
	import { hasLifeSustainingRefusal } from '$lib/engine/utils';

	const s = assessment.data.legalSignatures;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const hasLS = $derived(hasLifeSustainingRefusal(assessment.data));
</script>

<Fieldset legend="Legal Signatures">
	<p class="hint">Signatures and declarations to make this ADRT legally binding</p>
	<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
		<p class="font-bold">LEGAL REQUIREMENTS</p>
		<p class="mt-1">For this ADRT to be legally valid, it must be signed by you and witnessed. If you have refused any life-sustaining treatment, additional requirements apply as detailed below.</p>
	</div>

	<!-- Patient signature section -->
	<div class="rounded-lg border border-gray-200 p-4">
		<h3 class="mb-3 font-semibold text-gray-900">Patient Signature</h3>

		<Field label="I confirm that I have read and understand the contents of this ADRT" required><RadioGroup label="I confirm that I have read and understand the contents of this ADRT">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="patientStatementOfUnderstanding" value={opt.value} bind:group={s.patientStatementOfUnderstanding} required/> {opt.label}</label>{/each}</RadioGroup></Field>

		<Field label="Patient has signed this document" required><RadioGroup label="Patient has signed this document">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="patientSignature" value={opt.value} bind:group={s.patientSignature} required/> {opt.label}</label>{/each}</RadioGroup></Field>

		<Field label="Date of Patient Signature" required inputId="patientSignatureDate"><DateInput id="patientSignatureDate" label="Date of Patient Signature" required bind:value={s.patientSignatureDate} /></Field>
	</div>

	<!-- Witness section -->
	<div class="mt-4 rounded-lg border border-gray-200 p-4">
		<h3 class="mb-3 font-semibold text-gray-900">Witness</h3>

		<Field label="Witness has signed this document" required><RadioGroup label="Witness has signed this document">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="witnessSignature" value={opt.value} bind:group={s.witnessSignature} required/> {opt.label}</label>{/each}</RadioGroup></Field>

		<Field label="Witness Full Name" required inputId="witnessName"><TextInput id="witnessName" label="Witness Full Name" required bind:value={s.witnessName} /></Field>
		<Field label="Witness Address" inputId="witnessAddress"><TextInput id="witnessAddress" label="Witness Address" bind:value={s.witnessAddress} /></Field>
		<Field label="Date of Witness Signature" inputId="witnessSignatureDate"><DateInput id="witnessSignatureDate" label="Date of Witness Signature" bind:value={s.witnessSignatureDate} /></Field>
	</div>

	<!-- Life-sustaining treatment additional requirements -->
	{#if hasLS}
		<div class="mt-4 rounded-lg border-2 border-red-300 bg-red-50 p-4">
			<h3 class="mb-3 font-bold text-red-900">Additional Requirements for Life-Sustaining Treatment Refusal</h3>
			<p class="mb-4 text-sm text-red-800">
				Because you have refused one or more life-sustaining treatments, the following additional legal requirements must be met under the Mental Capacity Act 2005.
			</p>

			<Field label="I have provided a written statement that my refusal of life-sustaining treatment applies even if my life is at risk" required><RadioGroup label="I have provided a written statement that my refusal of life-sustaining treatment applies even if my life is at risk">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="lifeSustainingWrittenStatement" value={opt.value} bind:group={s.lifeSustainingWrittenStatement} required/> {opt.label}</label>{/each}</RadioGroup></Field>

			{#if s.lifeSustainingWrittenStatement === 'yes'}
				<Field label="Written Statement" inputId="lifeSustainingStatementText"><TextAreaInput id="lifeSustainingStatementText" label="Written Statement" rows={4} placeholder="e.g. 'I understand that the treatments I have refused may be necessary to sustain my life, and I confirm that my refusal applies even if my life is at risk as a result.'" bind:value={s.lifeSustainingStatementText} /></Field>
			{/if}

			<Field label="Patient has signed the life-sustaining treatment refusal section" required><RadioGroup label="Patient has signed the life-sustaining treatment refusal section">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="lifeSustainingSignature" value={opt.value} bind:group={s.lifeSustainingSignature} required/> {opt.label}</label>{/each}</RadioGroup></Field>

			<Field label="Witness has signed the life-sustaining treatment refusal section" required><RadioGroup label="Witness has signed the life-sustaining treatment refusal section">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="lifeSustainingWitnessSignature" value={opt.value} bind:group={s.lifeSustainingWitnessSignature} required/> {opt.label}</label>{/each}</RadioGroup></Field>

			{#if s.lifeSustainingWitnessSignature === 'yes'}
				<Field label="Life-Sustaining Witness Full Name" required inputId="lifeSustainingWitnessName"><TextInput id="lifeSustainingWitnessName" label="Life-Sustaining Witness Full Name" required bind:value={s.lifeSustainingWitnessName} /></Field>
				<Field label="Life-Sustaining Witness Address" inputId="lifeSustainingWitnessAddress"><TextInput id="lifeSustainingWitnessAddress" label="Life-Sustaining Witness Address" bind:value={s.lifeSustainingWitnessAddress} /></Field>
			{/if}
		</div>
	{/if}
</Fieldset>
