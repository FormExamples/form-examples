<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="14. Management Plan">
	<Field label="Management recommendation" inputId="management-managementRecommendation">
		<Select id="management-managementRecommendation" label="Management recommendation" bind:value={d.management.managementRecommendation}>
			<option value="">— Select —</option>
			{#each OPTIONS.managementRecommendation as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Eye(s) for surgery" inputId="management-eyeForSurgery">
		<Select id="management-eyeForSurgery" label="Eye(s) for surgery" bind:value={d.management.eyeForSurgery}>
			<option value="">— Select —</option>
			{#each OPTIONS.eyeChoice as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Risks and benefits counselled" inputId="management-risksBenefitsCounselled">
		<Select id="management-risksBenefitsCounselled" label="Risks and benefits counselled" bind:value={d.management.risksBenefitsCounselled}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Consent discussed" inputId="management-consentDiscussed">
		<Select id="management-consentDiscussed" label="Consent discussed" bind:value={d.management.consentDiscussed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Management notes" inputId="management-managementNotes">
		<TextAreaInput id="management-managementNotes" label="Management notes" rows={2} bind:value={d.management.managementNotes} />
	</Field>
</Fieldset>
