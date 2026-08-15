<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const h = assessment.data.historyOfPresentIllness;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="History of Present Illness">
	<p class="hint">Onset, course, and character of the current symptoms.</p>

	<Field label="Onset date" inputId="onsetDate">
		<DateInput id="onsetDate" label="Onset date" bind:value={h.onsetDate} />
	</Field>

	<Field label="Onset type" inputId="onsetType">
		<Select id="onsetType" label="Onset type" bind:value={h.onsetType}>
			<option value="">-- Select --</option>
			<option value="sudden">Sudden</option>
			<option value="gradual">Gradual</option>
		</Select>
	</Field>

	<Field label="Progression" inputId="progression">
		<Select id="progression" label="Progression" bind:value={h.progression}>
			<option value="">-- Select --</option>
			<option value="worsening">Worsening</option>
			<option value="stable">Stable</option>
			<option value="improving">Improving</option>
			<option value="fluctuating">Fluctuating</option>
		</Select>
	</Field>

	<Field label="Laterality" inputId="laterality">
		<Select id="laterality" label="Laterality" bind:value={h.laterality}>
			<option value="">-- Select --</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
			<option value="both">Both</option>
		</Select>
	</Field>

	<Field label="Previous similar episodes?">
		<RadioGroup label="Previous similar episodes?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousEpisodes" value={opt.value} bind:group={h.previousEpisodes} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Aggravating factors" inputId="aggravatingFactors">
		<TextAreaInput id="aggravatingFactors" label="Aggravating factors" rows={2} bind:value={h.aggravatingFactors} />
	</Field>

	<Field label="Relieving factors" inputId="relievingFactors">
		<TextAreaInput id="relievingFactors" label="Relieving factors" rows={2} bind:value={h.relievingFactors} />
	</Field>

	<Field label="Associated symptoms" inputId="associatedSymptoms">
		<TextAreaInput id="associatedSymptoms" label="Associated symptoms" rows={2} bind:value={h.associatedSymptoms} />
	</Field>
</Fieldset>
