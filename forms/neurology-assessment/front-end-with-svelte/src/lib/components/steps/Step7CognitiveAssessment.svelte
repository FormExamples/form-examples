<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.cognitiveAssessment;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Cognitive Assessment">
	<p class="hint">Orientation, attention, memory, language, and executive function.</p>

	<Field label="Orientation" inputId="orientation">
		<Select id="orientation" label="Orientation" bind:value={c.orientation}>
			<option value="">-- Select --</option>
			<option value="fully-oriented">Fully oriented (person, place, time)</option>
			<option value="partially-oriented">Partially oriented</option>
			<option value="disoriented">Disoriented</option>
		</Select>
	</Field>

	<Field label="Attention normal?">
		<RadioGroup label="Attention">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="attention" value={opt.value} bind:group={c.attentionNormal} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Short-term memory intact?">
		<RadioGroup label="Short-term memory">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="stm" value={opt.value} bind:group={c.memoryShortTerm} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Long-term memory intact?">
		<RadioGroup label="Long-term memory">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ltm" value={opt.value} bind:group={c.memoryLongTerm} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Language function normal?">
		<RadioGroup label="Language">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="languageNormal" value={opt.value} bind:group={c.languageNormal} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.languageNormal === 'no'}
		<Field label="Language deficit details" inputId="languageDetails">
			<TextAreaInput id="languageDetails" label="Language details" rows={2} placeholder="e.g., word-finding difficulty, comprehension issues" bind:value={c.languageDetails} />
		</Field>
	{/if}

	<Field label="Visuospatial function normal?">
		<RadioGroup label="Visuospatial">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="visuospatial" value={opt.value} bind:group={c.visuospatialNormal} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Executive function normal?">
		<RadioGroup label="Executive function">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="executive" value={opt.value} bind:group={c.executiveFunctionNormal} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="MMSE Score (if performed)" inputId="mmse">
		<NumberInput id="mmse" label="MMSE" min={0} max={30} bind:value={c.mmseScore} />
	</Field>
</Fieldset>
