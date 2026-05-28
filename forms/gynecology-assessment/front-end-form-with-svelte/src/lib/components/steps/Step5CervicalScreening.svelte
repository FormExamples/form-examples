<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const cs = assessment.data.cervicalScreening;
</script>

<Fieldset title="Cervical Screening" description="Cervical smear and HPV vaccination history">
	<TextInput
		label="Date of Last Cervical Smear"
		name="lastSmearDate"
		type="date"
		bind:value={cs.lastSmearDate}
	/>

	<Select
		label="Last Smear Result"
		name="lastSmearResult"
		options={[
			{ value: 'normal', label: 'Normal' },
			{ value: 'abnormal', label: 'Abnormal' },
			{ value: 'inadequate', label: 'Inadequate sample' },
			{ value: 'awaiting', label: 'Awaiting results' },
			{ value: 'unknown', label: 'Unknown / Not sure' }
		]}
		bind:value={cs.lastSmearResult}
	/>

	<Select
		label="HPV Vaccination Status"
		name="hpvVaccination"
		options={[
			{ value: 'complete', label: 'Fully vaccinated' },
			{ value: 'partial', label: 'Partially vaccinated' },
			{ value: 'none', label: 'Not vaccinated' },
			{ value: 'unknown', label: 'Unknown / Not sure' }
		]}
		bind:value={cs.hpvVaccination}
	/>
</Fieldset>
