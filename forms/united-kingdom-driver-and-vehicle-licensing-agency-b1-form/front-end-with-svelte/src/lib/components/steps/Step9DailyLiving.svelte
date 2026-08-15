<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const dl = assessment.data.dailyLiving;
</script>

<Fieldset legend="Question 9 — Daily living">
	<p class="hint">Tell us whether you need help from another person with everyday tasks.</p>

	<Field label="Do you need help from another person with your day-to-day living?" required>
		<RadioGroup label="Needs help?">
			<label><input type="radio" class="radio-input" name="needsHelp" value="yes" bind:group={dl.needsHelp} required /> Yes</label>
			<label><input type="radio" class="radio-input" name="needsHelp" value="no" bind:group={dl.needsHelp} required /> No</label>
		</RadioGroup>
	</Field>

	{#if dl.needsHelp === 'yes'}
		<Field label="If Yes, please give details of how they help you" required inputId="helpDetails">
			<TextAreaInput id="helpDetails" label="Help details" rows={3} required bind:value={dl.helpDetails} />
		</Field>
	{/if}
</Fieldset>
