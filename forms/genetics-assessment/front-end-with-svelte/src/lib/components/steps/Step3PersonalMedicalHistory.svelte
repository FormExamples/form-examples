<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import ProbandCancerList from '#lib/components/ui/ProbandCancerList.svelte';

	const d = assessment.data.personalMedicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Personal Medical History">
	<p class="hint">The proband's own medical, oncologic and developmental history.</p>

	<Field label="Personal cancer history?">
		<RadioGroup label="Personal cancer history?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="personalCancerHistory" value={opt.value} bind:group={d.personalCancerHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.personalCancerHistory === 'yes'}
		<h3 class="mt-2 text-sm font-semibold text-base-content">Cancer diagnoses</h3>
		<ProbandCancerList bind:cancers={d.cancers} />
		<Field label="Has the proband had multiple primary cancers?">
			<RadioGroup label="Multiple primary cancers?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="multiplePrimaryCancers" value={opt.value} bind:group={d.multiplePrimaryCancers} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Congenital anomalies / birth defects?">
		<RadioGroup label="Congenital anomalies?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="congenitalAnomalies" value={opt.value} bind:group={d.congenitalAnomalies} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.congenitalAnomalies === 'yes'}
		<Field label="Details of congenital anomalies" inputId="congenitalAnomaliesDetails">
			<TextAreaInput id="congenitalAnomaliesDetails" label="Details of congenital anomalies" rows={2} bind:value={d.congenitalAnomaliesDetails} />
		</Field>
	{/if}

	<Field label="Developmental delay or intellectual disability?">
		<RadioGroup label="Developmental delay?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="developmentalDelay" value={opt.value} bind:group={d.developmentalDelay} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Prior therapeutic radiation exposure?">
		<RadioGroup label="Prior radiation?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="priorRadiation" value={opt.value} bind:group={d.priorRadiation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other significant medical history" inputId="otherSignificantHistory">
		<TextAreaInput
			id="otherSignificantHistory"
			label="Other significant medical history"
			rows={3}
			placeholder="Cardiac, neurologic, dermatologic, GI features relevant to genetics review…"
			bind:value={d.otherSignificantHistory}
		/>
	</Field>
</Fieldset>
