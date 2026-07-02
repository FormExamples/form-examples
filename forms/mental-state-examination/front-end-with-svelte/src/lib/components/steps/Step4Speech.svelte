<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const s = assessment.data.speech;
</script>

<Fieldset legend="Step 4 of 10 — Speech">
	<p class="hint">ASEPTIC domain S — rate, volume, quantity, and fluency of speech.</p>

	<Field label="Rate" inputId="speech-speechRate">
		<Select id="speech-speechRate" label="Rate" bind:value={s.speechRate}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="slow">Slow</option>
			<option value="rapid">Rapid</option>
			<option value="pressured">Pressured</option>
		</Select>
	</Field>

	<Field label="Volume" inputId="speech-speechVolume">
		<Select id="speech-speechVolume" label="Volume" bind:value={s.speechVolume}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="quiet">Quiet</option>
			<option value="loud">Loud</option>
		</Select>
	</Field>

	<Field label="Quantity" inputId="speech-speechQuantity">
		<Select id="speech-speechQuantity" label="Quantity" bind:value={s.speechQuantity}>
			<option value="">— Select —</option>
			<option value="normal">Normal</option>
			<option value="poverty">Poverty of speech</option>
			<option value="excessive">Excessive</option>
		</Select>
	</Field>

	<Field label="Fluency" inputId="speech-speechFluency">
		<Select id="speech-speechFluency" label="Fluency" bind:value={s.speechFluency}>
			<option value="">— Select —</option>
			<option value="fluent">Fluent</option>
			<option value="hesitant">Hesitant</option>
			<option value="dysarthric">Dysarthric</option>
			<option value="mute">Mute</option>
		</Select>
	</Field>

	<Field label="Notes" inputId="speech-speechNotes">
		<TextAreaInput
			id="speech-speechNotes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes on speech."
			bind:value={s.speechNotes}
		/>
	</Field>
</Fieldset>
