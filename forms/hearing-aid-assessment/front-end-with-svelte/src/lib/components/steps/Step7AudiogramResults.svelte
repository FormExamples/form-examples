<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const a = assessment.data.audiogramResults;
</script>

<Fieldset legend="Audiogram Results">
	<p class="hint">Enter audiometric test results.</p>

	<h3 class="subhead">Pure Tone Average (PTA)</h3>
	<div class="field-grid">
		<Field label="Left ear PTA (dB HL)" inputId="leftPTA"><NumberInput id="leftPTA" label="Left PTA" min={-10} max={120} step={1} bind:value={a.leftPTA} /></Field>
		<Field label="Right ear PTA (dB HL)" inputId="rightPTA"><NumberInput id="rightPTA" label="Right PTA" min={-10} max={120} step={1} bind:value={a.rightPTA} /></Field>
	</div>

	<h3 class="subhead">Speech Reception Threshold (SRT)</h3>
	<div class="field-grid">
		<Field label="Left ear SRT (dB HL)" inputId="leftSRT"><NumberInput id="leftSRT" label="Left SRT" min={-10} max={120} step={1} bind:value={a.leftSRT} /></Field>
		<Field label="Right ear SRT (dB HL)" inputId="rightSRT"><NumberInput id="rightSRT" label="Right SRT" min={-10} max={120} step={1} bind:value={a.rightSRT} /></Field>
	</div>

	<h3 class="subhead">Word Recognition Score</h3>
	<div class="field-grid">
		<Field label="Left ear word recognition (%)" inputId="leftWordRecognition"><NumberInput id="leftWordRecognition" label="Left word recognition" min={0} max={100} step={1} bind:value={a.leftWordRecognition} /></Field>
		<Field label="Right ear word recognition (%)" inputId="rightWordRecognition"><NumberInput id="rightWordRecognition" label="Right word recognition" min={0} max={100} step={1} bind:value={a.rightWordRecognition} /></Field>
	</div>

	<Field label="Type of hearing loss" required inputId="hearingLossType">
		<Select id="hearingLossType" label="Hearing loss type" required bind:value={a.hearingLossType}>
			<option value="">-- Select --</option>
			<option value="sensorineural">Sensorineural</option>
			<option value="conductive">Conductive</option>
			<option value="mixed">Mixed</option>
			<option value="unknown">Unknown / Not yet determined</option>
		</Select>
	</Field>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
	.subhead { font-size: 0.875rem; font-weight: 600; color: var(--color-text); margin: 1rem 0 0.5rem; }
</style>
