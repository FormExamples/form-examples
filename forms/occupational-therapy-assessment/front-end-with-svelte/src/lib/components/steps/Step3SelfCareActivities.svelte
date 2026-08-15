<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.selfCareActivities;

	const difficultyOptions = [
		{ value: 'none', label: 'No difficulty' },
		{ value: 'some', label: 'Some difficulty' },
		{ value: 'significant', label: 'Significant difficulty' },
		{ value: 'unable', label: 'Unable to perform' }
	];

	const areas = [
		{ key: 'personalCare', label: 'Personal Care', desc: 'Bathing, dressing, grooming, hygiene, feeding' },
		{ key: 'functionalMobility', label: 'Functional Mobility', desc: 'Transfers, indoor/outdoor mobility, stairs, transportation' },
		{ key: 'communityManagement', label: 'Community Management', desc: 'Shopping, finances, transportation, appointments' }
	] as const;
</script>

<Fieldset legend="Self-Care Activities">
	<p class="hint">Assess your ability to perform daily self-care tasks.</p>

	{#each areas as area (area.key)}
		<Field label={area.label} description={area.desc} required>
			<RadioGroup label={`${area.label} difficulty`}>
				{#each difficultyOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={`${area.key}Difficulty`} value={opt.value} bind:group={s[area.key].difficulty} required />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label={`${area.label} details`} inputId={`${area.key}Details`}>
			<TextAreaInput id={`${area.key}Details`} label={`${area.label} details`} rows={2} placeholder="Describe any specific difficulties..." bind:value={s[area.key].details} />
		</Field>
	{/each}
</Fieldset>
