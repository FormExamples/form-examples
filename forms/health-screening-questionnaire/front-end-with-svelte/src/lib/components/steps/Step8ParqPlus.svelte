<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { YES_NO } from '$lib/config/options';
	import { questionnaireStore } from '$lib/stores/questionnaire.svelte';

	const d = questionnaireStore.data;
</script>

<Fieldset legend="8. PAR-Q+ General Health Screen">
	<p class="hint">
		The 7-item PAR-Q+ Collaboration general health screen (2011 revision). All 7 "no" clears for
		general physical activity; any "yes" requires further assessment before starting — see
		doc/parq-plus-and-auditc.md for the deliberate scope simplification.
	</p>

	<Field label="1. Has a doctor ever diagnosed you with a heart condition?" inputId="parq-parqDiagnosedHeartCondition">
		<Select id="parq-parqDiagnosedHeartCondition" label="Has a doctor ever diagnosed you with a heart condition?" bind:value={d.parq.parqDiagnosedHeartCondition}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="2. Do you feel pain in your chest at rest?" inputId="parq-parqChestPainAtRest">
		<Select id="parq-parqChestPainAtRest" label="Do you feel pain in your chest at rest?" bind:value={d.parq.parqChestPainAtRest}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="3. Do you feel pain in your chest during, or caused by, physical activity in the last month?" inputId="parq-parqChestPainDuringActivity">
		<Select id="parq-parqChestPainDuringActivity" label="Do you feel pain in your chest during, or caused by, physical activity in the last month?" bind:value={d.parq.parqChestPainDuringActivity}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="4. Do you lose balance because of dizziness, or have you lost consciousness, in the last 12 months?" inputId="parq-parqDizzinessOrLossOfConsciousness">
		<Select id="parq-parqDizzinessOrLossOfConsciousness" label="Do you lose balance because of dizziness, or have you lost consciousness, in the last 12 months?" bind:value={d.parq.parqDizzinessOrLossOfConsciousness}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="5. Have you been diagnosed with another chronic medical condition?" inputId="parq-parqOtherChronicMedicalCondition">
		<Select id="parq-parqOtherChronicMedicalCondition" label="Have you been diagnosed with another chronic medical condition?" bind:value={d.parq.parqOtherChronicMedicalCondition}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="6. Are you currently taking prescribed medication for a chronic medical condition?" inputId="parq-parqPrescribedMedicationForChronicCondition">
		<Select id="parq-parqPrescribedMedicationForChronicCondition" label="Are you currently taking prescribed medication for a chronic medical condition?" bind:value={d.parq.parqPrescribedMedicationForChronicCondition}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="7. Do you have a bone, joint, or soft-tissue problem that could be made worse by becoming more physically active?" inputId="parq-parqBoneOrJointProblem">
		<Select id="parq-parqBoneOrJointProblem" label="Do you have a bone, joint, or soft-tissue problem that could be made worse by becoming more physically active?" bind:value={d.parq.parqBoneOrJointProblem}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
