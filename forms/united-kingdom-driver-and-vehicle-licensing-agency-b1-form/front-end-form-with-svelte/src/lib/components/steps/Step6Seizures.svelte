<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { epilepsyDeclarationRequired } from '$lib/engine/utils';

	const s = assessment.data.seizures;
</script>

<Fieldset legend="Questions 4–6 — Seizures and epilepsy">
	<p class="hint">
		Epileptic attacks are variably described and involve fits, convulsions or
		seizures. Epilepsy may also occur as auras (strange feelings or taste),
		absences or blank spells, or limb jerking. Episodes may occur when asleep
		or when awake.
	</p>

	<Field label="Q4. Have you ever had any form of seizures or epileptic attacks?" required>
		<RadioGroup label="Q4">
			<label><input type="radio" class="radio-input" name="hadSeizures" value="yes" bind:group={s.hadSeizures} required /> Yes</label>
			<label><input type="radio" class="radio-input" name="hadSeizures" value="no" bind:group={s.hadSeizures} required /> No</label>
		</RadioGroup>
	</Field>

	{#if s.hadSeizures === 'yes'}
		<Field label="If Yes, please indicate diagnosis" required>
			<RadioGroup label="Diagnosis">
				<label><input type="radio" class="radio-input" name="seizureDiagnosis" value="first-ever" bind:group={s.diagnosis} required /> First ever seizure</label>
				<label><input type="radio" class="radio-input" name="seizureDiagnosis" value="more-than-one-or-epilepsy" bind:group={s.diagnosis} required /> More than one seizure ever, or epilepsy</label>
			</RadioGroup>
		</Field>
	{/if}

	{#if s.hadSeizures === 'yes' && s.diagnosis === 'first-ever'}
		<h3 class="step-subhead">Q5 — First ever seizure</h3>
		<Field label="Date of the seizure" required inputId="firstEverDate">
			<DateInput id="firstEverDate" label="Date of seizure" required bind:value={s.firstEver.date} />
		</Field>
		<Field label="Please give details" inputId="firstEverDetails">
			<TextAreaInput id="firstEverDetails" label="Details" rows={3} bind:value={s.firstEver.details} />
		</Field>
	{/if}

	{#if s.hadSeizures === 'yes' && s.diagnosis === 'more-than-one-or-epilepsy'}
		<h3 class="step-subhead">Q6 — More than one seizure or epilepsy</h3>

		<Field label="a) Have you ever had two or more seizures within a 5 year period?" required>
			<RadioGroup label="Q6a">
				<label><input type="radio" class="radio-input" name="twoOrMoreFiveYears" value="yes" bind:group={s.multiple.twoOrMoreWithinFiveYears} required /> Yes</label>
				<label><input type="radio" class="radio-input" name="twoOrMoreFiveYears" value="no" bind:group={s.multiple.twoOrMoreWithinFiveYears} required /> No</label>
			</RadioGroup>
		</Field>

		<Field label="b) First awake seizure — date" inputId="firstAwake">
			<DateInput id="firstAwake" label="First awake seizure date" bind:value={s.multiple.firstAwakeSeizureDate} />
		</Field>
		<Field label="c) First asleep seizure — date" inputId="firstAsleep">
			<DateInput id="firstAsleep" label="First asleep seizure date" bind:value={s.multiple.firstAsleepSeizureDate} />
		</Field>

		<div class="field-grid">
			<Field label="d) Last 2 awake seizures — date 1" inputId="lastAwake1">
				<DateInput id="lastAwake1" label="Last awake date 1" bind:value={s.multiple.lastTwoAwakeSeizureDate1} />
			</Field>
			<Field label="d) Last 2 awake seizures — date 2" inputId="lastAwake2">
				<DateInput id="lastAwake2" label="Last awake date 2" bind:value={s.multiple.lastTwoAwakeSeizureDate2} />
			</Field>
		</div>
		<div class="field-grid">
			<Field label="e) Last 2 asleep seizures — date 1" inputId="lastAsleep1">
				<DateInput id="lastAsleep1" label="Last asleep date 1" bind:value={s.multiple.lastTwoAsleepSeizureDate1} />
			</Field>
			<Field label="e) Last 2 asleep seizures — date 2" inputId="lastAsleep2">
				<DateInput id="lastAsleep2" label="Last asleep date 2" bind:value={s.multiple.lastTwoAsleepSeizureDate2} />
			</Field>
		</div>

		<Field label="f) If both awake and sleep attacks: date of first sleep attack after last awake attack" inputId="firstSleepAfterLastAwake">
			<DateInput id="firstSleepAfterLastAwake" label="Date" bind:value={s.multiple.firstSleepAttackAfterLastAwakeAttackDate} />
		</Field>

		<Field label="g) Have your seizures ever affected your level of consciousness?" required>
			<RadioGroup label="Q6g">
				<label><input type="radio" class="radio-input" name="affectedConsciousness" value="yes" bind:group={s.multiple.affectedConsciousness} required /> Yes</label>
				<label><input type="radio" class="radio-input" name="affectedConsciousness" value="no" bind:group={s.multiple.affectedConsciousness} required /> No</label>
			</RadioGroup>
		</Field>

		{#if s.multiple.affectedConsciousness === 'yes'}
			<Field label="h) Would your seizures ever have caused difficulty controlling a vehicle?" required>
				<RadioGroup label="Q6h">
					<label><input type="radio" class="radio-input" name="affectedDriving" value="yes" bind:group={s.multiple.wouldHaveAffectedDriving} required /> Yes</label>
					<label><input type="radio" class="radio-input" name="affectedDriving" value="no" bind:group={s.multiple.wouldHaveAffectedDriving} required /> No</label>
				</RadioGroup>
			</Field>
		{/if}

		<Field label="Description of attack(s)" inputId="attackDescription">
			<TextAreaInput id="attackDescription" label="Description of attacks" rows={3} bind:value={s.multiple.attackDescription} />
		</Field>

		<Field label="i) Was your last seizure a result of advice from your doctor to stop, reduce, or change epilepsy medication?" required>
			<RadioGroup label="Q6i">
				<label><input type="radio" class="radio-input" name="resultOfMedicationAdvice" value="yes" bind:group={s.multiple.resultOfMedicationAdvice} required /> Yes</label>
				<label><input type="radio" class="radio-input" name="resultOfMedicationAdvice" value="no" bind:group={s.multiple.resultOfMedicationAdvice} required /> No</label>
			</RadioGroup>
		</Field>

		{#if s.multiple.resultOfMedicationAdvice === 'yes'}
			<Field label="j-i) Date started to reduce or change medication" inputId="medChangeDate">
				<DateInput id="medChangeDate" label="Date" bind:value={s.multiple.dateMedicationStartedToReduce} />
			</Field>
			<Field label="j-ii) Has the previously effective medication been restarted?">
				<RadioGroup label="Q6j-ii">
					<label><input type="radio" class="radio-input" name="medRestarted" value="yes" bind:group={s.multiple.previousMedicationRestarted} /> Yes</label>
					<label><input type="radio" class="radio-input" name="medRestarted" value="no" bind:group={s.multiple.previousMedicationRestarted} /> No</label>
				</RadioGroup>
			</Field>
			{#if s.multiple.previousMedicationRestarted === 'yes'}
				<Field label="j-iii) Date previously effective medication was restarted" inputId="medRestartedDate">
					<DateInput id="medRestartedDate" label="Date" bind:value={s.multiple.datePreviousMedicationRestarted} />
				</Field>
			{/if}
			<Field label="j-iv) Date of last seizure prior to medication withdrawal/reduction" inputId="lastSeizurePriorWithdrawal">
				<DateInput id="lastSeizurePriorWithdrawal" label="Date" bind:value={s.multiple.dateOfLastSeizurePriorToWithdrawal} />
			</Field>
		{/if}

		<Field label="If the seizure was provoked, please describe the circumstances and the provoking factor" inputId="provokedDetails">
			<TextAreaInput id="provokedDetails" label="Provoked details" rows={3} bind:value={s.multiple.provokedSeizureDetails} />
		</Field>
	{/if}

	{#if epilepsyDeclarationRequired(assessment.data)}
		<Alert type="warning" heading="Epilepsy declaration">
			<p>
				Because you have declared epilepsy or more than one lifetime seizure,
				you must accept this declaration before the DVLA can consider your
				application.
			</p>
			<label class="checkbox-row">
				<input type="checkbox" class="checkbox-input" name="epilepsyDeclarationAccepted" bind:checked={s.epilepsyDeclaration.declarationAccepted} />
				<span>
					I agree to follow the advice of my doctor(s) about treatment for this
					condition; to attend, where necessary, appointments to monitor my
					condition; and to inform DVLA should I experience any further attacks.
				</span>
			</label>
			<Field label="Signed (full name)" required inputId="epilepsySignedName">
				<TextInput id="epilepsySignedName" label="Signed (full name)" required bind:value={s.epilepsyDeclaration.signedName} />
			</Field>
			<Field label="Date" required inputId="epilepsySignatureDate">
				<DateInput id="epilepsySignatureDate" label="Date" required bind:value={s.epilepsyDeclaration.signatureDate} />
			</Field>
		</Alert>
	{/if}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	.step-subhead { font-size: 1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
	.checkbox-row {
		display: flex; align-items: flex-start; gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border-strong);
		border-radius: 0.375rem;
		background: var(--color-surface);
		margin: 0.5rem 0 0.75rem;
		cursor: pointer;
	}
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
