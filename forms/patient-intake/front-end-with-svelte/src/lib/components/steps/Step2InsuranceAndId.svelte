<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const ins = assessment.data.insuranceAndId;
</script>

<Fieldset legend="Insurance & ID">
	<p class="hint">Insurance and identification details</p>
	<Field label="Insurance Provider" inputId="insuranceProvider"><TextInput id="insuranceProvider" label="Insurance Provider" bind:value={ins.insuranceProvider} /></Field>
	<Field label="Policy Number" inputId="policyNumber"><TextInput id="policyNumber" label="Policy Number" bind:value={ins.policyNumber} /></Field>
	<Field label="NHS Number" inputId="nhsNumber"><TextInput id="nhsNumber" label="NHS Number" placeholder="e.g. 943 476 5919" bind:value={ins.nhsNumber} /></Field>

	<div class="mt-4 border-t border-base-300 pt-4">
		<h3 class="mb-3 text-sm font-semibold text-base-content/70">GP Details</h3>
		<Field label="GP Name" inputId="gpName"><TextInput id="gpName" label="GP Name" bind:value={ins.gpName} /></Field>
		<Field label="GP Practice Name" inputId="gpPractice"><TextInput id="gpPractice" label="GP Practice Name" bind:value={ins.gpPracticeName} /></Field>
		<Field label="GP Phone" inputId="gpPhone"><TextInput id="gpPhone" label="GP Phone" bind:value={ins.gpPhone} /></Field>
	</div>
</Fieldset>
