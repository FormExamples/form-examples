<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const p = assessment.data.patientIdentification;
</script>

<SectionCard
	title="Patient Identification"
	description="Patient details to appear on the front page of the MAT B1 certificate."
>
	<TextInput
		label="Patient's full name"
		name="patientName"
		bind:value={p.patientName}
		placeholder="As it should appear above Part A"
		required
	/>

	<TextInput
		label="Date of birth"
		name="patientDateOfBirth"
		type="date"
		bind:value={p.dateOfBirth}
	/>

	<TextInput
		label="NHS number"
		name="nhsNumber"
		bind:value={p.nhsNumber}
		placeholder="Optional, for record-keeping"
	/>
</SectionCard>
