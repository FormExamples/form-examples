<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { bristolStoolDescription } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const l = assessment.data.lowerGISymptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Lower GI Symptoms">
	<p class="hint">Symptoms affecting the bowel and rectum.</p>

	<Field label="Have you noticed a change in your bowel habit?">
		<RadioGroup label="Bowel habit change">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bowelChange" value={opt.value} bind:group={l.bowelHabitChange} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if l.bowelHabitChange === 'yes'}
		<Field label="Please describe the change" inputId="bowelDetails">
			<TextAreaInput id="bowelDetails" label="Bowel habit details" rows={3} bind:value={l.bowelHabitDetails} />
		</Field>
	{/if}

	<Field label="Do you have diarrhoea?">
		<RadioGroup label="Diarrhoea">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diarrhoea" value={opt.value} bind:group={l.diarrhoea} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if l.diarrhoea === 'yes'}
		<Field label="How often?" inputId="diarrhoeaFrequency">
			<TextInput id="diarrhoeaFrequency" label="Diarrhoea frequency" placeholder="e.g. 5 times per day" bind:value={l.diarrhoeaFrequency} />
		</Field>
	{/if}

	<Field label="Do you have constipation?">
		<RadioGroup label="Constipation">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="constipation" value={opt.value} bind:group={l.constipation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if l.constipation === 'yes'}
		<Field label="Please describe" inputId="constipationDetails">
			<TextInput id="constipationDetails" label="Constipation details" placeholder="e.g. once per week" bind:value={l.constipationDetails} />
		</Field>
	{/if}

	<Field label="Have you noticed any rectal bleeding?">
		<RadioGroup label="Rectal bleeding">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="rectalBleeding" value={opt.value} bind:group={l.rectalBleeding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if l.rectalBleeding === 'yes'}
		<Field label="Describe the bleeding (colour, amount, frequency)" inputId="bleedingDetails">
			<TextAreaInput id="bleedingDetails" label="Rectal bleeding details" rows={3} bind:value={l.rectalBleedingDetails} />
		</Field>
	{/if}

	<Field label="Do you have a feeling of incomplete evacuation (tenesmus)?">
		<RadioGroup label="Tenesmus">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tenesmus" value={opt.value} bind:group={l.tenesmus} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Bristol Stool Scale - What best describes your usual stool?" description={l.bristolStoolType ? bristolStoolDescription(l.bristolStoolType) : undefined} inputId="bristolStool">
		<Select id="bristolStool" label="Bristol Stool Scale" bind:value={l.bristolStoolType}>
			<option value="">-- Select --</option>
			<option value="1">Type 1 - Separate hard lumps</option>
			<option value="2">Type 2 - Lumpy, sausage-shaped</option>
			<option value="3">Type 3 - Sausage with cracks</option>
			<option value="4">Type 4 - Smooth, soft sausage</option>
			<option value="5">Type 5 - Soft blobs with clear edges</option>
			<option value="6">Type 6 - Fluffy, mushy pieces</option>
			<option value="7">Type 7 - Entirely liquid</option>
		</Select>
	</Field>
</Fieldset>
