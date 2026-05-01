<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const s = assessment.data.sampleHistory;
</script>

<SectionCard
	title="SAMPLE History"
	description="Signs / symptoms, Allergies, Medications, Past medical & surgical history, Last ate, Events (and ROS)."
>
	<TextArea
		label="S — Signs / symptoms"
		name="signsSymptoms"
		bind:value={s.signsSymptoms}
		rows={2}
	/>
	<Checkbox
		label="Signs / symptoms: Unknown"
		name="signsSymptomsUnknown"
		bind:checked={s.signsSymptomsUnknown}
	/>

	<TextArea label="A — Allergies" name="allergies" bind:value={s.allergies} rows={2} />
	<Checkbox
		label="Allergies: Unknown"
		name="allergiesUnknown"
		bind:checked={s.allergiesUnknown}
	/>

	<TextArea
		label="M — Medications"
		name="medications"
		bind:value={s.medications}
		rows={2}
	/>
	<Checkbox
		label="Medications: Unknown"
		name="medicationsUnknown"
		bind:checked={s.medicationsUnknown}
	/>

	<TextArea
		label="P — Past medical"
		name="pastMedical"
		bind:value={s.pastMedical}
		rows={2}
	/>
	<Checkbox
		label="Past medical: Unknown"
		name="pastMedicalUnknown"
		bind:checked={s.pastMedicalUnknown}
	/>

	<TextArea
		label="P — Past surgeries"
		name="pastSurgeries"
		bind:value={s.pastSurgeries}
		rows={2}
	/>
	<Checkbox
		label="Past surgeries: Unknown"
		name="pastSurgeriesUnknown"
		bind:checked={s.pastSurgeriesUnknown}
	/>

	<NumberInput
		label="L — Last ate"
		name="lastAteHours"
		bind:value={s.lastAteHours}
		unit="hrs"
		min={0}
		max={72}
	/>
	<Checkbox
		label="Last ate: Unknown"
		name="lastAteUnknown"
		bind:checked={s.lastAteUnknown}
	/>

	<TextArea
		label="E — Events (and ROS)"
		name="events"
		bind:value={s.events}
		rows={3}
	/>
	<Checkbox label="Events: Unknown" name="eventsUnknown" bind:checked={s.eventsUnknown} />
</SectionCard>
