<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const sc = assessment.data.socialCommunication;

	const frequencyOptions = [
		{ value: 'never', label: 'Never' },
		{ value: 'rarely', label: 'Rarely' },
		{ value: 'sometimes', label: 'Sometimes' },
		{ value: 'often', label: 'Often' },
		{ value: 'always', label: 'Always' }
	];
</script>

<Fieldset legend="Social Communication">
	<p class="hint">Social interaction and communication patterns.</p>

	<Field label="How often do you maintain comfortable eye contact during conversation?" required>
		<RadioGroup label="Eye contact">
			{#each frequencyOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="eyeContact" value={opt.value} bind:group={sc.eyeContact} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How often do you engage in social reciprocity?" required>
		<RadioGroup label="Social reciprocity">
			{#each frequencyOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="socialReciprocity" value={opt.value} bind:group={sc.socialReciprocity} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How often do you find it easy to start and maintain conversations?" required>
		<RadioGroup label="Conversation skills">
			{#each frequencyOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="conversationSkills" value={opt.value} bind:group={sc.conversationSkills} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Describe your friendship patterns" inputId="friendshipPatterns">
		<TextAreaInput id="friendshipPatterns" label="Friendship patterns" rows={3} bind:value={sc.friendshipPatterns} />
	</Field>

	<Field label="Any additional social communication difficulties" inputId="socialDifficultiesDetails">
		<TextAreaInput id="socialDifficultiesDetails" label="Social difficulties details" rows={3} bind:value={sc.socialDifficultiesDetails} />
	</Field>
</Fieldset>
