<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.additionalComments;
</script>

<Fieldset legend="Additional comments">
	<p class="hint">
		Optional. Please keep comments anonymous — do not include names, your manager's name, or other
		identifying details.
	</p>

	<Field label="What is the most stressful aspect of your work?" inputId="mostStressfulAspect">
		<TextAreaInput
			id="mostStressfulAspect"
			label="What is the most stressful aspect of your work?"
			rows={3}
			bind:value={c.mostStressfulAspect}
		/>
	</Field>

	<Field label="What could improve things?" inputId="suggestionsForImprovement">
		<TextAreaInput
			id="suggestionsForImprovement"
			label="What could improve things?"
			rows={3}
			bind:value={c.suggestionsForImprovement}
		/>
	</Field>

	<Field label="Any other comments?" inputId="otherComments">
		<TextAreaInput
			id="otherComments"
			label="Any other comments?"
			rows={3}
			bind:value={c.otherComments}
		/>
	</Field>
</Fieldset>
