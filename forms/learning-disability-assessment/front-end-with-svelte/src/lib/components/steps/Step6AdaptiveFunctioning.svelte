<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import type { AssessmentData } from '#lib/engine/types.js';

	const a = assessment.data.adaptiveFunctioning;

	const supportLevels = [
		{ value: 'independent', label: 'Independent' },
		{ value: 'some-support', label: 'Some support' },
		{ value: 'significant-support', label: 'Significant support' },
		{ value: 'full-support', label: 'Full support' }
	];

	type AdaptiveField = keyof AssessmentData['adaptiveFunctioning'];
	const items: { field: AdaptiveField; label: string }[] = [
		{ field: 'conceptualLanguage', label: 'Language and vocabulary' },
		{ field: 'conceptualReadingWriting', label: 'Reading and writing' },
		{ field: 'conceptualMoneyTime', label: 'Money, time, and number concepts' },
		{ field: 'socialFriendships', label: 'Friendships and relationships' },
		{ field: 'socialEmpathy', label: 'Empathy and social judgement' },
		{ field: 'socialCommunication', label: 'Social communication' },
		{ field: 'practicalSelfCare', label: 'Personal self-care (washing, dressing, eating)' },
		{ field: 'practicalHomeLiving', label: 'Home living (cooking, cleaning, household tasks)' },
		{ field: 'practicalCommunity', label: 'Community use (shopping, transport, money handling)' },
		{ field: 'practicalWorkSchool', label: 'Work or school skills' }
	];
</script>

<Fieldset legend="Adaptive Functioning">
	<p class="hint">
		Day-to-day functioning across the conceptual, social, and practical domains. This section drives
		the severity classification.
	</p>

	<h3 class="domain-header">Conceptual domain</h3>
	<p class="hint">Language, reading, writing, money and time concepts.</p>
	{#each items.slice(0, 3) as item (item.field)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each supportLevels as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={item.field} value={opt.value} bind:group={a[item.field]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<h3 class="domain-header">Social domain</h3>
	<p class="hint">Friendships, empathy, and social communication.</p>
	{#each items.slice(3, 6) as item (item.field)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each supportLevels as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={item.field} value={opt.value} bind:group={a[item.field]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<h3 class="domain-header">Practical domain</h3>
	<p class="hint">Self-care, home living, community, and work or school.</p>
	{#each items.slice(6, 10) as item (item.field)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each supportLevels as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={item.field} value={opt.value} bind:group={a[item.field]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>

<style>
	.domain-header {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
</style>
