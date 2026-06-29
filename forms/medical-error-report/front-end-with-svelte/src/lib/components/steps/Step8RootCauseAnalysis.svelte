<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.rootCauseAnalysis;
</script>

<Fieldset title="Root Cause Analysis" description="Investigation of the underlying causes">
	<Select
		label="RCA Conducted?"
		name="rcaConducted"
		options={[
			{ value: 'yes', label: 'Yes' },
			{ value: 'no', label: 'No' },
			{ value: 'pending', label: 'Pending' }
		]}
		bind:value={d.rcaConducted}
	/>

	{#if d.rcaConducted === 'yes'}
		<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
			<TextInput label="RCA Date" name="rcaDate" type="date" bind:value={d.rcaDate} />
			<TextInput label="RCA Lead" name="rcaLead" bind:value={d.rcaLead} />
		</div>
		<TextInput label="RCA Team Members" name="rcaTeamMembers" bind:value={d.rcaTeamMembers} />
	{/if}

	<Select
		label="Root Cause Category"
		name="rootCauseCategory"
		options={[
			{ value: 'human-error', label: 'Human Error' },
			{ value: 'system-failure', label: 'System Failure' },
			{ value: 'process-failure', label: 'Process Failure' },
			{ value: 'communication', label: 'Communication' },
			{ value: 'training', label: 'Training' },
			{ value: 'equipment', label: 'Equipment' },
			{ value: 'environmental', label: 'Environmental' },
			{ value: 'organisational', label: 'Organisational' },
			{ value: 'multiple', label: 'Multiple' },
			{ value: 'other', label: 'Other' }
		]}
		bind:value={d.rootCauseCategory}
	/>
	<TextAreaInput label="Root Cause Description" name="rootCauseDescription" rows={3} bind:value={d.rootCauseDescription} />
	<TextAreaInput label="Five Whys Analysis" name="fiveWhysAnalysis" rows={3} bind:value={d.fiveWhysAnalysis} />
	<TextAreaInput label="Fishbone Factors" name="fishboneFactors" rows={3} bind:value={d.fishboneFactors} />
	<TextAreaInput label="System Vulnerabilities" name="systemVulnerabilities" rows={3} bind:value={d.systemVulnerabilities} />

	<Select
		label="Similar Incidents Previously?"
		name="similarIncidents"
		options={[
			{ value: 'yes', label: 'Yes' },
			{ value: 'no', label: 'No' },
			{ value: 'unknown', label: 'Unknown' }
		]}
		bind:value={d.similarIncidents}
	/>
	{#if d.similarIncidents === 'yes'}
		<TextInput label="Similar Incidents Details" name="similarIncidentsDetails" bind:value={d.similarIncidentsDetails} />
	{/if}

	<TextAreaInput label="RCA Findings Summary" name="rcaFindingsSummary" rows={4} bind:value={d.rcaFindingsSummary} />
</Fieldset>
