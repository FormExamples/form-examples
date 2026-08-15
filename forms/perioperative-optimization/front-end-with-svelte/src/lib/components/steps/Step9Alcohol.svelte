<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;

	// The native <select> value is a string; the model stores a number.
	// These proxies keep the two in step without leaking strings into the engine.
	let auditCFrequencyProxy = $state(d.alcohol.auditCFrequency === null ? '' : String(d.alcohol.auditCFrequency));
	$effect(() => {
		d.alcohol.auditCFrequency = auditCFrequencyProxy === '' ? null : Number(auditCFrequencyProxy);
	});
	let auditCTypicalQuantityProxy = $state(d.alcohol.auditCTypicalQuantity === null ? '' : String(d.alcohol.auditCTypicalQuantity));
	$effect(() => {
		d.alcohol.auditCTypicalQuantity = auditCTypicalQuantityProxy === '' ? null : Number(auditCTypicalQuantityProxy);
	});
	let auditCBingeFrequencyProxy = $state(d.alcohol.auditCBingeFrequency === null ? '' : String(d.alcohol.auditCBingeFrequency));
	$effect(() => {
		d.alcohol.auditCBingeFrequency = auditCBingeFrequencyProxy === '' ? null : Number(auditCBingeFrequencyProxy);
	});
</script>

<Fieldset legend="9. Alcohol and Other Substances">
	<p class="hint">Domain 4. AUDIT-C is the three-item consumption subset, scored 0 to 12.</p>

	<Field label="Alcohol (units/week)" inputId="alcohol-alcoholUnitsPerWeek" description="Above 14 triggers the domain.">
		<NumberInput id="alcohol-alcoholUnitsPerWeek" label="Alcohol (units/week)" min={0} max={300} step="0.1" bind:value={d.alcohol.alcoholUnitsPerWeek} />
	</Field>
	<Field label="AUDIT-C: how often do you have a drink containing alcohol?" inputId="alcohol-auditCFrequency">
		<Select id="alcohol-auditCFrequency" label="AUDIT-C: how often do you have a drink containing alcohol?" bind:value={auditCFrequencyProxy}>
			<option value="">— Select —</option>
			{#each OPTIONS.auditCFrequency as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="AUDIT-C: how many standard drinks on a typical drinking day?" inputId="alcohol-auditCTypicalQuantity">
		<Select id="alcohol-auditCTypicalQuantity" label="AUDIT-C: how many standard drinks on a typical drinking day?" bind:value={auditCTypicalQuantityProxy}>
			<option value="">— Select —</option>
			{#each OPTIONS.auditCQuantity as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="AUDIT-C: how often do you have six or more drinks on one occasion?" inputId="alcohol-auditCBingeFrequency">
		<Select id="alcohol-auditCBingeFrequency" label="AUDIT-C: how often do you have six or more drinks on one occasion?" bind:value={auditCBingeFrequencyProxy}>
			<option value="">— Select —</option>
			{#each OPTIONS.auditCBinge as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Dependence features" inputId="alcohol-alcoholDependenceFeatures">
		<Select id="alcohol-alcoholDependenceFeatures" label="Dependence features" bind:value={d.alcohol.alcoholDependenceFeatures}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Reduction plan agreed" inputId="alcohol-alcoholReductionPlanAgreed">
		<Select id="alcohol-alcoholReductionPlanAgreed" label="Reduction plan agreed" bind:value={d.alcohol.alcoholReductionPlanAgreed}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Alcohol services referral" inputId="alcohol-alcoholServicesReferral">
		<Select id="alcohol-alcoholServicesReferral" label="Alcohol services referral" bind:value={d.alcohol.alcoholServicesReferral}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Recreational drug use" inputId="alcohol-recreationalDrugUse">
		<Select id="alcohol-recreationalDrugUse" label="Recreational drug use" bind:value={d.alcohol.recreationalDrugUse}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Which drugs" inputId="alcohol-recreationalDrugDetail">
		<TextInput id="alcohol-recreationalDrugDetail" label="Which drugs" bind:value={d.alcohol.recreationalDrugDetail} />
	</Field>
	<Field label="Alcohol notes" inputId="alcohol-alcoholNotes">
		<TextAreaInput id="alcohol-alcoholNotes" label="Alcohol notes" rows={2} bind:value={d.alcohol.alcoholNotes} />
	</Field>
</Fieldset>
