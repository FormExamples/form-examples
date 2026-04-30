<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import { epilepsyDeclarationRequired } from '$lib/engine/utils';

	const s = assessment.data.seizures;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<SectionCard
	title="Questions 4–6 — Seizures and epilepsy"
	description="Epileptic attacks are variably described and involve fits, convulsions or seizures. Epilepsy may also occur as auras (strange feelings or taste), absences or blank spells, or limb jerking. Episodes may occur when asleep or when awake."
>
	<RadioGroup
		label="Q4. Have you ever had any form of seizures or epileptic attacks?"
		name="hadSeizures"
		options={yesNo}
		bind:value={s.hadSeizures}
		required
	/>

	{#if s.hadSeizures === 'yes'}
		<RadioGroup
			label="If Yes, please indicate diagnosis"
			name="seizureDiagnosis"
			options={[
				{ value: 'first-ever', label: 'First ever seizure' },
				{
					value: 'more-than-one-or-epilepsy',
					label: 'More than one seizure ever, or epilepsy'
				}
			]}
			bind:value={s.diagnosis}
			required
		/>
	{/if}

	{#if s.hadSeizures === 'yes' && s.diagnosis === 'first-ever'}
		<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">
			Q5 — First ever seizure
		</h3>
		<TextInput
			label="Date of the seizure"
			name="firstEverDate"
			type="date"
			bind:value={s.firstEver.date}
			required
		/>
		<TextArea
			label="Please give details"
			name="firstEverDetails"
			bind:value={s.firstEver.details}
			rows={3}
		/>
	{/if}

	{#if s.hadSeizures === 'yes' && s.diagnosis === 'more-than-one-or-epilepsy'}
		<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">
			Q6 — More than one seizure or epilepsy
		</h3>

		<RadioGroup
			label="a) Have you ever had two or more seizures within a 5 year period?"
			name="twoOrMoreFiveYears"
			options={yesNo}
			bind:value={s.multiple.twoOrMoreWithinFiveYears}
			required
		/>

		<TextInput
			label="b) First awake seizure — date"
			name="firstAwake"
			type="date"
			bind:value={s.multiple.firstAwakeSeizureDate}
		/>
		<TextInput
			label="c) First asleep seizure — date"
			name="firstAsleep"
			type="date"
			bind:value={s.multiple.firstAsleepSeizureDate}
		/>

		<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
			<TextInput
				label="d) Last 2 awake seizures — date 1"
				name="lastAwake1"
				type="date"
				bind:value={s.multiple.lastTwoAwakeSeizureDate1}
			/>
			<TextInput
				label="d) Last 2 awake seizures — date 2"
				name="lastAwake2"
				type="date"
				bind:value={s.multiple.lastTwoAwakeSeizureDate2}
			/>
		</div>
		<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
			<TextInput
				label="e) Last 2 asleep seizures — date 1"
				name="lastAsleep1"
				type="date"
				bind:value={s.multiple.lastTwoAsleepSeizureDate1}
			/>
			<TextInput
				label="e) Last 2 asleep seizures — date 2"
				name="lastAsleep2"
				type="date"
				bind:value={s.multiple.lastTwoAsleepSeizureDate2}
			/>
		</div>

		<TextInput
			label="f) If both awake and sleep attacks: date of first sleep attack after last awake attack"
			name="firstSleepAfterLastAwake"
			type="date"
			bind:value={s.multiple.firstSleepAttackAfterLastAwakeAttackDate}
		/>

		<RadioGroup
			label="g) Have your seizures ever affected your level of consciousness?"
			name="affectedConsciousness"
			options={yesNo}
			bind:value={s.multiple.affectedConsciousness}
			required
		/>

		{#if s.multiple.affectedConsciousness === 'yes'}
			<RadioGroup
				label="h) Would your seizures ever have caused difficulty controlling a vehicle?"
				name="affectedDriving"
				options={yesNo}
				bind:value={s.multiple.wouldHaveAffectedDriving}
				required
			/>
		{/if}

		<TextArea
			label="Description of attack(s)"
			name="attackDescription"
			bind:value={s.multiple.attackDescription}
			rows={3}
		/>

		<RadioGroup
			label="i) Was your last seizure a result of advice from your doctor to stop, reduce, or change epilepsy medication?"
			name="resultOfMedicationAdvice"
			options={yesNo}
			bind:value={s.multiple.resultOfMedicationAdvice}
			required
		/>

		{#if s.multiple.resultOfMedicationAdvice === 'yes'}
			<TextInput
				label="j-i) Date started to reduce or change medication"
				name="medChangeDate"
				type="date"
				bind:value={s.multiple.dateMedicationStartedToReduce}
			/>
			<RadioGroup
				label="j-ii) Has the previously effective medication been restarted?"
				name="medRestarted"
				options={yesNo}
				bind:value={s.multiple.previousMedicationRestarted}
			/>
			{#if s.multiple.previousMedicationRestarted === 'yes'}
				<TextInput
					label="j-iii) Date previously effective medication was restarted"
					name="medRestartedDate"
					type="date"
					bind:value={s.multiple.datePreviousMedicationRestarted}
				/>
			{/if}
			<TextInput
				label="j-iv) Date of last seizure prior to medication withdrawal/reduction"
				name="lastSeizurePriorWithdrawal"
				type="date"
				bind:value={s.multiple.dateOfLastSeizurePriorToWithdrawal}
			/>
		{/if}

		<TextArea
			label="If the seizure was provoked, please describe the circumstances and the provoking factor"
			name="provokedDetails"
			bind:value={s.multiple.provokedSeizureDetails}
			rows={3}
		/>
	{/if}

	{#if epilepsyDeclarationRequired(assessment.data)}
		<div class="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4">
			<h3 class="mb-2 text-base font-semibold text-amber-900">Epilepsy declaration</h3>
			<p class="mb-3 text-sm text-amber-900">
				Because you have declared epilepsy or more than one lifetime seizure, you must
				accept this declaration before the DVLA can consider your application.
			</p>
			<Checkbox
				label="I agree to follow the advice of my doctor(s) about treatment for this condition; to attend, where necessary, appointments to monitor my condition; and to inform DVLA should I experience any further attacks."
				name="epilepsyDeclarationAccepted"
				bind:checked={s.epilepsyDeclaration.declarationAccepted}
			/>
			<TextInput
				label="Signed (full name)"
				name="epilepsySignedName"
				bind:value={s.epilepsyDeclaration.signedName}
				required
			/>
			<TextInput
				label="Date"
				name="epilepsySignatureDate"
				type="date"
				bind:value={s.epilepsyDeclaration.signatureDate}
				required
			/>
		</div>
	{/if}
</SectionCard>
