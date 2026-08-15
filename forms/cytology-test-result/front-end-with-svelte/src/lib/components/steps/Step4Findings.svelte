<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Findings">
	<p class="hint">The cytology result category, HPV status, headline findings, and microscopic description.</p>

	<Field
		label="Cytology result category"
		inputId="cytologyResultCategory"
		description="The recognised grading category for the specimen type (e.g. negative / borderline / low-grade / high-grade dyskaryosis; Thy1–Thy5; C1–C5)."
	>
		<TextAreaInput
			id="cytologyResultCategory"
			label="Cytology result category"
			rows={2}
			placeholder="e.g. high-grade dyskaryosis (severe), Thy5, C5…"
			bind:value={d.cytologyResultCategory}
		/>
	</Field>

	<Field label="HPV result" inputId="hpvResult">
		<Select id="hpvResult" label="HPV result" bind:value={d.hpvResult}>
			<option value="">Select…</option>
			<option value="positive">Positive</option>
			<option value="negative">Negative</option>
			<option value="not-tested">Not tested</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Headline findings">
		<CheckboxGroup label="Headline findings">
			<label><CheckboxInput label="Malignancy present" bind:checked={d.malignancyPresent} /> Malignancy present</label>
			<label><CheckboxInput label="Dysplasia / dyskaryosis present" bind:checked={d.dysplasiaPresent} /> Dysplasia / dyskaryosis present</label>
		</CheckboxGroup>
	</Field>

	<Field label="Microscopic description" inputId="microscopicDescription">
		<TextAreaInput
			id="microscopicDescription"
			label="Microscopic description"
			rows={5}
			placeholder="Microscopic description of the cellular findings (the body of the report)…"
			bind:value={d.microscopicDescription}
		/>
	</Field>

	{#if d.malignancyPresent}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Malignant cells auto-escalate the follow-up urgency to a critical alert. Ensure the result
				is communicated to the referrer on sign-off, with urgent colposcopy / MDT referral.
			</p>
		</Alert>
	{/if}
</Fieldset>
