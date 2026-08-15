<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const adj = assessment.data.adjustments;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Workplace adjustments and restrictions">
	<p class="hint">
		Tick each adjustment that applies. The most severe adjustment sets the overall
		restriction priority (routine → standard → restricted → high-risk).
	</p>

	<div class="space-y-2">
		<label class="flex items-center gap-2"><CheckboxInput label="Altered hours" bind:checked={adj.alteredHours} /> Altered hours</label>
		<label class="flex items-center gap-2"><CheckboxInput label="Amended duties" bind:checked={adj.amendedDuties} /> Amended duties</label>
		<label class="flex items-center gap-2"><CheckboxInput label="Workplace adaptations" bind:checked={adj.workplaceAdaptations} /> Workplace adaptations</label>
		<label class="flex items-center gap-2"><CheckboxInput label="No heavy lifting" bind:checked={adj.noHeavyLifting} /> No heavy lifting</label>
		<label class="flex items-center gap-2"><CheckboxInput label="No driving" bind:checked={adj.noDriving} /> No driving</label>
		<label class="flex items-center gap-2"><CheckboxInput label="No operating machinery" bind:checked={adj.noOperatingMachinery} /> No operating machinery</label>
		<label class="flex items-center gap-2"><CheckboxInput label="No working at height" bind:checked={adj.noWorkingAtHeight} /> No working at height</label>
		<label class="flex items-center gap-2"><CheckboxInput label="No lone working" bind:checked={adj.noLoneWorking} /> No lone working</label>
		<label class="flex items-center gap-2"><CheckboxInput label="No night shifts" bind:checked={adj.noNightShifts} /> No night shifts</label>
		<label class="flex items-center gap-2"><CheckboxInput label="No patient contact" bind:checked={adj.noPatientContact} /> No patient contact</label>
		<label class="flex items-center gap-2"><CheckboxInput label="Sedentary duties only" bind:checked={adj.sedentaryOnly} /> Sedentary duties only</label>
	</div>

	{#if adj.noHeavyLifting}
		<Field label="Lifting limit (kg)" inputId="liftingKgLimit">
			<NumberInput id="liftingKgLimit" label="Lifting limit (kg)" min={0} max={50} bind:value={adj.liftingKgLimit} />
		</Field>
	{/if}

	<Field label="No exposure to (allergen / chemical / temperature extreme)" inputId="noExposure">
		<TextInput id="noExposure" label="No exposure to" bind:value={adj.noExposure} />
	</Field>

	<Field label="Screen-break frequency" inputId="screenBreakFrequency">
		<TextInput id="screenBreakFrequency" label="Screen-break frequency" placeholder="e.g. 5 min every 30 min" bind:value={adj.screenBreakFrequency} />
	</Field>

	<Field label="Is a workstation / workplace review required?">
		<RadioGroup label="Is a workstation / workplace review required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="workstationReviewRequired" value={opt.value} bind:group={adj.workstationReviewRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Additional adjustments" inputId="additionalAdjustments">
		<TextAreaInput id="additionalAdjustments" label="Additional adjustments" rows={2} bind:value={adj.additionalAdjustments} />
	</Field>
</Fieldset>
