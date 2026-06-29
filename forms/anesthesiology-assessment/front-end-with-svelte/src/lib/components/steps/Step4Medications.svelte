<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';
	import YesNoField from '$lib/components/ui/YesNoField.svelte';

	const d = assessment.data.medications;
</script>

<Fieldset legend="Medications">
	<p class="hint">Current regular medications and key drug classes that affect the anaesthetic plan.</p>

	<Field label="Current medications">
		<MedicationEntry bind:medications={d.list} />
	</Field>

	<div class="yn-grid">
		<YesNoField label="On anticoagulants?" name="onAnticoagulants" bind:value={d.onAnticoagulants} />
		<YesNoField label="On antiplatelets?" name="onAntiplatelets" bind:value={d.onAntiplatelets} />
		<YesNoField label="On insulin?" name="onInsulin" bind:value={d.onInsulin} />
		<YesNoField label="On steroids?" name="onSteroids" bind:value={d.onSteroids} />
		<YesNoField label="On MAOIs?" name="onMaois" bind:value={d.onMaois} />
	</div>
</Fieldset>

<style>
	.yn-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.5rem 1.5rem;
	}
	@media (max-width: 640px) {
		.yn-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
