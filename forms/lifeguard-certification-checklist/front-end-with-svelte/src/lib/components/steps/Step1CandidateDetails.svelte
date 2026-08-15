<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const c = assessment.data.candidateDetails;
</script>

<Fieldset legend="Candidate Details">
	<p class="hint">Identify the candidate, venue, and the assessing examiner.</p>

	<Field label="First name" inputId="firstName">
		<TextInput id="firstName" label="First name" bind:value={c.firstName} />
	</Field>

	<Field label="Last name" required inputId="lastName">
		<TextInput id="lastName" label="Last name" required bind:value={c.lastName} />
	</Field>

	<Field label="Candidate ID" inputId="candidateId">
		<TextInput id="candidateId" label="Candidate ID" placeholder="e.g. RLSS membership number" bind:value={c.candidateId} />
	</Field>

	<Field label="Date of birth" inputId="dateOfBirth">
		<DateInput id="dateOfBirth" label="Date of birth" bind:value={c.dateOfBirth} />
	</Field>

	<Field label="Venue type" inputId="venueType">
		<Select id="venueType" label="Venue type" bind:value={c.venueType}>
			<option value="">-- Select --</option>
			<option value="pool">Swimming pool</option>
			<option value="beach">Beach</option>
			<option value="inland-water">Inland water</option>
			<option value="water-park">Water park</option>
			<option value="leisure">Leisure centre</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Venue name" inputId="venueName">
		<TextInput id="venueName" label="Venue name" placeholder="e.g. Riverside Leisure Centre" bind:value={c.venueName} />
	</Field>

	<Field label="Assessment type" inputId="assessmentType">
		<Select id="assessmentType" label="Assessment type" bind:value={c.assessmentType}>
			<option value="">-- Select --</option>
			<option value="initial">Initial qualification</option>
			<option value="requalification">Requalification</option>
			<option value="cross-over">Cross-over</option>
			<option value="in-service">In-service training</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Prior certification expiry" description="Recorded for requalification candidates." inputId="priorCertificationExpiry">
		<DateInput id="priorCertificationExpiry" label="Prior certification expiry" bind:value={c.priorCertificationExpiry} />
	</Field>

	<Field label="Session date" required inputId="sessionDate">
		<DateInput id="sessionDate" label="Session date" required bind:value={c.sessionDate} />
	</Field>

	<Field label="Examiner name" inputId="examinerName">
		<TextInput id="examinerName" label="Examiner name" bind:value={c.examinerName} />
	</Field>

	<Field label="Examiner licence number" inputId="examinerLicenceNumber">
		<TextInput id="examinerLicenceNumber" label="Examiner licence number" bind:value={c.examinerLicenceNumber} />
	</Field>
</Fieldset>
