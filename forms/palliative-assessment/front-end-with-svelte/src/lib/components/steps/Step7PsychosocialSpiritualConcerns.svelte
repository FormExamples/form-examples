<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.psychosocialSpiritualConcerns;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Psychosocial & Spiritual Concerns">
	<p class="hint">Mood, anxiety, existential distress, spiritual needs, and any unresolved concerns.</p>

	<Field label="Mood concerns?">
		<RadioGroup label="Mood concerns?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="moodConcerns" value={opt.value} bind:group={d.moodConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.moodConcerns === 'yes'}
		<Field label="Mood notes" inputId="moodNotes">
			<TextAreaInput id="moodNotes" label="Mood notes" rows={2} bind:value={d.moodNotes} />
		</Field>
	{/if}

	<Field label="Anxiety concerns?">
		<RadioGroup label="Anxiety concerns?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="anxietyConcerns" value={opt.value} bind:group={d.anxietyConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.anxietyConcerns === 'yes'}
		<Field label="Anxiety notes" inputId="anxietyNotes">
			<TextAreaInput id="anxietyNotes" label="Anxiety notes" rows={2} bind:value={d.anxietyNotes} />
		</Field>
	{/if}

	<Field label="Existential distress?">
		<RadioGroup label="Existential distress?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="existentialDistress" value={opt.value} bind:group={d.existentialDistress} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.existentialDistress === 'yes'}
		<Field label="Existential distress notes" inputId="existentialNotes">
			<TextAreaInput id="existentialNotes" label="Existential distress notes" rows={2} bind:value={d.existentialNotes} />
		</Field>
	{/if}

	<Field label="Spiritual support requested?">
		<RadioGroup label="Spiritual support requested?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="spiritualSupportRequested" value={opt.value} bind:group={d.spiritualSupportRequested} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Faith or belief" inputId="faithOrBelief">
		<TextInput id="faithOrBelief" label="Faith or belief" bind:value={d.faithOrBelief} />
	</Field>

	<Field label="Chaplaincy notes" inputId="chaplaincyNotes">
		<TextAreaInput id="chaplaincyNotes" label="Chaplaincy notes" rows={2} bind:value={d.chaplaincyNotes} />
	</Field>

	<Field label="Unresolved concerns?">
		<RadioGroup label="Unresolved concerns?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="unresolvedConcerns" value={opt.value} bind:group={d.unresolvedConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.unresolvedConcerns === 'yes'}
		<Field label="Unresolved concerns notes" inputId="unresolvedNotes">
			<TextAreaInput id="unresolvedNotes" label="Unresolved concerns notes" rows={2} bind:value={d.unresolvedNotes} />
		</Field>
	{/if}
</Fieldset>
