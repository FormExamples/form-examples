<script lang="ts">
	import { application } from '$lib/stores/application.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const data = application.data;
	const patient = data.patient;
	const pregnancyCheck = data.pregnancyCheck;

	const pregnancyStatusOptions = [
		{ value: 'not-pregnant', label: 'Not pregnant' },
		{ value: 'pregnant', label: 'Pregnant' },
		{
			value: 'post-partum-within-12-months',
			label: 'Post-partum (within the last 12 months)'
		}
	];

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const requiresFw8 = $derived(
		patient.pregnancyStatus === 'pregnant' ||
			patient.pregnancyStatus === 'post-partum-within-12-months'
	);
</script>

<SectionCard
	title="Pregnancy / maternity check"
	description="Pregnant patients (and those within 12 months post-partum) qualify for the maternity exemption certificate (FW8) rather than the FP92A."
>
	<RadioGroup
		label="Pregnancy status"
		name="pregnancyStatus"
		options={pregnancyStatusOptions}
		bind:value={patient.pregnancyStatus}
	/>

	{#if requiresFw8}
		<div class="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
			Patient should apply for an <strong>FW8 maternity exemption certificate</strong>
			rather than an FP92A.
		</div>

		<RadioGroup
			label="Practitioner has advised the patient to apply for the FW8 instead"
			name="practitionerAcknowledgedFw8Redirect"
			options={yesNoOptions}
			bind:value={pregnancyCheck.practitionerAcknowledgedFw8Redirect}
		/>
	{/if}
</SectionCard>
