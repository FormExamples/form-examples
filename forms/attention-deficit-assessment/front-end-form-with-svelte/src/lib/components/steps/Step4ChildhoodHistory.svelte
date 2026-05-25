<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const ch = assessment.data.childhoodHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Childhood History">
	<p class="hint">ADHD must have symptoms present before age 12 (DSM-5 criterion B).</p>

	<Field label="Did you experience symptoms of inattention, hyperactivity, or impulsivity as a child?" required>
		<RadioGroup label="Childhood symptoms">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="childhoodSymptoms" value={opt.value} bind:group={ch.childhoodSymptoms} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if ch.childhoodSymptoms === 'yes'}
		<Field label="Describe your childhood symptoms" inputId="childhoodSymptomsDetails">
			<TextAreaInput id="childhoodSymptomsDetails" label="Childhood symptoms details" rows={3} bind:value={ch.childhoodSymptomsDetails} />
		</Field>
	{/if}

	<Field label="How would you describe your overall school performance?" inputId="schoolPerformance">
		<Select id="schoolPerformance" label="School performance" bind:value={ch.schoolPerformance}>
			<option value="">— Select —</option>
			<option value="above-average">Above average</option>
			<option value="average">Average</option>
			<option value="below-average">Below average</option>
			<option value="failing">Failing / significant difficulties</option>
		</Select>
	</Field>

	<Field label="Were there any behavioural reports from teachers or school?">
		<RadioGroup label="Behavioural reports">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="behaviouralReports" value={opt.value} bind:group={ch.behaviouralReports} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if ch.behaviouralReports === 'yes'}
		<Field label="Describe the behavioural reports" inputId="behaviouralReportsDetails">
			<TextAreaInput id="behaviouralReportsDetails" label="Behavioural reports details" rows={3} bind:value={ch.behaviouralReportsDetails} />
		</Field>
	{/if}

	<Field label="Did these symptoms begin before age 12?" required>
		<RadioGroup label="Onset before age 12">
			<label><input type="radio" class="radio-input" name="onsetBeforeAge12" value="yes" bind:group={ch.onsetBeforeAge12} required /> Yes</label>
			<label><input type="radio" class="radio-input" name="onsetBeforeAge12" value="no" bind:group={ch.onsetBeforeAge12} required /> No / Unsure</label>
		</RadioGroup>
	</Field>
</Fieldset>
