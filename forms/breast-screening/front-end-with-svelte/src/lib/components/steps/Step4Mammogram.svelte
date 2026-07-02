<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const m = assessment.data.mammogram;
</script>

<Fieldset legend="Step 4 of 7 — Mammogram">
	<p class="hint">Views taken and the adequacy of the images.</p>

	<Field label="Views taken" required inputId="mammogram-viewsTaken">
		<Select id="mammogram-viewsTaken" label="Views taken" required bind:value={m.viewsTaken}>
			<option value="">— Select —</option>
			<option value="standard-four-view">Standard four-view</option>
			<option value="additional-views">Additional views</option>
			<option value="unable-to-image">Unable to image</option>
		</Select>
	</Field>

	<Field
		label="Image adequacy"
		description="An inadequate image raises the technical-repeat flag."
		required
		inputId="mammogram-imageAdequacy"
	>
		<Select id="mammogram-imageAdequacy" label="Image adequacy" required bind:value={m.imageAdequacy}>
			<option value="">— Select —</option>
			<option value="adequate">Adequate</option>
			<option value="inadequate">Inadequate</option>
		</Select>
	</Field>
</Fieldset>
