<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const b = assessment.data.breastHealth;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Breast Health" description="Mammogram history and breast cancer risk assessment">
	<TextInput label="Date of last mammogram" name="lastMammogram" type="date" bind:value={b.lastMammogram} />

	<Select
		label="Mammogram result"
		name="mammogramResult"
		options={[
			{ value: 'normal', label: 'Normal' },
			{ value: 'abnormal', label: 'Abnormal (required follow-up)' },
			{ value: 'not-done', label: 'Not done / Not applicable' }
		]}
		bind:value={b.mammogramResult}
	/>

	<RadioGroup label="Is your most recent breast examination normal?" name="breastExamNormal" options={yesNo} bind:value={b.breastExamNormal} />

	<RadioGroup label="Do you have a family history of breast cancer?" name="familyHistoryBreastCancer" options={yesNo} bind:value={b.familyHistoryBreastCancer} />

	<RadioGroup label="Do you have a family history of ovarian cancer?" name="familyHistoryOvarianCancer" options={yesNo} bind:value={b.familyHistoryOvarianCancer} />

	<Select
		label="BRCA gene testing status"
		name="brcaStatus"
		options={[
			{ value: 'positive', label: 'BRCA positive' },
			{ value: 'negative', label: 'BRCA negative' },
			{ value: 'not-tested', label: 'Not tested' }
		]}
		bind:value={b.brcaStatus}
	/>

	{#if b.brcaStatus === 'positive'}
		<Select
			label="BRCA type"
			name="brcaType"
			options={[
				{ value: 'BRCA1', label: 'BRCA1' },
				{ value: 'BRCA2', label: 'BRCA2' }
			]}
			bind:value={b.brcaType}
		/>
	{/if}
</Fieldset>
