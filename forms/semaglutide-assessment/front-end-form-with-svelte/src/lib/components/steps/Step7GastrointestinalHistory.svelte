<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const gi = assessment.data.gastrointestinalHistory;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const questions: { key: keyof typeof gi; label: string }[] = [
		{ key: 'nauseaHistory', label: 'History of nausea' },
		{ key: 'vomitingHistory', label: 'History of vomiting' },
		{ key: 'gastroparesis', label: 'Gastroparesis (delayed gastric emptying)' },
		{ key: 'gallstoneHistory', label: 'History of gallstones (cholelithiasis)' },
		{ key: 'ibd', label: 'Inflammatory bowel disease (IBD)' },
		{ key: 'gerdHistory', label: 'Gastro-oesophageal reflux disease (GERD)' },
		{ key: 'previousBariatricSurgery', label: 'Previous bariatric surgery' }
	];
</script>

<Fieldset legend="Gastrointestinal History">
	<p class="hint">GI conditions relevant to semaglutide tolerability and safety.</p>

	{#each questions as q (q.key)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNoOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.key} value={opt.value} bind:group={gi[q.key]} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Current GI Symptoms" inputId="currentGISymptoms">
		<TextAreaInput id="currentGISymptoms" label="Current GI symptoms" placeholder="Describe any current gastrointestinal symptoms..." bind:value={gi.currentGISymptoms} />
	</Field>
</Fieldset>
