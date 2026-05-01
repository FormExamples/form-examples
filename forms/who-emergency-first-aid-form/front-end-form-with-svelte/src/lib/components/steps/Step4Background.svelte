<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const b = assessment.data.background;
</script>

<SectionCard
	title="Background"
	description="Past medical and surgical history, current medications, and known allergies. Write &quot;None&quot; if there is nothing relevant."
>
	<TextArea
		label="Past medical & surgical history"
		name="pastHistory"
		bind:value={b.pastMedicalAndSurgicalHistory}
		placeholder="Conditions, prior surgeries, etc. (write &quot;None&quot; if nothing relevant)"
		rows={4}
		required
	/>
	<TextArea
		label="Current medications or allergies"
		name="medsAllergies"
		bind:value={b.currentMedicationsOrAllergies}
		placeholder="List medications and allergies (write &quot;None&quot; if nothing relevant)"
		rows={4}
		required
	/>
</SectionCard>
