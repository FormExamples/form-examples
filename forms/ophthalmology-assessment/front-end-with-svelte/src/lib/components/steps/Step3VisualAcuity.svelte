<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const va = assessment.data.visualAcuity;
</script>

<Fieldset legend="Visual Acuity - Distance VA Right Eye">
	<div class="field-grid">
		<Field label="Uncorrected" inputId="distVaRightUncorrected"><TextInput id="distVaRightUncorrected" label="Uncorrected right" placeholder="e.g. 6/12" bind:value={va.distanceVaRightUncorrected} /></Field>
		<Field label="Best Corrected" inputId="distVaRightCorrected"><TextInput id="distVaRightCorrected" label="Best Corrected right" placeholder="e.g. 6/6" bind:value={va.distanceVaRightCorrected} /></Field>
	</div>
</Fieldset>

<Fieldset legend="Visual Acuity - Distance VA Left Eye">
	<div class="field-grid">
		<Field label="Uncorrected" inputId="distVaLeftUncorrected"><TextInput id="distVaLeftUncorrected" label="Uncorrected left" placeholder="e.g. 6/12" bind:value={va.distanceVaLeftUncorrected} /></Field>
		<Field label="Best Corrected" inputId="distVaLeftCorrected"><TextInput id="distVaLeftCorrected" label="Best Corrected left" placeholder="e.g. 6/6" bind:value={va.distanceVaLeftCorrected} /></Field>
	</div>
</Fieldset>

<Fieldset legend="Visual Acuity - Near VA">
	<div class="field-grid">
		<Field label="Right Eye" inputId="nearVaRight"><TextInput id="nearVaRight" label="Near VA Right" placeholder="e.g. N5" bind:value={va.nearVaRight} /></Field>
		<Field label="Left Eye" inputId="nearVaLeft"><TextInput id="nearVaLeft" label="Near VA Left" placeholder="e.g. N5" bind:value={va.nearVaLeft} /></Field>
	</div>
</Fieldset>

<Fieldset legend="Visual Acuity - Pinhole">
	<div class="field-grid">
		<Field label="Right Eye" inputId="pinholeRight"><TextInput id="pinholeRight" label="Pinhole right" placeholder="e.g. 6/6" bind:value={va.pinholeRight} /></Field>
		<Field label="Left Eye" inputId="pinholeLeft"><TextInput id="pinholeLeft" label="Pinhole left" placeholder="e.g. 6/6" bind:value={va.pinholeLeft} /></Field>
	</div>
</Fieldset>

<Fieldset legend="Refraction">
	<div class="field-grid">
		<Field label="Right Eye" inputId="refractionRight"><TextInput id="refractionRight" label="Refraction right" placeholder="e.g. -2.50/-1.00x180" bind:value={va.refractionRight} /></Field>
		<Field label="Left Eye" inputId="refractionLeft"><TextInput id="refractionLeft" label="Refraction left" placeholder="e.g. -2.00/-0.75x170" bind:value={va.refractionLeft} /></Field>
	</div>
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
