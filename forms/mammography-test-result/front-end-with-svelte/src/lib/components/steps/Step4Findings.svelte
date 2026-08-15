<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
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
			placeholder="Narrative description of the imaging findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Mass" bind:checked={d.mass} /> Mass</label>
			<label><CheckboxInput label="Calcifications" bind:checked={d.calcifications} /> Calcifications</label>
			<label><CheckboxInput label="Architectural distortion" bind:checked={d.architecturalDistortion} /> Architectural distortion</label>
			<label><CheckboxInput label="Asymmetry" bind:checked={d.asymmetry} /> Asymmetry</label>
			<label><CheckboxInput label="Skin / nipple change" bind:checked={d.skinOrNippleChange} /> Skin / nipple change</label>
			<label><CheckboxInput label="Lymphadenopathy" bind:checked={d.lymphadenopathy} /> Lymphadenopathy</label>
			<label><CheckboxInput label="Incidental finding" bind:checked={d.incidentalFinding} /> Incidental finding</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
