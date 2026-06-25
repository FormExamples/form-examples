<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Findings">
	<p class="hint">The narrative findings plus structured finding flags.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the audiometric findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Hearing loss present" bind:checked={d.hearingLossPresent} /> Hearing loss present</label>
			<label><CheckboxInput label="Marked asymmetry between ears" bind:checked={d.asymmetricLoss} /> Marked asymmetry between ears</label>
			<label><CheckboxInput label="Sudden sensorineural hearing loss" bind:checked={d.suddenSensorineuralLoss} /> Sudden sensorineural hearing loss</label>
			<label><CheckboxInput label="Conductive component" bind:checked={d.conductiveComponent} /> Conductive component</label>
			<label><CheckboxInput label="Normal hearing bilaterally" bind:checked={d.normalHearing} /> Normal hearing bilaterally</label>
		</CheckboxGroup>
	</Field>

	{#if d.suddenSensorineuralLoss || d.asymmetricLoss}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Sudden sensorineural hearing loss (an otological emergency) or a marked asymmetry (red flag
				for retrocochlear pathology) auto-escalates the follow-up urgency to a critical alert. Ensure
				the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
