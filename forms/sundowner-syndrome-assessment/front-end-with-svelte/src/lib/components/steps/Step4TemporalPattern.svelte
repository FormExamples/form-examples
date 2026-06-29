<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const t = assessment.data.temporalPattern;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Temporal Pattern">
	<p class="hint">When symptoms typically begin, peak, and resolve.</p>

	<div class="field-grid field-grid-3">
		<Field label="Typical onset time" inputId="typicalOnsetTime">
			<input id="typicalOnsetTime" type="time" class="text-input" aria-label="Typical onset time" bind:value={t.typicalOnsetTime} />
		</Field>
		<Field label="Peak time" inputId="peakTime">
			<input id="peakTime" type="time" class="text-input" aria-label="Peak time" bind:value={t.peakTime} />
		</Field>
		<Field label="Typical offset time" inputId="typicalOffsetTime">
			<input id="typicalOffsetTime" type="time" class="text-input" aria-label="Typical offset time" bind:value={t.typicalOffsetTime} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Episode frequency" inputId="episodeFrequency">
			<Select id="episodeFrequency" label="Episode frequency" bind:value={t.episodeFrequency}>
				<option value="">-- Select --</option>
				<option value="none">None</option>
				<option value="occasional">Occasional</option>
				<option value="frequent">Frequent</option>
				<option value="continuous">Continuous</option>
			</Select>
		</Field>
		<Field label="Average duration (minutes)" inputId="averageDurationMinutes">
			<NumberInput id="averageDurationMinutes" label="Average duration" min={0} max={1440} bind:value={t.averageDurationMinutes} />
		</Field>
	</div>

	<Field label="Symptoms worse at dusk?">
		<RadioGroup label="Symptoms worse at dusk?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="worseAtDusk" value={opt.value} bind:group={t.worseAtDusk} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Symptoms worse seasonally (e.g. winter)?">
		<RadioGroup label="Symptoms worse seasonally?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="worseSeasonally" value={opt.value} bind:group={t.worseSeasonally} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Temporal notes" inputId="temporalNotes">
		<TextAreaInput id="temporalNotes" label="Temporal notes" rows={3} bind:value={t.temporalNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
