<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateEHP30Total, ehp30Label } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const q = assessment.data.qualityOfLife;

	const ehp30 = $derived(
		calculateEHP30Total(
			q.painDomainScore,
			q.controlPowerlessnessScore,
			q.emotionalWellbeingScore,
			q.socialSupportScore,
			q.selfImageScore
		)
	);

	const impact = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];

	const domains: { key: keyof typeof q; label: string }[] = [
		{ key: 'painDomainScore', label: 'EHP-30 Pain domain (0-100)' },
		{ key: 'controlPowerlessnessScore', label: 'EHP-30 Control & powerlessness (0-100)' },
		{ key: 'emotionalWellbeingScore', label: 'EHP-30 Emotional wellbeing (0-100)' },
		{ key: 'socialSupportScore', label: 'EHP-30 Social support (0-100)' },
		{ key: 'selfImageScore', label: 'EHP-30 Self-image (0-100)' }
	];
</script>

<Fieldset legend="Quality of Life Impact">
	<p class="hint">
		EHP-30 domain scores (0 = no impact, 100 = maximum impact) and impact on daily life.
	</p>

	{#each domains as dom (dom.key)}
		<Field label={dom.label} inputId={dom.key}>
			<NumberInput id={dom.key} label={dom.label} min={0} max={100} bind:value={q[dom.key] as number | null} />
		</Field>
	{/each}

	<Field label="EHP-30 overall" description="Auto-calculated (mean of completed domains)">
		{#if ehp30 !== null}
			<p class="ehp-value">{ehp30} <span class="ehp-cat">({ehp30Label(ehp30)})</span></p>
		{:else}
			<p class="ehp-value ehp-empty">— (needs at least 3 domains)</p>
		{/if}
	</Field>

	<Field label="Work impact" inputId="workImpact">
		<Select id="workImpact" label="Work impact" bind:value={q.workImpact}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
			<option value="unable-to-work">Unable to work</option>
		</Select>
	</Field>

	<Field label="Relationship impact" inputId="relationshipImpact">
		<Select id="relationshipImpact" label="Relationship impact" bind:value={q.relationshipImpact}>
			<option value="">-- Select --</option>
			{#each impact as i (i.value)}<option value={i.value}>{i.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Sleep impact" inputId="sleepImpact">
		<Select id="sleepImpact" label="Sleep impact" bind:value={q.sleepImpact}>
			<option value="">-- Select --</option>
			{#each impact as i (i.value)}<option value={i.value}>{i.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Mental health impact" inputId="mentalHealthImpact">
		<Select id="mentalHealthImpact" label="Mental health impact" bind:value={q.mentalHealthImpact}>
			<option value="">-- Select --</option>
			{#each impact as i (i.value)}<option value={i.value}>{i.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Exercise impact" inputId="exerciseImpact">
		<Select id="exerciseImpact" label="Exercise impact" bind:value={q.exerciseImpact}>
			<option value="">-- Select --</option>
			{#each impact as i (i.value)}<option value={i.value}>{i.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Quality of life notes" inputId="qolNotes">
		<TextAreaInput id="qolNotes" label="Quality of life notes" rows={2} bind:value={q.qolNotes} />
	</Field>
</Fieldset>

<style>
	.ehp-value {
		margin: 0;
		font-weight: 500;
	}
	.ehp-cat {
		color: var(--color-muted);
		font-weight: 400;
	}
	.ehp-empty {
		color: var(--color-muted);
	}
</style>
