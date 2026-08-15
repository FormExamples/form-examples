<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.problems;
</script>

<Fieldset legend="Step 4 of 11 — Current issues and progress">
	<p class="hint">
		The active problem list and progress against each problem. Required component.
	</p>

	<Field label="Problem list and progress" inputId="problems-problemList">
		<TextAreaInput
			id="problems-problemList"
			label="Problem list and progress"
			rows={5}
			placeholder="e.g. 1. Community-acquired pneumonia — improving, CRP falling. 2. AKI stage 1 — resolving with fluids."
			bind:value={p.problemList}
		/>
	</Field>
</Fieldset>
