<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const t = assessment.data.treatment;
</script>

<Fieldset legend="Current treatment">
	<p class="hint">Medications, therapy, and the anticipated recovery trajectory.</p>

	<Field label="Current medications" inputId="currentMedications">
		<TextAreaInput id="currentMedications" label="Current medications" rows={2} bind:value={t.currentMedications} />
	</Field>

	<Field label="Ongoing therapy (physiotherapy / counselling / specialist follow-up)" inputId="ongoingTherapy">
		<TextAreaInput id="ongoingTherapy" label="Ongoing therapy" rows={2} bind:value={t.ongoingTherapy} />
	</Field>

	<Field label="Date of last consultation" inputId="lastConsultationDate">
		<DateInput id="lastConsultationDate" label="Date of last consultation" bind:value={t.lastConsultationDate} />
	</Field>

	<Field label="Anticipated recovery trajectory" inputId="recoveryTrajectory">
		<Select id="recoveryTrajectory" label="Anticipated recovery trajectory" bind:value={t.recoveryTrajectory}>
			<option value="">-- Select --</option>
			<option value="improving">Improving</option>
			<option value="stable">Stable</option>
			<option value="deteriorating">Deteriorating</option>
			<option value="uncertain">Uncertain</option>
		</Select>
	</Field>
</Fieldset>
