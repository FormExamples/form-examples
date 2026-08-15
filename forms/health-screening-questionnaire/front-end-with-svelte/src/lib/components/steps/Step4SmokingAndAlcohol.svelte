<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { AUDIT_C_BINGE_FREQUENCY, AUDIT_C_FREQUENCY, AUDIT_C_TYPICAL_QUANTITY, OPTIONS } from '#lib/config/options.js';
	import { questionnaireStore } from '#lib/stores/questionnaire.svelte.js';

	const d = questionnaireStore.data;

	// The native <select> value is a string; the model stores a number.
	// These proxies keep the two in step without leaking strings into the engine.
	let auditCFrequencyProxy = $state(
		d.smokingAlcohol.auditCFrequency === null ? '' : String(d.smokingAlcohol.auditCFrequency)
	);
	$effect(() => {
		d.smokingAlcohol.auditCFrequency = auditCFrequencyProxy === '' ? null : Number(auditCFrequencyProxy);
	});
	let auditCTypicalQuantityProxy = $state(
		d.smokingAlcohol.auditCTypicalQuantity === null ? '' : String(d.smokingAlcohol.auditCTypicalQuantity)
	);
	$effect(() => {
		d.smokingAlcohol.auditCTypicalQuantity =
			auditCTypicalQuantityProxy === '' ? null : Number(auditCTypicalQuantityProxy);
	});
	let auditCBingeFrequencyProxy = $state(
		d.smokingAlcohol.auditCBingeFrequency === null ? '' : String(d.smokingAlcohol.auditCBingeFrequency)
	);
	$effect(() => {
		d.smokingAlcohol.auditCBingeFrequency =
			auditCBingeFrequencyProxy === '' ? null : Number(auditCBingeFrequencyProxy);
	});
</script>

<Fieldset legend="4. Lifestyle — Smoking and Alcohol">
	<p class="hint">
		AUDIT-C is the same three-item alcohol screen used elsewhere in this monorepo, scored 0 to 12.
	</p>

	<Field label="Smoking status" inputId="smokingAlcohol-smokingStatus">
		<Select id="smokingAlcohol-smokingStatus" label="Smoking status" bind:value={d.smokingAlcohol.smokingStatus}>
			<option value="">— Select —</option>
			{#each OPTIONS.smokingStatus as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cigarettes per day" inputId="smokingAlcohol-cigarettesPerDay">
		<NumberInput id="smokingAlcohol-cigarettesPerDay" label="Cigarettes per day" min={0} max={200}
			bind:value={d.smokingAlcohol.cigarettesPerDay} />
	</Field>
	<Field label="AUDIT-C: how often do you have a drink containing alcohol?" inputId="smokingAlcohol-auditCFrequency">
		<Select id="smokingAlcohol-auditCFrequency" label="AUDIT-C: how often do you have a drink containing alcohol?" bind:value={auditCFrequencyProxy}>
			<option value="">— Select —</option>
			{#each AUDIT_C_FREQUENCY as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="AUDIT-C: how many standard drinks on a typical drinking day?" inputId="smokingAlcohol-auditCTypicalQuantity">
		<Select id="smokingAlcohol-auditCTypicalQuantity" label="AUDIT-C: how many standard drinks on a typical drinking day?" bind:value={auditCTypicalQuantityProxy}>
			<option value="">— Select —</option>
			{#each AUDIT_C_TYPICAL_QUANTITY as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="AUDIT-C: how often do you have six or more drinks on one occasion?" inputId="smokingAlcohol-auditCBingeFrequency">
		<Select id="smokingAlcohol-auditCBingeFrequency" label="AUDIT-C: how often do you have six or more drinks on one occasion?" bind:value={auditCBingeFrequencyProxy}>
			<option value="">— Select —</option>
			{#each AUDIT_C_BINGE_FREQUENCY as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
