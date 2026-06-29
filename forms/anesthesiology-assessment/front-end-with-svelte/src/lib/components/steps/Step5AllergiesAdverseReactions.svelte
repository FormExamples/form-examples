<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import AllergyEntry from '$lib/components/ui/AllergyEntry.svelte';
	import YesNoField from '$lib/components/ui/YesNoField.svelte';

	const a = assessment.data.allergies;
</script>

<Fieldset legend="Allergies & Adverse Reactions">
	<p class="hint">
		Document all allergies. Anaphylaxis history and latex allergy raise safety-critical flags.
	</p>

	<Field label="Allergies">
		<AllergyEntry bind:allergies={a.list} />
	</Field>

	<YesNoField label="Known latex allergy?" name="latexAllergy" bind:value={a.latexAllergy} />
</Fieldset>
