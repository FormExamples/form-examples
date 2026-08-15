<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.communicationDifficulties;

	const difficultyOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'slight', label: 'Slight' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];

	const questions: { key: keyof typeof c; label: string; name: string }[] = [
		{ key: 'quietConversation', label: 'Conversation in a quiet room (one-to-one)', name: 'quietConversation' },
		{ key: 'groupConversation', label: 'Group conversation (3 or more people)', name: 'groupConversation' },
		{ key: 'telephone', label: 'Telephone conversations', name: 'telephone' },
		{ key: 'television', label: 'Listening to television or radio', name: 'television' },
		{ key: 'publicPlaces', label: 'Hearing in public places (shops, restaurants, etc.)', name: 'publicPlaces' },
		{ key: 'workDifficulty', label: 'Hearing difficulty at work or during regular activities', name: 'workDifficulty' }
	];
</script>

<Fieldset legend="Communication Difficulties">
	<p class="hint">Rate your difficulty in the following listening situations.</p>

	{#each questions as q (q.key)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each difficultyOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.name} value={opt.value} bind:group={c[q.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
