<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const cc = assessment.data.comorbidConditions;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const conditions: { key: 'anxiety' | 'depression' | 'substanceUse' | 'sleepDisorders' | 'learningDisabilities' | 'autismSpectrum'; label: string; detailsKey: keyof typeof cc }[] = [
		{ key: 'anxiety', label: 'Anxiety disorder', detailsKey: 'anxietyDetails' },
		{ key: 'depression', label: 'Depression', detailsKey: 'depressionDetails' },
		{ key: 'substanceUse', label: 'Substance use (current or past)', detailsKey: 'substanceUseDetails' },
		{ key: 'sleepDisorders', label: 'Sleep disorders (insomnia, sleep apnoea, etc.)', detailsKey: 'sleepDisordersDetails' },
		{ key: 'learningDisabilities', label: 'Learning disabilities (dyslexia, dyscalculia, etc.)', detailsKey: 'learningDisabilitiesDetails' },
		{ key: 'autismSpectrum', label: 'Autism spectrum disorder', detailsKey: 'autismSpectrumDetails' }
	];
</script>

<Fieldset legend="Comorbid Conditions">
	<p class="hint">ADHD commonly co-occurs with other conditions.</p>

	{#each conditions as c (c.key)}
		<Field label={c.label}>
			<RadioGroup label={c.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={c.key} value={opt.value} bind:group={cc[c.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if cc[c.key] === 'yes'}
			<Field label={`${c.label} details`} inputId={c.detailsKey as string}>
				<TextAreaInput id={c.detailsKey as string} label={`${c.label} details`} rows={2} bind:value={cc[c.detailsKey] as string} />
			</Field>
		{/if}
	{/each}
</Fieldset>
