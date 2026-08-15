<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.comorbidities;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type CKey =
		| 'allergicRhinitis'
		| 'sinusitis'
		| 'nasalPolyps'
		| 'gord'
		| 'obesity'
		| 'anxiety'
		| 'depression'
		| 'eczema'
		| 'sleepApnoea'
		| 'vocalCordDysfunction';

	const rows: { key: CKey; label: string }[] = [
		{ key: 'allergicRhinitis', label: 'Do you have allergic rhinitis (hay fever)?' },
		{ key: 'sinusitis', label: 'Do you have sinusitis?' },
		{ key: 'nasalPolyps', label: 'Do you have nasal polyps?' },
		{ key: 'gord', label: 'Do you have GORD (gastro-oesophageal reflux disease)?' },
		{ key: 'obesity', label: 'Do you have obesity?' },
		{ key: 'anxiety', label: 'Do you have anxiety?' },
		{ key: 'depression', label: 'Do you have depression?' },
		{ key: 'eczema', label: 'Do you have eczema (atopic dermatitis)?' },
		{ key: 'sleepApnoea', label: 'Do you have sleep apnoea?' },
		{ key: 'vocalCordDysfunction', label: 'Do you have vocal cord dysfunction?' }
	];
</script>

<Fieldset legend="Comorbidities">
	<p class="hint">Other conditions that may affect your asthma.</p>

	{#each rows as r (r.key)}
		<Field label={r.label}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={c[r.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Other comorbidities" inputId="otherComorbidities">
		<TextAreaInput id="otherComorbidities" label="Other comorbidities" rows={3} bind:value={c.otherComorbidities} />
	</Field>
</Fieldset>
