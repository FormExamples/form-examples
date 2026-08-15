<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const pc = assessment.data.practiceConfiguration;
</script>

<Fieldset legend="Practice Configuration">
	<p class="hint">Enter the practice details that will appear in the privacy notice.</p>

	<Field label="Practice Name" required inputId="practiceName">
		<TextInput
			id="practiceName"
			label="Practice Name"
			placeholder="e.g. Riverside Medical Practice"
			required
			bind:value={pc.practiceName}
		/>
	</Field>

	<Field label="Practice Address" required inputId="practiceAddress">
		<TextAreaInput
			id="practiceAddress"
			label="Practice Address"
			placeholder="e.g. 123 High Street, London, SW1A 1AA"
			required
			bind:value={pc.practiceAddress}
		/>
	</Field>

	<Field label="Data Protection Officer Name" required inputId="dpoName">
		<TextInput
			id="dpoName"
			label="Data Protection Officer Name"
			placeholder="e.g. Jane Smith"
			required
			bind:value={pc.dpoName}
		/>
	</Field>

	<Field label="DPO Contact Details" required inputId="dpoContactDetails">
		<TextAreaInput
			id="dpoContactDetails"
			label="DPO Contact Details"
			placeholder="e.g. jane.smith@riverside.nhs.uk, 020 7123 4567"
			required
			bind:value={pc.dpoContactDetails}
		/>
	</Field>

	<Field label="Research Organisations" inputId="researchOrganisations">
		<TextInput
			id="researchOrganisations"
			label="Research Organisations"
			placeholder="e.g. Clinical Practice Research Datalink, NHS England"
			bind:value={pc.researchOrganisations}
		/>
	</Field>

	<Field label="Data Sharing Partners" inputId="dataSharingPartners">
		<TextInput
			id="dataSharingPartners"
			label="Data Sharing Partners"
			placeholder="e.g. NHS England, local hospitals"
			bind:value={pc.dataSharingPartners}
		/>
	</Field>
</Fieldset>
