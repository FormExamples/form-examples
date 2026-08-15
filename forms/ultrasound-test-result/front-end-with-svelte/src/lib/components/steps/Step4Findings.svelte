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
			placeholder="Narrative description of the imaging findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Mass or lesion" bind:checked={d.massOrLesion} /> Mass or lesion</label>
			<label><CheckboxInput label="Cyst" bind:checked={d.cyst} /> Cyst</label>
			<label><CheckboxInput label="Gallstones" bind:checked={d.gallstones} /> Gallstones</label>
			<label><CheckboxInput label="Hydronephrosis" bind:checked={d.hydronephrosis} /> Hydronephrosis</label>
			<label><CheckboxInput label="Free fluid" bind:checked={d.freeFluid} /> Free fluid</label>
			<label><CheckboxInput label="DVT present" bind:checked={d.dvtPresent} /> DVT present</label>
			<label><CheckboxInput label="Aneurysm" bind:checked={d.aneurysm} /> Aneurysm</label>
			<label><CheckboxInput label="Organ enlargement" bind:checked={d.organEnlargement} /> Organ enlargement</label>
			<label><CheckboxInput label="Incidental finding" bind:checked={d.incidentalFinding} /> Incidental finding</label>
		</CheckboxGroup>
	</Field>

	{#if d.dvtPresent || d.aneurysm}
		<Alert type="error" heading="Critical finding selected">
			<p>
				DVT present or an aneurysm (e.g. ruptured / large AAA) auto-escalates the follow-up urgency
				to a critical alert. Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
