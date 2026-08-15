<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const a = assessment.data.anteriorSegment;
	const normalAbnormal = [{ value: 'yes', label: 'Normal' }, { value: 'no', label: 'Abnormal' }];

	const sections = [
		{ key: 'lidsNormal', detailsKey: 'lidsDetails', label: 'Lids' },
		{ key: 'conjunctivaNormal', detailsKey: 'conjunctivaDetails', label: 'Conjunctiva' },
		{ key: 'corneaNormal', detailsKey: 'corneaDetails', label: 'Cornea' },
		{ key: 'anteriorChamberNormal', detailsKey: 'anteriorChamberDetails', label: 'Anterior Chamber' },
		{ key: 'irisNormal', detailsKey: 'irisDetails', label: 'Iris' },
		{ key: 'lensNormal', detailsKey: 'lensDetails', label: 'Lens' }
	] as const;
</script>

<Fieldset legend="Anterior Segment">
	<p class="hint">Slit lamp examination findings.</p>

	{#each sections as section (section.key)}
		<Field label={section.label}>
			<RadioGroup label={section.label}>
				{#each normalAbnormal as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={section.key} value={opt.value} bind:group={a[section.key]} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if a[section.key] === 'no'}
			<Field label={`${section.label} findings`} inputId={section.detailsKey}>
				<TextAreaInput id={section.detailsKey} label={`${section.label} findings`} rows={2} bind:value={a[section.detailsKey]} />
			</Field>
		{/if}
	{/each}

	<Fieldset legend="Intraocular Pressure (IOP)">
		<div class="field-grid">
			<Field label="Right Eye IOP (mmHg)" inputId="iopRight"><NumberInput id="iopRight" label="Right Eye IOP" min={0} max={80} bind:value={a.iopRight} /></Field>
			<Field label="Left Eye IOP (mmHg)" inputId="iopLeft"><NumberInput id="iopLeft" label="Left Eye IOP" min={0} max={80} bind:value={a.iopLeft} /></Field>
		</div>

		<Field label="IOP Measurement Method" inputId="iopMethod">
			<Select id="iopMethod" label="IOP method" bind:value={a.iopMethod}>
				<option value="">-- Select --</option>
				<option value="goldmann">Goldmann applanation</option>
				<option value="tonopen">Tonopen</option>
				<option value="icare">iCare rebound</option>
				<option value="non-contact">Non-contact (air puff)</option>
			</Select>
		</Field>
	</Fieldset>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
