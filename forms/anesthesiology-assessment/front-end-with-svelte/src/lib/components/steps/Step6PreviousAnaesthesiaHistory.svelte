<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import OperationEntry from '$lib/components/ui/OperationEntry.svelte';
	import YesNoField from '$lib/components/ui/YesNoField.svelte';

	const d = assessment.data.previousAnaesthesia;
</script>

<Fieldset legend="Previous Anaesthesia & Surgery History">
	<p class="hint">
		Past operations and any previous anaesthetic complications. A difficult-intubation history raises
		the airway risk and a safety-critical flag.
	</p>

	<Field label="Previous operations">
		<OperationEntry bind:operations={d.operations} />
	</Field>

	<Field label="Previous anaesthetic complications">
		<div class="check-grid">
			<label class="check-row"><CheckboxInput label="Difficult intubation" bind:checked={d.difficultIntubation} /> Difficult intubation</label>
			<label class="check-row"><CheckboxInput label="PONV" bind:checked={d.ponv} /> Post-op nausea / vomiting</label>
			<label class="check-row"><CheckboxInput label="Awareness" bind:checked={d.awareness} /> Awareness under anaesthesia</label>
			<label class="check-row"><CheckboxInput label="Slow recovery" bind:checked={d.slowRecovery} /> Slow recovery</label>
			<label class="check-row"><CheckboxInput label="Allergic reaction" bind:checked={d.allergicReaction} /> Allergic reaction</label>
			<label class="check-row"><CheckboxInput label="Other complication" bind:checked={d.otherComplication} /> Other complication</label>
		</div>
	</Field>

	{#if d.otherComplication}
		<Field label="Other complication details" inputId="otherComplicationDetails">
			<TextAreaInput id="otherComplicationDetails" label="Other complication details" rows={2} bind:value={d.otherComplicationDetails} />
		</Field>
	{/if}

	<YesNoField label="Personal history of malignant hyperthermia?" name="malignantHyperthermia" withUnknown bind:value={d.malignantHyperthermia} />
	<YesNoField label="Family history of anaesthetic complications?" name="familyAnaestheticComplications" withUnknown bind:value={d.familyAnaestheticComplications} />

	{#if d.familyAnaestheticComplications === 'yes'}
		<Field label="Family anaesthetic complication details" inputId="familyAnaestheticDetails">
			<TextAreaInput id="familyAnaestheticDetails" label="Family anaesthetic complication details" rows={2} bind:value={d.familyAnaestheticDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.check-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem 1.5rem;
	}
	.check-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	@media (max-width: 640px) {
		.check-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
