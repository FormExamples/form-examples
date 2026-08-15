<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const fh = assessment.data.familyHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const rows: { key: 'autismFamily' | 'adhdFamily' | 'learningDisabilities' | 'mentalHealthFamily'; label: string; detailsKey: keyof typeof fh }[] = [
		{ key: 'autismFamily', label: 'Family history of autism spectrum disorder?', detailsKey: 'autismFamilyDetails' },
		{ key: 'adhdFamily', label: 'Family history of ADHD?', detailsKey: 'adhdFamilyDetails' },
		{ key: 'learningDisabilities', label: 'Family history of learning disabilities?', detailsKey: 'learningDisabilitiesDetails' },
		{ key: 'mentalHealthFamily', label: 'Family history of mental health conditions?', detailsKey: 'mentalHealthFamilyDetails' }
	];
</script>

<Fieldset legend="Family History">
	<p class="hint">Family history of neurodevelopmental and mental health conditions.</p>

	{#each rows as r (r.key)}
		<Field label={r.label} required>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={fh[r.key]} required /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if fh[r.key] === 'yes'}
			<Field label={`${r.label} details`} inputId={r.detailsKey as string}>
				<TextAreaInput id={r.detailsKey as string} label={`${r.label} details`} rows={2} bind:value={fh[r.detailsKey] as string} />
			</Field>
		{/if}
	{/each}
</Fieldset>
