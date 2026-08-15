<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const v = assessment.data.vehicleAdaptations;
</script>

<Fieldset legend="Question 12 — Vehicle adaptations">
	<p class="hint">Tell us about any special controls or automatic transmission you require.</p>

	<Field label="Do you need to drive a vehicle fitted with special controls or automatic transmission?" required>
		<RadioGroup label="Needs adaptations?">
			<label><input type="radio" class="radio-input" name="needsAdaptations" value="yes" bind:group={v.needsAdaptations} required /> Yes</label>
			<label><input type="radio" class="radio-input" name="needsAdaptations" value="no" bind:group={v.needsAdaptations} required /> No</label>
		</RadioGroup>
	</Field>

	{#if v.needsAdaptations === 'yes'}
		<Field label="a) Have you told us before that you need special controls or automatic transmission?" required>
			<RadioGroup label="Previously declared?">
				<label><input type="radio" class="radio-input" name="previouslyDeclared" value="yes" bind:group={v.previouslyDeclared} required /> Yes</label>
				<label><input type="radio" class="radio-input" name="previouslyDeclared" value="no" bind:group={v.previouslyDeclared} required /> No</label>
			</RadioGroup>
		</Field>

		{#if v.previouslyDeclared === 'yes'}
			<Field label="b) Since your last licence was issued, have you had any additional controls fitted to your vehicle?" required>
				<RadioGroup label="Additional controls fitted?">
					<label><input type="radio" class="radio-input" name="additionalControlsFitted" value="yes" bind:group={v.additionalControlsFitted} required /> Yes</label>
					<label><input type="radio" class="radio-input" name="additionalControlsFitted" value="no" bind:group={v.additionalControlsFitted} required /> No</label>
				</RadioGroup>
			</Field>
		{/if}
	{/if}

	<Alert type="info">
		<p>If you have any relevant hospital notes about your medical condition, please send copies with this form.</p>
	</Alert>
</Fieldset>
