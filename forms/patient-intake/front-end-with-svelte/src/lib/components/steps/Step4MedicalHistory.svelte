<script lang="ts">
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const h = assessment.data.medicalHistory;

	const chronicConditionOptions = [
		{ value: 'hypertension', label: 'Hypertension' },
		{ value: 'type-1-diabetes', label: 'Type 1 Diabetes' },
		{ value: 'type-2-diabetes', label: 'Type 2 Diabetes' },
		{ value: 'heart-disease', label: 'Heart Disease' },
		{ value: 'heart-failure', label: 'Heart Failure' },
		{ value: 'asthma', label: 'Asthma' },
		{ value: 'copd', label: 'COPD' },
		{ value: 'chronic-kidney-disease', label: 'Chronic Kidney Disease' },
		{ value: 'liver-disease', label: 'Liver Disease' },
		{ value: 'thyroid-disorder', label: 'Thyroid Disorder' },
		{ value: 'epilepsy', label: 'Epilepsy' },
		{ value: 'arthritis', label: 'Arthritis' },
		{ value: 'cancer', label: 'Cancer' },
		{ value: 'depression', label: 'Depression' },
		{ value: 'anxiety', label: 'Anxiety' },
		{ value: 'autoimmune-disorder', label: 'Autoimmune Disorder' },
		{ value: 'other', label: 'Other' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Your past and current medical conditions</p>
	<Field label="Do you have any of the following chronic conditions?"><CheckboxGroup label="Do you have any of the following chronic conditions?">{#each chronicConditionOptions as opt (opt.value)}<label><input type="checkbox" class="checkbox-input" value={opt.value} bind:group={h.chronicConditions}/> {opt.label}</label>{/each}</CheckboxGroup></Field>

	<Field label="Previous Surgeries" inputId="surgeries"><TextAreaInput id="surgeries" label="Previous Surgeries" placeholder="List any previous surgeries with approximate dates" bind:value={h.previousSurgeries} /></Field>

	<Field label="Previous Hospitalizations" inputId="hospitalizations"><TextAreaInput id="hospitalizations" label="Previous Hospitalizations" placeholder="List any previous hospital stays with approximate dates and reasons" bind:value={h.previousHospitalizations} /></Field>

	<Field label="Ongoing Treatments" inputId="treatments"><TextAreaInput id="treatments" label="Ongoing Treatments" placeholder="Describe any ongoing treatments or therapies" bind:value={h.ongoingTreatments} /></Field>
</Fieldset>
