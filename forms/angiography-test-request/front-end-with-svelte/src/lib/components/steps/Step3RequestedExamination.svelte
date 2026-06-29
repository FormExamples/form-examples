<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const r = request.data.request;
</script>

<Fieldset legend="Requested examination">
	<p class="hint">
		Modality, body region, indication, and the specific clinical question — the highest-value
		fields.
	</p>

	<div class="field-grid">
		<Field label="Angiography type" required inputId="angiographyType">
			<Select id="angiographyType" label="Angiography type" required bind:value={r.angiographyType}>
				<option value="">— Select —</option>
				<option value="ct-angiography">CT angiography (CTA)</option>
				<option value="mr-angiography">MR angiography (MRA)</option>
				<option value="catheter-dsa">Catheter / DSA</option>
				<option value="coronary-angiography">Coronary angiography</option>
				<option value="peripheral-angiography">Peripheral angiography</option>
				<option value="cerebral-angiography">Cerebral angiography</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Body region" required inputId="bodyRegion">
			<Select id="bodyRegion" label="Body region" required bind:value={r.bodyRegion}>
				<option value="">— Select —</option>
				<option value="coronary">Coronary</option>
				<option value="cerebral">Cerebral</option>
				<option value="carotid">Carotid</option>
				<option value="aorta">Aorta</option>
				<option value="renal">Renal</option>
				<option value="peripheral-lower-limb">Peripheral (lower limb)</option>
				<option value="pulmonary">Pulmonary</option>
				<option value="mesenteric">Mesenteric</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	</div>

	<Field label="Primary indication" required inputId="primaryIndication">
		<Select id="primaryIndication" label="Primary indication" required bind:value={r.primaryIndication}>
			<option value="">— Select —</option>
			<option value="suspected-coronary-disease">Suspected coronary disease</option>
			<option value="peripheral-arterial-disease">Peripheral arterial disease</option>
			<option value="aneurysm">Aneurysm</option>
			<option value="stenosis">Stenosis</option>
			<option value="suspected-pulmonary-embolism">Suspected pulmonary embolism</option>
			<option value="gi-bleeding">GI bleeding</option>
			<option value="pre-intervention-planning">Pre-intervention planning</option>
			<option value="suspected-stroke">Suspected stroke</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Specific clinical question" required inputId="clinicalQuestion">
		<TextAreaInput
			id="clinicalQuestion"
			label="Specific clinical question"
			rows={2}
			required
			placeholder="e.g. Assess extent and run-off of lower-limb arterial disease."
			bind:value={r.clinicalQuestion}
		/>
	</Field>

	<Field label="Relevant history" inputId="relevantHistory">
		<TextAreaInput id="relevantHistory" label="Relevant history" rows={2} bind:value={r.relevantHistory} />
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
