<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.comorbidities;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];

	const simpleFlags: { key: 'diabetes' | 'osteoporosis' | 'depression'; name: string; label: string }[] = [
		{ key: 'diabetes', name: 'diabetes', label: 'Do you have diabetes?' },
		{ key: 'osteoporosis', name: 'osteo', label: 'Do you have osteoporosis?' },
		{ key: 'depression', name: 'depression', label: 'Do you have depression or anxiety?' }
	];
</script>

<Fieldset legend="Comorbidities">
	<p class="hint">Other medical conditions that may affect your pulmonary care.</p>

	<Field label="Do you have cardiovascular disease (heart disease, hypertension)?">
		<RadioGroup label="Cardiovascular disease">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cvd" value={opt.value} bind:group={c.cardiovascularDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.cardiovascularDisease === 'yes'}
		<Field label="Please provide details" inputId="cvdDetails">
			<TextInput id="cvdDetails" label="Cardiovascular details" bind:value={c.cardiovascularDetails} />
		</Field>
	{/if}

	{#each simpleFlags as f (f.key)}
		<Field label={f.label}>
			<RadioGroup label={f.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={f.name} value={opt.value} bind:group={c[f.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Have you been diagnosed with lung cancer?">
		<RadioGroup label="Lung cancer">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="lungCancer" value={opt.value} bind:group={c.lungCancer} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.lungCancer === 'yes'}
		<Field label="Please provide details (type, stage, treatment)" inputId="cancerDetails">
			<TextInput id="cancerDetails" label="Cancer details" bind:value={c.lungCancerDetails} />
		</Field>
	{/if}

	<Field label="Any other significant medical conditions?" inputId="otherComorbid">
		<TextAreaInput id="otherComorbid" label="Other comorbidities" rows={3} bind:value={c.otherComorbidities} />
	</Field>
</Fieldset>
