<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';
	import AllergyEntry from '$lib/components/ui/AllergyEntry.svelte';

	const cm = assessment.data.currentMedications;
</script>

<Fieldset legend="Current Medications">
	<p class="hint">All medications, supplements, and allergies.</p>

	<Field label="Prescriptions">
		<MedicationEntry bind:medications={cm.prescriptions} />
	</Field>

	<Field label="Over-the-Counter Medications">
		<MedicationEntry bind:medications={cm.otcMedications} />
	</Field>

	<Field label="Supplements">
		<MedicationEntry bind:medications={cm.supplements} />
	</Field>

	<Field label="Allergies">
		<AllergyEntry bind:allergies={cm.allergies} />
	</Field>
</Fieldset>
