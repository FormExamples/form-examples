<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const p = assessment.data.posteriorSegment;
	const normalAbnormal = [{ value: 'yes', label: 'Normal' }, { value: 'no', label: 'Abnormal' }];

	const sections = [
		{ key: 'fundusNormal', detailsKey: 'fundusDetails', label: 'Fundus' },
		{ key: 'opticDiscNormal', detailsKey: 'opticDiscDetails', label: 'Optic Disc' }
	] as const;

	const lateSections = [
		{ key: 'maculaNormal', detailsKey: 'maculaDetails', label: 'Macula' },
		{ key: 'retinalVesselsNormal', detailsKey: 'retinalVesselsDetails', label: 'Retinal Vessels' },
		{ key: 'vitreousNormal', detailsKey: 'vitreousDetails', label: 'Vitreous' }
	] as const;
</script>

<Fieldset legend="Posterior Segment">
	<p class="hint">Fundus examination findings.</p>

	{#each sections as section (section.key)}
		<Field label={section.label}>
			<RadioGroup label={section.label}>
				{#each normalAbnormal as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={section.key} value={opt.value} bind:group={p[section.key]} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if p[section.key] === 'no'}
			<Field label={`${section.label} findings`} inputId={section.detailsKey}>
				<TextAreaInput id={section.detailsKey} label={`${section.label} findings`} rows={2} bind:value={p[section.detailsKey]} />
			</Field>
		{/if}
	{/each}

	<div class="field-grid">
		<Field label="Right Eye Cup-to-Disc Ratio" inputId="cdrRight"><TextInput id="cdrRight" label="C/D Right" placeholder="e.g. 0.3" bind:value={p.cupToDiscRatioRight} /></Field>
		<Field label="Left Eye Cup-to-Disc Ratio" inputId="cdrLeft"><TextInput id="cdrLeft" label="C/D Left" placeholder="e.g. 0.3" bind:value={p.cupToDiscRatioLeft} /></Field>
	</div>

	{#each lateSections as section (section.key)}
		<Field label={section.label}>
			<RadioGroup label={section.label}>
				{#each normalAbnormal as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={section.key} value={opt.value} bind:group={p[section.key]} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if p[section.key] === 'no'}
			<Field label={`${section.label} findings`} inputId={section.detailsKey}>
				<TextAreaInput id={section.detailsKey} label={`${section.label} findings`} rows={2} bind:value={p[section.detailsKey]} />
			</Field>
		{/if}
	{/each}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
