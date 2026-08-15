<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import ComplicationEntry from '#lib/components/ui/ComplicationEntry.svelte';

	const d = assessment.data.complicationsAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Complications Assessment (Clavien-Dindo)">
	<p class="hint">
		Record each complication with its Clavien-Dindo grade. The overall grade reflects the worst
		single complication.
	</p>

	<Field label="Did any complications occur?">
		<RadioGroup label="Did any complications occur?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="complicationsOccurred" value={opt.value} bind:group={d.complicationsOccurred} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.complicationsOccurred === 'yes'}
		<Field label="Complications" description="Add one row per complication. Grade each by the intervention required.">
			<ComplicationEntry bind:complications={d.complications} />
		</Field>
	{/if}

	<Field label="Narrative summary" inputId="narrative">
		<TextAreaInput id="narrative" label="Narrative summary" rows={3} placeholder="Free-text narrative summary of any deviation from the expected post-operative course." bind:value={d.narrative} />
	</Field>
</Fieldset>
