<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const mh = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const rows: { key: 'cardiovascularIssues' | 'seizureHistory' | 'ticDisorder' | 'thyroidDisease' | 'headInjuries'; label: string; detailsKey: keyof typeof mh; required?: boolean }[] = [
		{ key: 'cardiovascularIssues', label: 'Any cardiovascular issues? (hypertension, heart defects, arrhythmia, chest pain)', detailsKey: 'cardiovascularDetails', required: true },
		{ key: 'seizureHistory', label: 'Seizure history?', detailsKey: 'seizureDetails', required: true },
		{ key: 'ticDisorder', label: 'Tic disorder (motor or vocal tics, Tourette syndrome)?', detailsKey: 'ticDetails', required: true },
		{ key: 'thyroidDisease', label: 'Thyroid disease?', detailsKey: 'thyroidDetails' },
		{ key: 'headInjuries', label: 'Head injuries or traumatic brain injury?', detailsKey: 'headInjuryDetails' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Important medical conditions that may affect ADHD treatment, especially cardiovascular screening for stimulant safety.</p>

	{#each rows as r (r.key)}
		<Field label={r.label} required={r.required}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={mh[r.key]} required={r.required} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if mh[r.key] === 'yes'}
			<Field label={`${r.label} details`} inputId={r.detailsKey as string}>
				<TextAreaInput id={r.detailsKey as string} label={`${r.label} details`} rows={2} bind:value={mh[r.detailsKey] as string} />
			</Field>
		{/if}
	{/each}
</Fieldset>
