<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const rb = assessment.data.repetitiveBehaviors;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const frequencyOptions = [
		{ value: 'never', label: 'Never' },
		{ value: 'rarely', label: 'Rarely' },
		{ value: 'sometimes', label: 'Sometimes' },
		{ value: 'often', label: 'Often' },
		{ value: 'always', label: 'Always' }
	];
</script>

<Fieldset legend="Repetitive Behaviors">
	<p class="hint">Routines, interests, and repetitive patterns.</p>

	<Field label="How strongly do you adhere to routines and rituals?" required>
		<RadioGroup label="Routine adherence">
			{#each frequencyOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="routineAdherence" value={opt.value} bind:group={rb.routineAdherence} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Describe any special or intense interests" inputId="specialInterests">
		<TextAreaInput id="specialInterests" label="Special interests" rows={3} bind:value={rb.specialInterests} />
	</Field>

	<Field label="Do you engage in repetitive movements?" required>
		<RadioGroup label="Repetitive movements">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="repetitiveMovements" value={opt.value} bind:group={rb.repetitiveMovements} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if rb.repetitiveMovements === 'yes'}
		<Field label="Describe the repetitive movements" inputId="repetitiveMovementsDetails">
			<TextAreaInput id="repetitiveMovementsDetails" label="Repetitive movement details" rows={3} bind:value={rb.repetitiveMovementsDetails} />
		</Field>
	{/if}

	<Field label="How much do you resist changes to routine or environment?" required>
		<RadioGroup label="Resistance to change">
			{#each frequencyOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="resistanceToChange" value={opt.value} bind:group={rb.resistanceToChange} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
