<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.communicationNeeds;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const verbalOptions = [
		{ value: 'verbal', label: 'Verbal' },
		{ value: 'limited-verbal', label: 'Limited verbal' },
		{ value: 'non-verbal', label: 'Non-verbal' }
	];
</script>

<Fieldset legend="Communication Needs">
	<p class="hint">How the person prefers to communicate (Easy Read, Makaton, AAC).</p>

	<Field label="Verbal ability">
		<RadioGroup label="Verbal ability">
			{#each verbalOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="verbalAbility" value={opt.value} bind:group={c.verbalAbility} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Uses Easy Read materials?">
		<RadioGroup label="Uses Easy Read materials?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="usesEasyRead" value={opt.value} bind:group={c.usesEasyRead} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Uses Makaton signing?">
		<RadioGroup label="Uses Makaton signing?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="usesMakaton" value={opt.value} bind:group={c.usesMakaton} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Uses pictures or symbols?">
		<RadioGroup label="Uses pictures or symbols?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="usesPictures" value={opt.value} bind:group={c.usesPictures} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Uses AAC (augmentative or alternative communication device)?">
		<RadioGroup label="Uses AAC device?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="usesAac" value={opt.value} bind:group={c.usesAac} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if c.usesAac === 'yes'}
		<Field label="AAC details (device, app, vocabulary)" inputId="aacDetails">
			<TextInput id="aacDetails" label="AAC details" bind:value={c.aacDetails} />
		</Field>
	{/if}

	<Field label="Does the person need a language interpreter?">
		<RadioGroup label="Does the person need a language interpreter?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="needsInterpreter" value={opt.value} bind:group={c.needsInterpreter} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if c.needsInterpreter === 'yes'}
		<Field label="Interpreter language" inputId="interpreterLanguage">
			<TextInput id="interpreterLanguage" label="Interpreter language" bind:value={c.interpreterLanguage} />
		</Field>
	{/if}

	<Field label="Preferred communication method" inputId="preferredCommunicationMethod">
		<TextInput id="preferredCommunicationMethod" label="Preferred communication method" placeholder="e.g. short sentences, picture cards, calm voice" bind:value={c.preferredCommunicationMethod} />
	</Field>

	<Field label="Communication notes" inputId="communicationNotes">
		<TextAreaInput id="communicationNotes" label="Communication notes" rows={3} placeholder="Anything else clinicians should know about communication…" bind:value={c.communicationNotes} />
	</Field>
</Fieldset>
