<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const dv = assessment.data.doubleVision;
</script>

<Fieldset legend="Question 10 — Double vision (diplopia)">
	<p class="hint">Diplopia means seeing two of an object.</p>

	<Field label="Do you have double vision?" required>
		<RadioGroup label="Double vision?">
			<label><input type="radio" class="radio-input" name="hasDoubleVision" value="yes" bind:group={dv.hasDoubleVision} required /> Yes</label>
			<label><input type="radio" class="radio-input" name="hasDoubleVision" value="no" bind:group={dv.hasDoubleVision} required /> No</label>
		</RadioGroup>
	</Field>

	{#if dv.hasDoubleVision === 'yes'}
		<Field label="a) Is your double vision suppressed or controlled?" required>
			<RadioGroup label="Suppressed or controlled?">
				<label><input type="radio" class="radio-input" name="suppressedOrControlled" value="yes" bind:group={dv.suppressedOrControlled} required /> Yes</label>
				<label><input type="radio" class="radio-input" name="suppressedOrControlled" value="no" bind:group={dv.suppressedOrControlled} required /> No</label>
			</RadioGroup>
		</Field>

		{#if dv.suppressedOrControlled === 'yes'}
			<Field label="b) If Yes, how is it controlled?" required>
				<RadioGroup label="Correction method">
					<label><input type="radio" class="radio-input" name="correctionMethod" value="patch" bind:group={dv.correctionMethod} required /> Patch</label>
					<label><input type="radio" class="radio-input" name="correctionMethod" value="prism" bind:group={dv.correctionMethod} required /> Prism</label>
					<label><input type="radio" class="radio-input" name="correctionMethod" value="glasses-or-lenses" bind:group={dv.correctionMethod} required /> Glasses or lenses</label>
					<label><input type="radio" class="radio-input" name="correctionMethod" value="other" bind:group={dv.correctionMethod} required /> Other</label>
				</RadioGroup>
			</Field>

			{#if dv.correctionMethod === 'other'}
				<Field label="Please describe the other method" required inputId="correctionMethodOther">
					<TextInput id="correctionMethodOther" label="Other method" required bind:value={dv.correctionMethodOther} />
				</Field>
			{/if}
		{/if}
	{/if}
</Fieldset>
