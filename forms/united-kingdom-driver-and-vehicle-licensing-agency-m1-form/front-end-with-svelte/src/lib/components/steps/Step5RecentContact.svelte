<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import YesNoQuestion from '$lib/components/ui/YesNoQuestion.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const r = assessment.data.recentContact;
	const stoppedAtQ1 = $derived(
		assessment.data.diagnosisConfirmation.hasMentalHealthDiagnosis === 'no'
	);
</script>

<Fieldset legend="Question 3 — Recent Contact">
	<p class="hint">Recent contact with your healthcare professional about your mental health condition.</p>

	{#if stoppedAtQ1}
		<Alert type="info">
			<p>
				You answered <strong>No</strong> to Question 1. The DVLA instructions ask you
				not to complete this question.
			</p>
		</Alert>
	{:else}
		<YesNoQuestion
			label="Have you had any contact (any phone, video or face-to-face consultation) with your healthcare professional about your mental health condition in the last 12 months?"
			name="hadRecentContact"
			bind:value={r.hadRecentContact}
		/>

		{#if r.hadRecentContact === 'yes'}
			<p class="hint">If yes, supply the last date of any contact (DD/MM/YYYY):</p>
			<Field label="Doctor — date last seen" inputId="doctorLastDate">
				<DateInput id="doctorLastDate" label="Doctor — date last seen" bind:value={r.doctorLastDate} />
			</Field>
			<Field label="Consultant — date last seen" inputId="consultantLastDate">
				<DateInput id="consultantLastDate" label="Consultant — date last seen" bind:value={r.consultantLastDate} />
			</Field>
			<Field label="Community psychiatric nurse — date last seen" inputId="cpnLastDate">
				<DateInput id="cpnLastDate" label="CPN — date last seen" bind:value={r.communityPsychiatricNurseLastDate} />
			</Field>
		{/if}
	{/if}
</Fieldset>
