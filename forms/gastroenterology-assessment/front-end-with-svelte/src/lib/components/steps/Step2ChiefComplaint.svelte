<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.chiefComplaint;
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">Primary reason for gastroenterology referral.</p>

	<Field label="What is your primary GI symptom?" inputId="primarySymptom">
		<TextAreaInput id="primarySymptom" label="Primary symptom" rows={3} placeholder="Describe your main symptom..." bind:value={c.primarySymptom} />
	</Field>

	<Field label="Where is the symptom located?" inputId="symptomLocation">
		<Select id="symptomLocation" label="Symptom location" bind:value={c.symptomLocation}>
			<option value="">-- Select --</option>
			<option value="epigastric">Epigastric (upper centre)</option>
			<option value="right-upper-quadrant">Right upper quadrant</option>
			<option value="left-upper-quadrant">Left upper quadrant</option>
			<option value="periumbilical">Periumbilical (around navel)</option>
			<option value="right-lower-quadrant">Right lower quadrant</option>
			<option value="left-lower-quadrant">Left lower quadrant</option>
			<option value="suprapubic">Suprapubic (lower centre)</option>
			<option value="diffuse">Diffuse (all over)</option>
		</Select>
	</Field>

	<Field label="When did the symptom start?" inputId="symptomOnset">
		<TextInput id="symptomOnset" label="Symptom onset" placeholder="e.g. 3 months ago" bind:value={c.symptomOnset} />
	</Field>

	<Field label="How long does it last?" inputId="symptomDuration">
		<TextInput id="symptomDuration" label="Symptom duration" placeholder="e.g. constant, minutes, hours" bind:value={c.symptomDuration} />
	</Field>

	<Field label="How severe is your symptom on a scale of 0-10?" description="0 = no symptoms, 10 = worst imaginable" inputId="severityScore">
		<NumberInput id="severityScore" label="Severity score" min={0} max={10} step={1} bind:value={c.severityScore} />
	</Field>
</Fieldset>
