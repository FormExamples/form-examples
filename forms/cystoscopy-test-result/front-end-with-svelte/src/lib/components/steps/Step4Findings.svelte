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

<Fieldset legend="4. Findings">
	<p class="hint">The narrative findings plus structured finding flags.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the endoscopic findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Bladder tumour / suspicious lesion" bind:checked={d.bladderTumour} /> Bladder tumour / suspicious lesion</label>
			<label><CheckboxInput label="Inflammation / cystitis" bind:checked={d.inflammationCystitis} /> Inflammation / cystitis</label>
			<label><CheckboxInput label="Bladder stones" bind:checked={d.bladderStones} /> Bladder stones</label>
			<label><CheckboxInput label="Urethral stricture" bind:checked={d.urethralStricture} /> Urethral stricture</label>
			<label><CheckboxInput label="Trabeculation" bind:checked={d.trabeculation} /> Trabeculation</label>
			<label><CheckboxInput label="Prostatic enlargement" bind:checked={d.prostaticEnlargement} /> Prostatic enlargement</label>
			<label><CheckboxInput label="Normal examination" bind:checked={d.normalExamination} /> Normal examination</label>
		</CheckboxGroup>
	</Field>

	{#if d.bladderTumour}
		<Alert type="error" heading="Critical finding selected">
			<p>
				A bladder tumour or suspicious lesion auto-escalates the follow-up urgency to a critical
				alert. Ensure the result is communicated to the referrer on sign-off and book urgent TURBT /
				MDT referral.
			</p>
		</Alert>
	{/if}
</Fieldset>
