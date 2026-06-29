<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.background;
</script>

<Fieldset legend="Background (B) — Relevant History">
	<p class="hint">Concise background needed for the receiving team to take over safely.</p>

	<Field label="Presenting complaint" required inputId="presentingComplaint">
		<TextAreaInput id="presentingComplaint" label="Presenting complaint" rows={2} required bind:value={d.presentingComplaint} />
	</Field>

	<Field label="Relevant history of current admission" required inputId="relevantHistory">
		<TextAreaInput id="relevantHistory" label="Relevant history of current admission" rows={3} required bind:value={d.relevantHistory} />
	</Field>

	<Field label="Past medical / surgical history" inputId="pastMedicalHistory">
		<TextAreaInput id="pastMedicalHistory" label="Past medical / surgical history" rows={3} bind:value={d.pastMedicalHistory} />
	</Field>

	<Field label="Current medications" required inputId="currentMedications">
		<TextAreaInput
			id="currentMedications"
			label="Current medications"
			rows={3}
			required
			placeholder="List each drug, dose, route, frequency."
			bind:value={d.currentMedications}
		/>
	</Field>

	<Field label="Allergies / adverse reactions" required inputId="allergies">
		<TextAreaInput
			id="allergies"
			label="Allergies / adverse reactions"
			rows={2}
			required
			placeholder='Document explicitly. Record "NKDA" if no known drug allergies.'
			bind:value={d.allergies}
		/>
	</Field>

	<Field label="Recent investigations / results" inputId="recentInvestigations">
		<TextAreaInput
			id="recentInvestigations"
			label="Recent investigations / results"
			rows={3}
			placeholder="e.g. bloods, imaging, microbiology, ECG."
			bind:value={d.recentInvestigations}
		/>
	</Field>

	<Field label="Infection / colonisation status" required inputId="infectionStatus">
		<TextAreaInput
			id="infectionStatus"
			label="Infection / colonisation status"
			rows={2}
			required
			placeholder="e.g. MRSA negative on screening, COVID-19 swab pending, none known."
			bind:value={d.infectionStatus}
		/>
	</Field>
</Fieldset>
