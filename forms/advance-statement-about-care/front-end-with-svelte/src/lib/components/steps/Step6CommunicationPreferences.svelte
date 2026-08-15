<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const c = $state(assessment.data.communicationPreferences);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Communication Preferences">
	<p class="hint">How you prefer to communicate and be communicated with</p>
	<Field label="Preferred language" inputId="preferredLanguage"><TextInput id="preferredLanguage" label="Preferred language" placeholder="e.g. English, Welsh, Urdu..." bind:value={c.preferredLanguage} /></Field>

	<Field label="Communication aids" inputId="communicationAids"><TextAreaInput id="communicationAids" label="Communication aids" rows={3} placeholder="e.g. Hearing aid, reading glasses, communication board, large print..." bind:value={c.communicationAids} /></Field>

	<Field label="How would you like to be addressed?" inputId="howToBeAddressed"><TextInput id="howToBeAddressed" label="How would you like to be addressed?" placeholder="e.g. Jane, Mrs Smith, Dr Jones..." bind:value={c.howToBeAddressed} /></Field>

	<Field label="Information sharing preferences" inputId="informationSharingPreferences"><TextAreaInput id="informationSharingPreferences" label="Information sharing preferences" rows={4} placeholder="Who should be told about your condition? Are there things you do or do not want to be told?" bind:value={c.informationSharingPreferences} /></Field>

	<Field label="Do you need an interpreter?"><RadioGroup label="Do you need an interpreter?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="interpreterNeeded" value={opt.value} bind:group={c.interpreterNeeded}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if c.interpreterNeeded === 'yes'}
		<Field label="Interpreter language" inputId="interpreterLanguage"><TextInput id="interpreterLanguage" label="Interpreter language" placeholder="Which language?" bind:value={c.interpreterLanguage} /></Field>
	{/if}
</Fieldset>
