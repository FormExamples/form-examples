<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const f = assessment.data.familyHistory;
	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Family History">
	<p class="hint">First-degree relatives. Mark "Unknown" if uncertain.</p>

	<Field label="Sudden cardiac death in a relative under 50?">
		<RadioGroup label="Sudden cardiac death in a relative under 50?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="scd" value={opt.value} bind:group={f.suddenCardiacDeathUnder50} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.suddenCardiacDeathUnder50 === 'yes'}
		<Field label="Relationship to affected relative" inputId="scdRelation">
			<TextInput id="scdRelation" label="Relationship" placeholder="e.g. Father, Sister" bind:value={f.suddenCardiacDeathRelation} />
		</Field>
	{/if}

	<Field label="Hypertrophic cardiomyopathy?">
		<RadioGroup label="Hypertrophic cardiomyopathy?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hcm" value={opt.value} bind:group={f.hypertrophicCardiomyopathy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Marfan syndrome?">
		<RadioGroup label="Marfan syndrome?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="marfan" value={opt.value} bind:group={f.marfanSyndrome} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Long-QT syndrome?">
		<RadioGroup label="Long-QT syndrome?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="lqts" value={opt.value} bind:group={f.longQTSyndrome} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Arrhythmia or pacemaker?">
		<RadioGroup label="Arrhythmia or pacemaker?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="arrhythmia" value={opt.value} bind:group={f.arrhythmiaOrPacemaker} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Unexplained seizure or fainting?">
		<RadioGroup label="Unexplained seizure or fainting?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="seizureFaint" value={opt.value} bind:group={f.unexplainedSeizureOrFainting} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
