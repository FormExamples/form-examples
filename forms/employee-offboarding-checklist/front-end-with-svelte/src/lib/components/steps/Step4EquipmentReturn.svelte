<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoRadio from '#lib/components/ui/YesNoRadio.svelte';

	const d = assessment.data.equipmentReturn;
</script>

<Fieldset legend="Equipment Return">
	<p class="hint">Confirm return of organisational equipment. Use N/A where an item was never issued.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Laptop returned">
			<YesNoRadio label="Laptop returned" name="laptopReturned" includeNa bind:value={d.laptopReturned} />
		</Field>
		<Field label="Laptop asset tag" inputId="laptopAssetTag">
			<TextInput id="laptopAssetTag" label="Laptop asset tag" bind:value={d.laptopAssetTag} />
		</Field>
		<Field label="Mobile phone returned">
			<YesNoRadio label="Mobile phone returned" name="mobilePhoneReturned" includeNa bind:value={d.mobilePhoneReturned} />
		</Field>
		<Field label="ID badge returned">
			<YesNoRadio label="ID badge returned" name="idBadgeReturned" includeNa bind:value={d.idBadgeReturned} />
		</Field>
		<Field label="Keys returned">
			<YesNoRadio label="Keys returned" name="keysReturned" includeNa bind:value={d.keysReturned} />
		</Field>
		<Field label="Uniform returned">
			<YesNoRadio label="Uniform returned" name="uniformReturned" includeNa bind:value={d.uniformReturned} />
		</Field>
		<Field label="Parking pass returned">
			<YesNoRadio label="Parking pass returned" name="parkingPassReturned" includeNa bind:value={d.parkingPassReturned} />
		</Field>
		<Field label="Other equipment returned">
			<YesNoRadio label="Other equipment returned" name="otherEquipmentReturned" includeNa bind:value={d.otherEquipmentReturned} />
		</Field>
	</div>

	{#if d.otherEquipmentReturned && d.otherEquipmentReturned !== 'na'}
		<Field label="Other equipment description" inputId="otherEquipmentDescription">
			<TextInput id="otherEquipmentDescription" label="Other equipment description" bind:value={d.otherEquipmentDescription} />
		</Field>
	{/if}

	<Field label="Notes" inputId="equipmentReturnNotes">
		<TextAreaInput id="equipmentReturnNotes" label="Notes" rows={3} bind:value={d.equipmentReturnNotes} />
	</Field>
</Fieldset>
