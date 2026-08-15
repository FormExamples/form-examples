<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Findings">
	<p class="hint">The narrative findings plus structured finding flags.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the procedure findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Polyps found" bind:checked={d.polypsFound} /> Polyps found</label>
			<label><CheckboxInput label="Mass lesion" bind:checked={d.massLesion} /> Mass lesion</label>
			<label><CheckboxInput label="Diverticulosis" bind:checked={d.diverticulosis} /> Diverticulosis</label>
			<label><CheckboxInput label="Inflammation suggestive of IBD" bind:checked={d.inflammationIbd} /> Inflammation / IBD</label>
			<label><CheckboxInput label="Angiodysplasia" bind:checked={d.angiodysplasia} /> Angiodysplasia</label>
			<label><CheckboxInput label="Bleeding source identified" bind:checked={d.bleedingSourceIdentified} /> Bleeding source identified</label>
			<label><CheckboxInput label="Normal examination" bind:checked={d.normalExamination} /> Normal examination</label>
		</CheckboxGroup>
	</Field>

	{#if d.massLesion}
		<Alert type="error" heading="Critical finding selected">
			<p>
				A mass lesion auto-escalates the follow-up urgency to a critical alert. Ensure the result is
				communicated to the referrer on sign-off and an urgent MDT / colorectal-surgical referral is
				arranged.
			</p>
		</Alert>
	{/if}
</Fieldset>
