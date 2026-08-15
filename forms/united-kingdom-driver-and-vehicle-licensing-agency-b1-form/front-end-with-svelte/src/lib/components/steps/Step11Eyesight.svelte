<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.eyesight;
</script>

<Fieldset legend="Question 11 — Eyesight">
	<p class="hint">Tell us whether your condition has affected your eyesight.</p>

	<Field label="Has your condition caused problems with your eyesight?" required>
		<RadioGroup label="Eyesight problems?">
			<label><input type="radio" class="radio-input" name="hasEyesightProblems" value="yes" bind:group={e.hasEyesightProblems} required /> Yes</label>
			<label><input type="radio" class="radio-input" name="hasEyesightProblems" value="no" bind:group={e.hasEyesightProblems} required /> No</label>
		</RadioGroup>
	</Field>

	{#if e.hasEyesightProblems === 'yes'}
		<Field label="If Yes, please give details" required inputId="eyesightDetails">
			<TextAreaInput id="eyesightDetails" label="Eyesight details" rows={3} required bind:value={e.details} />
		</Field>
	{/if}
</Fieldset>
