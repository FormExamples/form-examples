<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { DOMAINS, RECOMMEND_OPTIONS, surveyItems } from '#lib/engine/rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import LikertItem from '#lib/components/ui/LikertItem.svelte';
	import type { LikertValue } from '#lib/engine/types.js';

	const meta = DOMAINS.find((dm) => dm.key === 'overall')!;
	const items = surveyItems.filter((it) => it.domain === 'overall');
	const o = assessment.data.overall;
	const likert = o as unknown as Record<string, LikertValue>;
</script>

<Fieldset legend={meta.title}>
	<p class="hint">{meta.description}</p>

	{#each items as item (item.id)}
		<LikertItem id={item.id} label={item.label} bind:value={likert[item.id]} />
	{/each}

	<Field label="Would you recommend this organisation as a place to work?" inputId="recommendAsPlaceToWork">
		<Select
			id="recommendAsPlaceToWork"
			label="Would you recommend this organisation as a place to work?"
			bind:value={o.recommendAsPlaceToWork}
		>
			<option value="">— Select —</option>
			{#each RECOMMEND_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="What is the biggest strength of the climate here? (Optional)" inputId="biggestStrength">
		<TextAreaInput
			id="biggestStrength"
			label="Biggest strength"
			rows={3}
			placeholder="Describe what is working well — please keep it general, not about specific people."
			bind:value={o.biggestStrength}
		/>
	</Field>

	<Field
		label="What is the single change that would most improve the climate here? (Optional)"
		inputId="biggestImprovement"
	>
		<TextAreaInput
			id="biggestImprovement"
			label="Biggest improvement"
			rows={3}
			placeholder="Describe the change, not specific people…"
			bind:value={o.biggestImprovement}
		/>
	</Field>

	<Field label="Any other comments? (Optional)" inputId="otherComments">
		<TextAreaInput
			id="otherComments"
			label="Other comments"
			rows={3}
			placeholder="Anything else you would like leadership to know — please keep it anonymous."
			bind:value={o.otherComments}
		/>
	</Field>
</Fieldset>
