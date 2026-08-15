<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';
	import AllergyEntry from '#lib/components/ui/AllergyEntry.svelte';
</script>

<Fieldset legend="Current Medications">
	<p class="hint">Eye drops, oral medications for eyes, and ophthalmic drug allergies.</p>

	<Field label="Eye Drops">
		<MedicationEntry bind:medications={assessment.data.currentMedications.eyeDrops} />
	</Field>

	<Field label="Oral Medications for Eyes">
		<MedicationEntry bind:medications={assessment.data.currentMedications.oralMedications} />
	</Field>

	<Field label="Ophthalmic Drug Allergies">
		<AllergyEntry bind:allergies={assessment.data.currentMedications.ophthalmicDrugAllergies} />
	</Field>
</Fieldset>
