<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const h = assessment.data.hx;
</script>

<Fieldset legend="History">
	<p class="hint">Related issues, prior occurrences, and the timeline leading up to this.</p>

	<Field label="Related issues" inputId="hxRelatedIssues">
		<TextInput id="hxRelatedIssues" label="Related issues" placeholder="e.g. ISS-101, ISS-102" bind:value={h.hxRelatedIssues} />
	</Field>

	<div class="field-grid">
		<Field label="Prior occurrences (count)" inputId="hxPriorOccurrences">
			<NumberInput id="hxPriorOccurrences" label="Prior occurrences" min={0} bind:value={h.hxPriorOccurrences} />
		</Field>
		<Field label="Recent change URL" inputId="hxRecentChangeUrl">
			<TextInput id="hxRecentChangeUrl" label="Recent change URL" type="url" bind:value={h.hxRecentChangeUrl} />
		</Field>
	</div>

	<Field label="References" inputId="hxReferences">
		<TextAreaInput id="hxReferences" label="References" rows={3} bind:value={h.hxReferences} />
	</Field>

	<Field label="Timeline" inputId="hxTimeline">
		<TextAreaInput id="hxTimeline" label="Timeline" rows={4} bind:value={h.hxTimeline} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
