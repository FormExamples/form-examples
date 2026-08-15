<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.uniformIDBadge;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Uniform & ID Badge" description="Uniform issue, ID badge, access card and locker.">
	<RadioGroup name="uniformRequired" label="Uniform required?" options={yesNo} bind:value={d.uniformRequired} />
	{#if d.uniformRequired === 'yes'}
		<div class="field-grid field-grid-3">
			<RadioGroup name="uniformOrdered" label="Uniform ordered?" options={yesNo} bind:value={d.uniformOrdered} />
			<RadioGroup name="uniformReceived" label="Uniform received?" options={yesNo} bind:value={d.uniformReceived} />
			<TextInput name="uniformSize" label="Uniform size" bind:value={d.uniformSize} />
		</div>
	{/if}

	<RadioGroup name="idBadgePhotoTaken" label="ID badge photo taken?" options={yesNo} bind:value={d.idBadgePhotoTaken} />
	<div class="field-grid">
		<RadioGroup name="idBadgeIssued" label="ID badge issued?" options={yesNo} bind:value={d.idBadgeIssued} />
		<TextInput name="idBadgeNumber" label="ID badge number" bind:value={d.idBadgeNumber} />
	</div>
	<div class="field-grid">
		<RadioGroup name="accessCardIssued" label="Access card issued?" options={yesNo} bind:value={d.accessCardIssued} />
		<TextInput name="accessCardAreas" label="Access card areas" bind:value={d.accessCardAreas} />
	</div>
	<div class="field-grid">
		<RadioGroup name="lockerAllocated" label="Locker allocated?" options={yesNo} bind:value={d.lockerAllocated} />
		<TextInput name="lockerNumber" label="Locker number" bind:value={d.lockerNumber} />
	</div>

	<TextAreaInput name="uniformIdNotes" label="Notes" rows={3} bind:value={d.uniformIdNotes} />
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
