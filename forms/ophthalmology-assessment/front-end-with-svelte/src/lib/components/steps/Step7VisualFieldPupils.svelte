<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const vf = assessment.data.visualFieldPupils;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const eyeOptions = [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'both', label: 'Both' }];
</script>

<Fieldset legend="Visual Field and Pupils">
	<p class="hint">Visual field testing and pupil reactions.</p>

	<Field label="Was a visual field test performed?">
		<RadioGroup label="VF test performed">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vfPerformed" value={opt.value} bind:group={vf.visualFieldTestPerformed} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if vf.visualFieldTestPerformed === 'yes'}
		<Field label="Test type" inputId="vfTestType">
			<Select id="vfTestType" label="VF Test type" bind:value={vf.visualFieldTestType}>
				<option value="">-- Select --</option>
				<option value="confrontation">Confrontation</option>
				<option value="humphrey">Humphrey</option>
				<option value="goldmann">Goldmann</option>
				<option value="octopus">Octopus</option>
			</Select>
		</Field>

		<div class="field-grid">
			<Field label="Right eye result" inputId="vfResultRight">
				<Select id="vfResultRight" label="VF right" bind:value={vf.visualFieldResultRight}>
					<option value="">-- Select --</option>
					<option value="normal">Normal</option>
					<option value="abnormal">Abnormal</option>
				</Select>
			</Field>
			<Field label="Left eye result" inputId="vfResultLeft">
				<Select id="vfResultLeft" label="VF left" bind:value={vf.visualFieldResultLeft}>
					<option value="">-- Select --</option>
					<option value="normal">Normal</option>
					<option value="abnormal">Abnormal</option>
				</Select>
			</Field>
		</div>

		{#if vf.visualFieldResultRight === 'abnormal' || vf.visualFieldResultLeft === 'abnormal'}
			<Field label="Visual field defect details" inputId="vfDetails">
				<TextAreaInput id="vfDetails" label="VF details" rows={2} bind:value={vf.visualFieldDetails} />
			</Field>
		{/if}
	{/if}

	<div class="field-grid">
		<Field label="Right pupil reaction" inputId="pupilRight">
			<Select id="pupilRight" label="Right pupil" bind:value={vf.pupilReactionRight}>
				<option value="">-- Select --</option>
				<option value="normal">Normal</option>
				<option value="sluggish">Sluggish</option>
				<option value="fixed">Fixed</option>
			</Select>
		</Field>
		<Field label="Left pupil reaction" inputId="pupilLeft">
			<Select id="pupilLeft" label="Left pupil" bind:value={vf.pupilReactionLeft}>
				<option value="">-- Select --</option>
				<option value="normal">Normal</option>
				<option value="sluggish">Sluggish</option>
				<option value="fixed">Fixed</option>
			</Select>
		</Field>
	</div>

	<Field label="Is a relative afferent pupillary defect (RAPD) present?">
		<RadioGroup label="RAPD">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="rapd" value={opt.value} bind:group={vf.rapdPresent} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if vf.rapdPresent === 'yes'}
		<Field label="Which eye?">
			<RadioGroup label="RAPD eye">
				{#each eyeOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="rapdEye" value={opt.value} bind:group={vf.rapdEye} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Is colour vision normal?">
		<RadioGroup label="Colour vision">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="colourVision" value={opt.value} bind:group={vf.colourVisionNormal} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if vf.colourVisionNormal === 'no'}
		<Field label="Colour vision test details" inputId="colourDetails">
			<TextAreaInput id="colourDetails" label="Colour vision details" rows={2} bind:value={vf.colourVisionDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
