<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const m = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Long-term health conditions and current medications.</p>

	<Field label="Do you have any heart or circulatory disease?">
		<RadioGroup label="Do you have any heart or circulatory disease?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="heartOrCirculatoryDisease" value={opt.value} bind:group={m.heartOrCirculatoryDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you ever had cancer?">
		<RadioGroup label="Have you ever had cancer?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cancer" value={opt.value} bind:group={m.cancer} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have a bleeding or clotting disorder?">
		<RadioGroup label="Do you have a bleeding or clotting disorder?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bleedingOrClottingDisorder" value={opt.value} bind:group={m.bleedingOrClottingDisorder} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have insulin-treated diabetes?">
		<RadioGroup label="Do you have insulin-treated diabetes?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diabetesOnInsulin" value={opt.value} bind:group={m.diabetesOnInsulin} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have a history of seizures or epilepsy?">
		<RadioGroup label="Do you have a history of seizures or epilepsy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="epilepsyOrSeizures" value={opt.value} bind:group={m.epilepsyOrSeizures} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Are you HIV positive?">
		<RadioGroup label="Are you HIV positive?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hivPositive" value={opt.value} bind:group={m.hivPositive} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you ever had hepatitis B or C?">
		<RadioGroup label="Have you ever had hepatitis B or C?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hepatitisBOrC" value={opt.value} bind:group={m.hepatitisBOrC} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you ever tested positive for HTLV?">
		<RadioGroup label="Have you ever tested positive for HTLV?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="htlv" value={opt.value} bind:group={m.htlv} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Does any blood relative have CJD or vCJD?">
		<RadioGroup label="Does any blood relative have CJD or vCJD?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cjdFamilyHistory" value={opt.value} bind:group={m.cjdFamilyHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you ever received human pituitary-derived hormone (e.g. growth hormone)?">
		<RadioGroup label="Have you ever received human pituitary-derived hormone (e.g. growth hormone)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="receivedPituitaryHormone" value={opt.value} bind:group={m.receivedPituitaryHormone} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you ever received a dura mater (brain covering) graft?">
		<RadioGroup label="Have you ever received a dura mater (brain covering) graft?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="receivedDuraMaterGraft" value={opt.value} bind:group={m.receivedDuraMaterGraft} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Current medications" description="List any prescription or regular medication you are currently taking.">
		<MedicationEntry bind:medications={m.currentMedications} />
	</Field>
</Fieldset>
