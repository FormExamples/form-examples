<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const a = assessment.data.abdominalPainAssessment;

	const frequencyOptions = [
		{ value: 'constant', label: 'Constant' },
		{ value: 'intermittent', label: 'Intermittent' },
		{ value: 'episodic', label: 'Episodic' }
	];
</script>

<Fieldset legend="Abdominal Pain Assessment">
	<p class="hint">Detailed characterisation of abdominal pain.</p>

	<Field label="Where is the pain located?" inputId="painLocation">
		<Select id="painLocation" label="Pain location" bind:value={a.painLocation}>
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

	<Field label="What is the character of the pain?" inputId="painCharacter">
		<Select id="painCharacter" label="Pain character" bind:value={a.painCharacter}>
			<option value="">-- Select --</option>
			<option value="cramping">Cramping</option>
			<option value="burning">Burning</option>
			<option value="sharp">Sharp</option>
			<option value="dull">Dull</option>
			<option value="colicky">Colicky (comes in waves)</option>
		</Select>
	</Field>

	<Field label="Does the pain radiate anywhere?" inputId="painRadiation">
		<TextInput id="painRadiation" label="Pain radiation" placeholder="e.g. to the back, shoulder" bind:value={a.painRadiation} />
	</Field>

	<Field label="What makes the pain worse (aggravating factors)?" inputId="aggravating">
		<TextAreaInput id="aggravating" label="Aggravating factors" rows={3} placeholder="e.g. eating, lying down, certain foods" bind:value={a.aggravatingFactors} />
	</Field>

	<Field label="What makes the pain better (relieving factors)?" inputId="relieving">
		<TextAreaInput id="relieving" label="Relieving factors" rows={3} placeholder="e.g. antacids, fasting, certain positions" bind:value={a.relievingFactors} />
	</Field>

	<Field label="How often does the pain occur?">
		<RadioGroup label="Pain frequency">
			{#each frequencyOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="painFrequency" value={opt.value} bind:group={a.painFrequency} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
