<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const b = assessment.data.behaviouralConcerns;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Behavioural Concerns & Triggers">
	<p class="hint">Behaviours of concern and what helps when they occur.</p>

	<Field label="Self-injurious behaviour?">
		<RadioGroup label="Self-injurious behaviour?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="selfInjurious" value={opt.value} bind:group={b.selfInjurious} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Aggression toward others?">
		<RadioGroup label="Aggression toward others?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="aggression" value={opt.value} bind:group={b.aggression} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Property damage?">
		<RadioGroup label="Property damage?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="propertyDamage" value={opt.value} bind:group={b.propertyDamage} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Absconding?">
		<RadioGroup label="Absconding?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="absconding" value={opt.value} bind:group={b.absconding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Inappropriate sexualised behaviour?">
		<RadioGroup label="Inappropriate sexualised behaviour?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sexualisedBehaviour" value={opt.value} bind:group={b.sexualisedBehaviour} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Known triggers" inputId="knownTriggers">
		<TextAreaInput id="knownTriggers" label="Known triggers" rows={3} placeholder="e.g. crowded places, loud noises, changes in routine" bind:value={b.knownTriggers} />
	</Field>

	<Field label="Calming strategies that help" inputId="calmingStrategies">
		<TextAreaInput id="calmingStrategies" label="Calming strategies that help" rows={3} placeholder="e.g. quiet space, sensory toys, familiar objects" bind:value={b.calmingStrategies} />
	</Field>

	<Field label="Is there a positive behaviour support plan?">
		<RadioGroup label="Is there a positive behaviour support plan?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasBehaviourSupportPlan" value={opt.value} bind:group={b.hasBehaviourSupportPlan} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Does the person receive PRN (as-required) sedative or psychotropic medication?">
		<RadioGroup label="Does the person receive PRN medication?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="usesPrn" value={opt.value} bind:group={b.usesPrn} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if b.usesPrn === 'yes'}
		<Field label="PRN details (medication, dose, indication)" inputId="prnDetails">
			<TextInput id="prnDetails" label="PRN details" bind:value={b.prnDetails} />
		</Field>
	{/if}
</Fieldset>
