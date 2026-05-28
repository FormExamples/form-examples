<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const mb = assessment.data.majorBleeding;
</script>

<Fieldset
	title="C — Major Bleeding"
	description="Catastrophic haemorrhage assessment and intervention."
>
	<h3 class="mb-2 text-base font-semibold text-gray-800">Assessment</h3>
	<Checkbox
		label="Normal — no major bleeding observed"
		name="mbNormal"
		bind:checked={mb.assessmentNormal}
	/>
	<TextAreaInput
		label="Findings (describe location, severity, mechanism)"
		name="mbFindings"
		bind:value={mb.assessmentFindings}
		rows={3}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-gray-800">Intervention</h3>
	<Checkbox
		label="Direct Pressure"
		name="mbDirectPressure"
		bind:checked={mb.interventions.directPressure}
	/>
	<Checkbox
		label="Deep Wound Packing"
		name="mbWoundPacking"
		bind:checked={mb.interventions.deepWoundPacking}
	/>
	<Checkbox
		label="Tourniquet (ONLY if life-threatening bleeding)"
		name="mbTourniquet"
		bind:checked={mb.interventions.tourniquet}
	/>
	{#if mb.interventions.tourniquet}
		<div class="-mt-2 mb-3 ml-6 rounded-lg border border-amber-300 bg-amber-50 p-3">
			<TextInput
				label="Time of tourniquet application"
				name="mbTourniquetTime"
				type="time"
				bind:value={mb.interventions.tourniquetApplicationTime}
				required
			/>
		</div>
	{/if}
	<Checkbox
		label="Uterine Massage"
		name="mbUterineMassage"
		bind:checked={mb.interventions.uterineMassage}
	/>
	<Checkbox label="None" name="mbNone" bind:checked={mb.interventions.none} />
</Fieldset>
