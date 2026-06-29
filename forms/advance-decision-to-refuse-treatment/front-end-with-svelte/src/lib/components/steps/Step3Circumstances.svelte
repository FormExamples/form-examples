<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const c = assessment.data.circumstances;
</script>

<Fieldset legend="Circumstances">
	<p class="hint">Describe the specific circumstances when this ADRT should apply</p>
	<div class="mb-4 rounded-lg border border-info/40 bg-info/10 p-4 text-sm text-info">
		<p class="font-semibold">Guidance</p>
		<p class="mt-1">Be as specific as possible about when this ADRT applies. The more precise your description, the easier it will be for healthcare professionals to determine whether the circumstances match your wishes.</p>
	</div>

	<Field label="Specific Circumstances" inputId="specificCircumstances"><TextAreaInput id="specificCircumstances" label="Specific Circumstances" rows={5} placeholder="e.g. 'In the event that I develop advanced dementia and can no longer recognise my family or communicate meaningfully...'" bind:value={c.specificCircumstances} /></Field>

	<Field label="Medical Conditions / Situations" inputId="medicalConditions"><TextAreaInput id="medicalConditions" label="Medical Conditions / Situations" rows={4} placeholder="Describe any existing or anticipated medical conditions relevant to this ADRT" bind:value={c.medicalConditions} /></Field>

	<Field label="Additional Situation Description" inputId="situationsDescription"><TextAreaInput id="situationsDescription" label="Additional Situation Description" rows={4} placeholder="Any further details about the circumstances in which this ADRT should apply" bind:value={c.situationsDescription} /></Field>
</Fieldset>
