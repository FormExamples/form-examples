<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/assessment.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="4. Risk Factors">
	<p class="hint">Factors associated with hernia development and recurrence.</p>

	<Field label="Chronic cough" inputId="riskFactors-riskChronicCough">
		<Select id="riskFactors-riskChronicCough" label="Chronic cough" bind:value={d.riskFactors.riskChronicCough}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Constipation or straining" inputId="riskFactors-riskConstipationOrStraining">
		<Select id="riskFactors-riskConstipationOrStraining" label="Constipation or straining" bind:value={d.riskFactors.riskConstipationOrStraining}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Heavy-lifting occupation" inputId="riskFactors-riskHeavyLiftingOccupation">
		<Select id="riskFactors-riskHeavyLiftingOccupation" label="Heavy-lifting occupation" bind:value={d.riskFactors.riskHeavyLiftingOccupation}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Obesity" inputId="riskFactors-riskObesity">
		<Select id="riskFactors-riskObesity" label="Obesity" bind:value={d.riskFactors.riskObesity}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Smoking" inputId="riskFactors-riskSmoking">
		<Select id="riskFactors-riskSmoking" label="Smoking" bind:value={d.riskFactors.riskSmoking}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Family history" inputId="riskFactors-riskFamilyHistory">
		<Select id="riskFactors-riskFamilyHistory" label="Family history" bind:value={d.riskFactors.riskFamilyHistory}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior abdominal surgery" inputId="riskFactors-riskPriorAbdominalSurgery">
		<Select id="riskFactors-riskPriorAbdominalSurgery" label="Prior abdominal surgery" bind:value={d.riskFactors.riskPriorAbdominalSurgery}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Pregnancy" inputId="riskFactors-riskPregnancy">
		<Select id="riskFactors-riskPregnancy" label="Pregnancy" bind:value={d.riskFactors.riskPregnancy}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Connective-tissue disorder" inputId="riskFactors-riskConnectiveTissueDisorder">
		<Select id="riskFactors-riskConnectiveTissueDisorder" label="Connective-tissue disorder" bind:value={d.riskFactors.riskConnectiveTissueDisorder}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Ascites" inputId="riskFactors-riskAscites">
		<Select id="riskFactors-riskAscites" label="Ascites" bind:value={d.riskFactors.riskAscites}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Risk factors notes" inputId="riskFactors-riskFactorsNotes">
		<TextAreaInput id="riskFactors-riskFactorsNotes" label="Risk factors notes" rows={3} bind:value={d.riskFactors.riskFactorsNotes} />
	</Field>
</Fieldset>
