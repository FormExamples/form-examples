<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.family;
</script>

<Fieldset legend="Step 3 of 9 — Family and household">
	<p class="hint">
		Who cares for the child, who else is in the household, and who is already involved.
	</p>

	<Field label="Parents / carers with parental responsibility" inputId="family-carers">
		<TextAreaInput
			id="family-carers"
			label="Parents / carers with parental responsibility"
			rows={3}
			placeholder="Names, relationships, and contact details"
			bind:value={f.carers}
		/>
	</Field>

	<Field label="Other household members" inputId="family-householdMembers">
		<TextAreaInput
			id="family-householdMembers"
			label="Other household members"
			rows={3}
			placeholder="Other adults or children living at the address"
			bind:value={f.householdMembers}
		/>
	</Field>

	<Field
		label="Siblings / other children in the household"
		description="Other children who may also be affected."
		inputId="family-otherChildren"
	>
		<TextAreaInput
			id="family-otherChildren"
			label="Siblings / other children in the household"
			rows={3}
			placeholder="Names and ages of other children"
			bind:value={f.otherChildren}
		/>
	</Field>

	<Field label="Professionals already involved" inputId="family-professionalsInvolved">
		<TextAreaInput
			id="family-professionalsInvolved"
			label="Professionals already involved"
			rows={3}
			placeholder="e.g. GP, health visitor, existing social worker"
			bind:value={f.professionalsInvolved}
		/>
	</Field>
</Fieldset>
