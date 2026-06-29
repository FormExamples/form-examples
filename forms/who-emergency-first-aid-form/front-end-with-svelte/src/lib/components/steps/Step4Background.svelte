<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const b = assessment.data.background;
</script>

<Fieldset
	title="Background"
	description="Past medical and surgical history, current medications, and known allergies. Write &quot;None&quot; if there is nothing relevant."
>
	<TextAreaInput
		label="Past medical & surgical history"
		name="pastHistory"
		bind:value={b.pastMedicalAndSurgicalHistory}
		placeholder="Conditions, prior surgeries, etc. (write &quot;None&quot; if nothing relevant)"
		rows={4}
		required
	/>
	<TextAreaInput
		label="Current medications or allergies"
		name="medsAllergies"
		bind:value={b.currentMedicationsOrAllergies}
		placeholder="List medications and allergies (write &quot;None&quot; if nothing relevant)"
		rows={4}
		required
	/>
</Fieldset>
