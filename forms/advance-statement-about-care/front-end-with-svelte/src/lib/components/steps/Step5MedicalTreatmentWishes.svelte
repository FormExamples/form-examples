<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const m = $state(assessment.data.medicalTreatmentWishes);
</script>

<Fieldset legend="Medical Treatment Wishes">
	<p class="hint">Your preferences about medical treatments. Note: these are wishes, not legally binding refusals (which require an Advance Decision to Refuse Treatment / ADRT).</p>
	<div class="mb-4 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
		<strong>Important:</strong> An advance statement records your wishes and preferences but is
		not the same as an Advance Decision to Refuse Treatment (ADRT), which is legally binding under
		the Mental Capacity Act 2005. Your care team must take these wishes into account but they are
		not legally obliged to follow them.
	</div>

	<Field label="Pain management preferences" inputId="painManagementPreferences"><TextAreaInput id="painManagementPreferences" label="Pain management preferences" rows={4} placeholder="e.g. I wish to be kept comfortable and pain-free, even if this may shorten my life..." bind:value={m.painManagementPreferences} /></Field>

	<Field label="Nutrition and hydration wishes" inputId="nutritionHydrationWishes"><TextAreaInput id="nutritionHydrationWishes" label="Nutrition and hydration wishes" rows={4} placeholder="Your wishes about eating, drinking, and artificial nutrition/hydration..." bind:value={m.nutritionHydrationWishes} /></Field>

	<Field label="Ventilation wishes" inputId="ventilationWishes"><TextAreaInput id="ventilationWishes" label="Ventilation wishes" rows={4} placeholder="Your wishes about mechanical ventilation or breathing support..." bind:value={m.ventilationWishes} /></Field>

	<Field label="Resuscitation wishes" inputId="resuscitationWishes"><TextAreaInput id="resuscitationWishes" label="Resuscitation wishes" rows={4} placeholder="Your wishes about CPR and resuscitation attempts. Remember: this is an expression of wishes, not a legally binding DNACPR order..." bind:value={m.resuscitationWishes} /></Field>

	<Field label="Antibiotics wishes" inputId="antibioticsWishes"><TextAreaInput id="antibioticsWishes" label="Antibiotics wishes" rows={3} placeholder="Your wishes about antibiotic treatment, e.g. for comfort only vs. to treat infections..." bind:value={m.antibioticsWishes} /></Field>

	<Field label="Hospitalisation wishes" inputId="hospitalisationWishes"><TextAreaInput id="hospitalisationWishes" label="Hospitalisation wishes" rows={3} placeholder="Your preferences about being admitted to hospital..." bind:value={m.hospitalisationWishes} /></Field>

	<Field label="Blood transfusion wishes" inputId="bloodTransfusionWishes"><TextAreaInput id="bloodTransfusionWishes" label="Blood transfusion wishes" rows={3} placeholder="Your wishes about receiving blood transfusions..." bind:value={m.bloodTransfusionWishes} /></Field>

	<Field label="Organ donation wishes" inputId="organDonationWishes"><TextAreaInput id="organDonationWishes" label="Organ donation wishes" rows={3} placeholder="Your wishes about organ donation..." bind:value={m.organDonationWishes} /></Field>
</Fieldset>
