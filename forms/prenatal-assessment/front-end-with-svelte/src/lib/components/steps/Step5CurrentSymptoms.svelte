<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.currentSymptoms;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

	const symptoms: { key: 'nausea' | 'bleeding' | 'headache' | 'visionChanges' | 'edema' | 'abdominalPain' | 'reducedFetalMovement'; label: string }[] = [
		{ key: 'nausea', label: 'Nausea or vomiting' },
		{ key: 'bleeding', label: 'Vaginal bleeding' },
		{ key: 'headache', label: 'Persistent or severe headache' },
		{ key: 'visionChanges', label: 'Vision changes (blurring, flashing lights, spots)' },
		{ key: 'edema', label: 'Swelling / edema (face, hands, or feet)' },
		{ key: 'abdominalPain', label: 'Abdominal pain or cramping' },
		{ key: 'reducedFetalMovement', label: 'Reduced fetal movement' }
	];
</script>

<Fieldset legend="Current Symptoms">
	<p class="hint">Report any symptoms you are currently experiencing.</p>

	{#each symptoms as sym (sym.key)}
		<Field label={sym.label}>
			<RadioGroup label={sym.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={sym.key} value={opt.value} bind:group={s[sym.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
