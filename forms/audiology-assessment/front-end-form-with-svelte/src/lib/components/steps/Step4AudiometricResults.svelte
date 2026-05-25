<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const a = assessment.data.audiometricResults;
</script>

<Fieldset legend="Audiometric Results">
	<p class="hint">Pure tone audiometry, speech audiometry, and conduction thresholds.</p>

	<h3 class="step-subhead">Pure Tone Averages (PTA)</h3>
	<div class="field-grid">
		<Field label="PTA Right Ear (dB HL)" inputId="ptaRight">
			<NumberInput id="ptaRight" label="PTA Right" min={0} max={120} bind:value={a.pureToneAverageRight} />
		</Field>
		<Field label="PTA Left Ear (dB HL)" inputId="ptaLeft">
			<NumberInput id="ptaLeft" label="PTA Left" min={0} max={120} bind:value={a.pureToneAverageLeft} />
		</Field>
	</div>

	<h3 class="step-subhead">Air Conduction Thresholds</h3>
	<div class="field-grid">
		<Field label="Air Conduction Right" inputId="airCondRight" description="frequency:dB pairs">
			<TextInput id="airCondRight" label="Air Conduction Right" bind:value={a.airConductionRight} />
		</Field>
		<Field label="Air Conduction Left" inputId="airCondLeft" description="frequency:dB pairs">
			<TextInput id="airCondLeft" label="Air Conduction Left" bind:value={a.airConductionLeft} />
		</Field>
	</div>

	<h3 class="step-subhead">Bone Conduction Thresholds</h3>
	<div class="field-grid">
		<Field label="Bone Conduction Right" inputId="boneCondRight">
			<TextInput id="boneCondRight" label="Bone Conduction Right" bind:value={a.boneConductionRight} />
		</Field>
		<Field label="Bone Conduction Left" inputId="boneCondLeft">
			<TextInput id="boneCondLeft" label="Bone Conduction Left" bind:value={a.boneConductionLeft} />
		</Field>
	</div>

	<h3 class="step-subhead">Air-Bone Gap</h3>
	<div class="field-grid">
		<Field label="Air-Bone Gap Right (dB)" inputId="abgRight">
			<NumberInput id="abgRight" label="Air-Bone Gap Right" min={0} max={80} bind:value={a.airBoneGapRight} />
		</Field>
		<Field label="Air-Bone Gap Left (dB)" inputId="abgLeft">
			<NumberInput id="abgLeft" label="Air-Bone Gap Left" min={0} max={80} bind:value={a.airBoneGapLeft} />
		</Field>
	</div>

	<h3 class="step-subhead">Speech Audiometry</h3>
	<div class="field-grid">
		<Field label="Speech Recognition Threshold Right (dB HL)" inputId="srtRight">
			<NumberInput id="srtRight" label="SRT Right" min={0} max={120} bind:value={a.speechRecognitionThresholdRight} />
		</Field>
		<Field label="Speech Recognition Threshold Left (dB HL)" inputId="srtLeft">
			<NumberInput id="srtLeft" label="SRT Left" min={0} max={120} bind:value={a.speechRecognitionThresholdLeft} />
		</Field>
	</div>
	<div class="field-grid">
		<Field label="Word Recognition Score Right (%)" inputId="wrsRight">
			<NumberInput id="wrsRight" label="WRS Right" min={0} max={100} bind:value={a.wordRecognitionScoreRight} />
		</Field>
		<Field label="Word Recognition Score Left (%)" inputId="wrsLeft">
			<NumberInput id="wrsLeft" label="WRS Left" min={0} max={100} bind:value={a.wordRecognitionScoreLeft} />
		</Field>
	</div>

	<Field label="Type of Hearing Loss" inputId="hearingLossType">
		<Select id="hearingLossType" label="Hearing loss type" bind:value={a.hearingLossType}>
			<option value="">— Select —</option>
			<option value="conductive">Conductive</option>
			<option value="sensorineural">Sensorineural</option>
			<option value="mixed">Mixed</option>
		</Select>
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
	.step-subhead { font-size: 1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
</style>
