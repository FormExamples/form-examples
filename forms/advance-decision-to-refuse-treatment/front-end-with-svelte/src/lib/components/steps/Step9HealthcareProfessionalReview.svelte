<script lang="ts">
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const h = assessment.data.healthcareProfessionalReview;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Healthcare Professional Review">
	<p class="hint">Details of the clinician who reviewed this ADRT</p>
	<div class="mb-4 rounded-lg border border-info/40 bg-info/10 p-4 text-sm text-info">
		<p class="font-semibold">Recommended</p>
		<p class="mt-1">While not a strict legal requirement, having a healthcare professional review your ADRT significantly strengthens its validity. A clinician can confirm your understanding of the treatment refusals and their consequences.</p>
	</div>

	<Field label="Reviewing Clinician Name" inputId="reviewedByClinicianName"><TextInput id="reviewedByClinicianName" label="Reviewing Clinician Name" bind:value={h.reviewedByClinicianName} /></Field>
	<Field label="Role / Title" inputId="reviewedByClinicianRole"><TextInput id="reviewedByClinicianRole" label="Role / Title" placeholder="e.g. Consultant, GP, Specialist Nurse" bind:value={h.reviewedByClinicianRole} /></Field>
	<Field label="Review Date" inputId="reviewDate"><DateInput id="reviewDate" label="Review Date" bind:value={h.reviewDate} /></Field>

	<Field label="Clinical Opinion on Capacity" inputId="clinicalOpinionOnCapacity"><TextAreaInput id="clinicalOpinionOnCapacity" label="Clinical Opinion on Capacity" rows={4} placeholder="Clinician's assessment of the patient's mental capacity to make this advance decision" bind:value={h.clinicalOpinionOnCapacity} /></Field>

	<Field label="Does the reviewing clinician have any concerns about this ADRT?"><RadioGroup label="Does the reviewing clinician have any concerns about this ADRT?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="anyConcerns" value={opt.value} bind:group={h.anyConcerns}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if h.anyConcerns === 'yes'}
		<Field label="Details of concerns" inputId="concernsDetails"><TextAreaInput id="concernsDetails" label="Details of concerns" rows={4} placeholder="Please describe the concerns" bind:value={h.concernsDetails} /></Field>
	{/if}
</Fieldset>
