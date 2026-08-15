<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.disposition;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset
	title="Disposition"
	description="Handover details, final vital signs, and provider sign-off."
>
	<TextAreaInput
		label="Disposition"
		name="disposition"
		bind:value={d.disposition}
		rows={2}
		placeholder="e.g. Handed over to ED triage, transferred to OT, refused transport, etc."
		required
	/>

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Handover</h3>
	<TextInput
		label="Handover time (24h)"
		name="handoverTime"
		type="time"
		bind:value={d.handoverTime}
		required
	/>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<TextInput
			label="Handover to (name)"
			name="handoverToName"
			bind:value={d.handoverToName}
			required
		/>
		<TextInput
			label="Handover to (cadre)"
			name="handoverToCadre"
			bind:value={d.handoverToCadre}
		/>
	</div>
	<TextInput
		label="Handover to (signature)"
		name="handoverToSignature"
		bind:value={d.handoverToSignature}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Vitals at handover</h3>
	<TextInput
		label="Time (24h)"
		name="finalVitalsTime"
		type="time"
		bind:value={d.finalVitals.time}
	/>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<NumberInput
			label="HR"
			name="finalHr"
			bind:value={d.finalVitals.hr}
			unit="bpm"
			min={0}
			max={300}
		/>
		<NumberInput
			label="RR"
			name="finalRr"
			bind:value={d.finalVitals.rr}
			unit="/min"
			min={0}
			max={80}
		/>
		<NumberInput
			label="Temp"
			name="finalTemp"
			bind:value={d.finalVitals.tempC}
			unit="°C"
			step={0.1}
			min={25}
			max={45}
		/>
		<TextInput
			label="BP"
			name="finalBp"
			bind:value={d.finalVitals.bp}
			placeholder="120/80"
		/>
		<NumberInput
			label="SpO2"
			name="finalSpo2"
			bind:value={d.finalVitals.spo2}
			unit="%"
			min={0}
			max={100}
		/>
		<TextInput
			label="SpO2 on (e.g. RA, NC 2L)"
			name="finalSpo2On"
			bind:value={d.finalVitals.spo2OnOxygen}
		/>
	</div>

	<RadioGroup
		label="Plan discussed with patient?"
		name="planDiscussedWithPatient"
		options={yesNo}
		bind:value={d.planDiscussedWithPatient}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Provider sign-off</h3>
	<TextInput
		label="Provider(s) name"
		name="providerName"
		bind:value={d.providerName}
		required
	/>
	<TextInput
		label="Provider(s) signature"
		name="providerSignature"
		bind:value={d.providerSignature}
		required
	/>
	<TextInput
		label="Signature date"
		name="providerSignatureDate"
		type="date"
		bind:value={d.providerSignatureDate}
		required
	/>
</Fieldset>
