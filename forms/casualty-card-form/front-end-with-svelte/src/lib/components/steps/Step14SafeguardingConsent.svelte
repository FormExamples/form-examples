<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const sc = assessment.data.safeguardingConsent;
</script>

<Fieldset title="Safeguarding & Consent" description="Safeguarding concerns, mental capacity, and completion details">
	<RadioGroup
		label="Safeguarding Concern?"
		name="safeguardingConcern"
		bind:value={sc.safeguardingConcern}
		options={[
			{ value: 'yes', label: 'Yes' },
			{ value: 'no', label: 'No' }
		]}
	/>

	{#if sc.safeguardingConcern === 'yes'}
		<TextInput label="Safeguarding Type" name="safeguardingType" bind:value={sc.safeguardingType} placeholder="e.g. adult, child, domestic violence" />
		<RadioGroup
			label="Referral Made?"
			name="referralMade"
			bind:value={sc.referralMade}
			options={[
				{ value: 'yes', label: 'Yes' },
				{ value: 'no', label: 'No' }
			]}
		/>
	{/if}

	<hr class="my-6 border-base-300" />

	<TextAreaInput label="Mental Capacity Assessment" name="mentalCapacityAssessment" bind:value={sc.mentalCapacityAssessment} rows={2} placeholder="Assessment of capacity to make decisions" />
	<TextInput label="Mental Health Act Status" name="mentalHealthActStatus" bind:value={sc.mentalHealthActStatus} placeholder="e.g. Section 136, Section 2, informal" />

	<RadioGroup
		label="Consent for Treatment"
		name="consentForTreatment"
		bind:value={sc.consentForTreatment}
		options={[
			{ value: 'verbal', label: 'Verbal' },
			{ value: 'written', label: 'Written' },
			{ value: 'lacks-capacity', label: 'Lacks Capacity' }
		]}
	/>

	<hr class="my-6 border-base-300" />

	<h3 class="mb-3 text-lg font-semibold text-base-content">Completed By</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Name" name="completedByName" bind:value={sc.completedByName} required />
		<TextInput label="Role" name="completedByRole" bind:value={sc.completedByRole} />
	</div>
	<TextInput label="GMC Number" name="completedByGmcNumber" bind:value={sc.completedByGmcNumber} />
	<TextInput label="Senior Reviewing Clinician" name="seniorReviewingClinician" bind:value={sc.seniorReviewingClinician} />
</Fieldset>
