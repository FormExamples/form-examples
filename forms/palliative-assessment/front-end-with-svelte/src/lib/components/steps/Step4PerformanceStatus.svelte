<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.performanceStatus;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Performance Status">
	<p class="hint">
		Record performance status using PPS (Palliative Performance Scale, 0-100), AKPS (0-100), and/or
		ECOG (0-5). Lower PPS / AKPS and higher ECOG indicate poorer function.
	</p>

	<div class="field-grid field-grid-3">
		<Field label="PPS score (0-100)" inputId="ppsScore">
			<NumberInput id="ppsScore" label="PPS score" min={0} max={100} step={10} bind:value={d.ppsScore} />
		</Field>
		<Field label="AKPS score (0-100)" inputId="akpsScore">
			<NumberInput id="akpsScore" label="AKPS score" min={0} max={100} step={10} bind:value={d.akpsScore} />
		</Field>
		<Field label="ECOG score (0-5)" inputId="ecogScore">
			<NumberInput id="ecogScore" label="ECOG score" min={0} max={5} step={1} bind:value={d.ecogScore} />
		</Field>
	</div>

	<Field label="Activity level" inputId="activityLevel">
		<TextInput id="activityLevel" label="Activity level" placeholder="e.g. Up and about >50% of waking hours" bind:value={d.activityLevel} />
	</Field>

	<Field label="Mobility notes" inputId="mobilityNotes">
		<TextAreaInput id="mobilityNotes" label="Mobility notes" rows={2} bind:value={d.mobilityNotes} />
	</Field>

	<Field label="Is the patient bed-bound?">
		<RadioGroup label="Is the patient bed-bound?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bedBound" value={opt.value} bind:group={d.bedBound} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Requires assistance with activities of daily living?">
		<RadioGroup label="Requires assistance with ADLs?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="requiresAssistanceWithAdls" value={opt.value} bind:group={d.requiresAssistanceWithAdls} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="ADL notes" inputId="adlNotes">
		<TextAreaInput id="adlNotes" label="ADL notes" rows={2} bind:value={d.adlNotes} />
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
