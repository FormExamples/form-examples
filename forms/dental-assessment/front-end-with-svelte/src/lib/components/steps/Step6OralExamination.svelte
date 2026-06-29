<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const o = assessment.data.oralExamination;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const hygieneOptions = [
		{ value: 'good', label: 'Good' },
		{ value: 'fair', label: 'Fair' },
		{ value: 'poor', label: 'Poor' }
	];
</script>

<Fieldset legend="Oral Examination">
	<p class="hint">Soft tissue, TMJ, and occlusion findings.</p>

	<Field label="Soft tissue findings" inputId="softTissueFindings">
		<TextAreaInput id="softTissueFindings" label="Soft tissue findings" rows={3} bind:value={o.softTissueFindings} />
	</Field>

	<Field label="TMJ pain?">
		<RadioGroup label="TMJ pain">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tmjPain" value={opt.value} bind:group={o.tmjPain} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="TMJ clicking or crepitus?">
		<RadioGroup label="TMJ clicking">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tmjClicking" value={opt.value} bind:group={o.tmjClicking} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Limited jaw opening?">
		<RadioGroup label="Limited jaw opening">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tmjLimitedOpening" value={opt.value} bind:group={o.tmjLimitedOpening} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Occlusion classification" inputId="occlusion">
		<Select id="occlusion" label="Occlusion" bind:value={o.occlusion}>
			<option value="">— Select —</option>
			<option value="class-I">Class I — Normal</option>
			<option value="class-II">Class II — Retrognathic</option>
			<option value="class-III">Class III — Prognathic</option>
		</Select>
	</Field>

	<Field label="Oral hygiene index">
		<RadioGroup label="Oral hygiene index">
			{#each hygieneOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="oralHygieneIndex" value={opt.value} bind:group={o.oralHygieneIndex} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
