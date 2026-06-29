<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const pm = assessment.data.practicalMatters;
</script>

<Fieldset legend="Practical Matters">
	<p class="hint">Practical arrangements and wishes for your affairs</p>
	<Field label="Financial arrangements" inputId="financialArrangements"><TextAreaInput id="financialArrangements" label="Financial arrangements" rows={3} placeholder="e.g. Who manages your finances? Bank details location, direct debits..." bind:value={pm.financialArrangements} /></Field>

	<Field label="Property matters" inputId="propertyMatters"><TextAreaInput id="propertyMatters" label="Property matters" rows={3} placeholder="e.g. Ownership details, mortgage, keys location..." bind:value={pm.propertyMatters} /></Field>

	<Field label="Pet care instructions" inputId="petCareInstructions"><TextAreaInput id="petCareInstructions" label="Pet care instructions" rows={3} placeholder="Detailed instructions for ongoing pet care..." bind:value={pm.petCareInstructions} /></Field>

	<Field label="Social media wishes" inputId="socialMediaWishes"><TextAreaInput id="socialMediaWishes" label="Social media wishes" rows={2} placeholder="What should happen to your social media accounts?" bind:value={pm.socialMediaWishes} /></Field>

	<Field label="Personal belongings" inputId="personalBelongings"><TextAreaInput id="personalBelongings" label="Personal belongings" rows={3} placeholder="Any specific wishes about personal items, keepsakes, or belongings..." bind:value={pm.personalBelongings} /></Field>

	<Field label="Funeral wishes" inputId="funeralWishes"><TextAreaInput id="funeralWishes" label="Funeral wishes" rows={4} placeholder="Your preferences for funeral arrangements, burial vs cremation, service details..." bind:value={pm.funeralWishes} /></Field>

	<Field label="Will details" inputId="willDetails"><TextAreaInput id="willDetails" label="Will details" rows={3} placeholder="Where is your will held? Who is the executor? Solicitor details..." bind:value={pm.willDetails} /></Field>

	<Field label="Power of Attorney details" inputId="powerOfAttorneyDetails"><TextAreaInput id="powerOfAttorneyDetails" label="Power of Attorney details" rows={4} placeholder="Details of any Lasting Power of Attorney (health and welfare, or property and financial affairs)..." bind:value={pm.powerOfAttorneyDetails} /></Field>
</Fieldset>
