<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const rom = assessment.data.rangeOfMotion;
</script>

<Fieldset legend="Range of Motion">
	<p class="hint">Joint-specific range of motion measurements (in degrees).</p>

	<Field label="Joint Assessed" required inputId="romJoint" description="e.g., Right shoulder, Left knee">
		<TextInput id="romJoint" label="Joint" required bind:value={rom.joint} />
	</Field>

	<div class="field-grid">
		<Field label="Flexion (degrees)" inputId="flexion">
			<NumberInput id="flexion" label="Flexion" min={0} max={360} bind:value={rom.flexion} />
		</Field>
		<Field label="Extension (degrees)" inputId="extension">
			<NumberInput id="extension" label="Extension" min={0} max={360} bind:value={rom.extension} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Abduction (degrees)" inputId="abduction">
			<NumberInput id="abduction" label="Abduction" min={0} max={360} bind:value={rom.abduction} />
		</Field>
		<Field label="Adduction (degrees)" inputId="adduction">
			<NumberInput id="adduction" label="Adduction" min={0} max={360} bind:value={rom.adduction} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Internal Rotation (degrees)" inputId="internalRotation">
			<NumberInput id="internalRotation" label="Internal Rotation" min={0} max={360} bind:value={rom.internalRotation} />
		</Field>
		<Field label="External Rotation (degrees)" inputId="externalRotation">
			<NumberInput id="externalRotation" label="External Rotation" min={0} max={360} bind:value={rom.externalRotation} />
		</Field>
	</div>

	<Field label="Additional Notes" inputId="romNotes">
		<TextAreaInput id="romNotes" label="Additional Notes" rows={3} bind:value={rom.notes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid { grid-template-columns: 1fr; }
	}
</style>
