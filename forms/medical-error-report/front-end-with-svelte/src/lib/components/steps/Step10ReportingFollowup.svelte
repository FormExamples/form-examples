<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.reportingFollowup;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Reporting & Follow-up" description="External reporting and report closure">
	<TextInput label="Internal Reference" name="internalReference" bind:value={d.internalReference} />

	<RadioGroup label="Reported to Datix?" name="reportedToDatix" options={yesNo} bind:value={d.reportedToDatix} />
	{#if d.reportedToDatix === 'yes'}
		<TextInput label="Datix Reference" name="datixReference" bind:value={d.datixReference} />
	{/if}

	<RadioGroup label="Reported to NRLS?" name="reportedToNrls" options={yesNo} bind:value={d.reportedToNrls} />
	{#if d.reportedToNrls === 'yes'}
		<TextInput label="NRLS Reference" name="nrlsReference" bind:value={d.nrlsReference} />
	{/if}

	<RadioGroup label="Reported to CQC?" name="reportedToCqc" options={yesNo} bind:value={d.reportedToCqc} />
	<RadioGroup label="Reported to HSIB?" name="reportedToHsib" options={yesNo} bind:value={d.reportedToHsib} />
	<RadioGroup label="Reported to coroner?" name="reportedToCoroner" options={yesNo} bind:value={d.reportedToCoroner} />
	<RadioGroup label="Safeguarding referral made?" name="safeguardingReferral" options={yesNo} bind:value={d.safeguardingReferral} />

	<TextAreaInput label="Lessons Learned" name="lessonsLearned" rows={4} bind:value={d.lessonsLearned} />

	<RadioGroup label="Shared with team?" name="sharedWithTeam" options={yesNo} bind:value={d.sharedWithTeam} />

	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput label="Follow-up Review Date" name="followUpReviewDate" type="date" bind:value={d.followUpReviewDate} />
		<TextInput label="Follow-up Reviewer" name="followUpReviewer" bind:value={d.followUpReviewer} />
	</div>

	<Select
		label="Final Status"
		name="finalStatus"
		options={[
			{ value: 'open', label: 'Open' },
			{ value: 'under-review', label: 'Under Review' },
			{ value: 'closed', label: 'Closed' }
		]}
		bind:value={d.finalStatus}
	/>
	{#if d.finalStatus === 'closed'}
		<TextInput label="Closure Date" name="closureDate" type="date" bind:value={d.closureDate} />
	{/if}
</Fieldset>
