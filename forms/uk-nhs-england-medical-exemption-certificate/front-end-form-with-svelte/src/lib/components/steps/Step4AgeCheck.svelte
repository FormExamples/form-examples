<script lang="ts">
	import { application } from '$lib/stores/application.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import { ageInYears } from '$lib/engine/utils';

	const data = application.data;
	const ageCheck = data.ageCheck;
	const patient = data.patient;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const age = $derived(ageInYears(patient.birthDate));

	const exemptOnAgeGrounds = $derived.by(() => {
		if (age === null) return '';
		if (age >= 60) return '60+';
		if (age < 16) return 'under-16';
		if (age <= 18 && patient.fullTimeEducation === 'yes') return '16-18-fte';
		return '';
	});
</script>

<SectionCard
	title="Age-based exclusion check"
	description="Some applicants are already entitled to free NHS prescriptions on age grounds and do not need an FP92A."
>
	{#if age === null}
		<p class="text-sm text-gray-500">
			Enter the patient's date of birth in Step 2 to derive the age and compute any
			age-based exemption.
		</p>
	{:else}
		<p class="mb-4 text-sm text-gray-700">
			Derived age: <strong>{age}</strong> years.
		</p>

		{#if age >= 16 && age <= 18}
			<RadioGroup
				label="Is the patient in full-time education?"
				name="fullTimeEducation"
				options={yesNoOptions}
				bind:value={patient.fullTimeEducation}
			/>
		{/if}

		{#if exemptOnAgeGrounds === '60+'}
			<div
				class="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
			>
				Patient is aged 60 or over &mdash; already entitled to free NHS prescriptions on age
				grounds. An FP92A is not required.
			</div>
		{:else if exemptOnAgeGrounds === 'under-16'}
			<div
				class="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
			>
				Patient is aged under 16 &mdash; already entitled to free NHS prescriptions on age
				grounds.
			</div>
		{:else if exemptOnAgeGrounds === '16-18-fte'}
			<div
				class="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
			>
				Patient is aged 16-18 in full-time education &mdash; already entitled to free NHS
				prescriptions on age grounds.
			</div>
		{:else}
			<div
				class="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900"
			>
				No age-based exemption applies &mdash; continue with the FP92A.
			</div>
		{/if}

		<RadioGroup
			label="Practitioner has reviewed any age-based exemption advice"
			name="practitionerAcknowledgedAgeAdvice"
			options={yesNoOptions}
			bind:value={ageCheck.practitionerAcknowledgedAgeAdvice}
		/>
	{/if}
</SectionCard>
