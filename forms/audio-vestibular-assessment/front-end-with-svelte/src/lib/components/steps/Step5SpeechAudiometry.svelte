<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const sp = assessment.data.speechAudiometry;
</script>

<Fieldset legend="Speech Audiometry">
	<p class="hint">Speech-reception threshold (SRT) and word-recognition score (WRS), each ear.</p>

	<h3 class="mt-2 text-sm font-semibold text-base-content/80">Right ear</h3>
	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="SRT (dB HL)" inputId="rightSrtDb">
			<NumberInput id="rightSrtDb" label="Right SRT" min={-10} max={120} bind:value={sp.rightSrtDb} />
		</Field>
		<Field label="Word-recognition score (%)" inputId="rightWordRecognitionPercent">
			<NumberInput id="rightWordRecognitionPercent" label="Right word-recognition score" min={0} max={100} bind:value={sp.rightWordRecognitionPercent} />
		</Field>
	</div>

	<h3 class="mt-2 text-sm font-semibold text-base-content/80">Left ear</h3>
	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="SRT (dB HL)" inputId="leftSrtDb">
			<NumberInput id="leftSrtDb" label="Left SRT" min={-10} max={120} bind:value={sp.leftSrtDb} />
		</Field>
		<Field label="Word-recognition score (%)" inputId="leftWordRecognitionPercent">
			<NumberInput id="leftWordRecognitionPercent" label="Left word-recognition score" min={0} max={100} bind:value={sp.leftWordRecognitionPercent} />
		</Field>
	</div>

	<Field label="Speech-audiometry notes" inputId="speechAudiometryNotes">
		<TextAreaInput id="speechAudiometryNotes" label="Speech-audiometry notes" rows={3} placeholder="Test list used, presentation level, masking…" bind:value={sp.speechAudiometryNotes} />
	</Field>
</Fieldset>
