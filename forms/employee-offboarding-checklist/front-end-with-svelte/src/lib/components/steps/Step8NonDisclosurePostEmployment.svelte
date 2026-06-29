<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import YesNoRadio from '$lib/components/ui/YesNoRadio.svelte';

	const d = assessment.data.nonDisclosurePostEmployment;
</script>

<Fieldset legend="Non-Disclosure & Post-Employment">
	<p class="hint">Reaffirm confidentiality, restrictive covenants, IP assignment, and data return obligations.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Confidentiality reaffirmed">
			<YesNoRadio label="Confidentiality reaffirmed" name="confidentialityReaffirmed" bind:value={d.confidentialityReaffirmed} />
		</Field>
		<Field label="NDA signed">
			<YesNoRadio label="NDA signed" name="ndaSigned" bind:value={d.ndaSigned} />
		</Field>
		<Field label="Restrictive covenants explained">
			<YesNoRadio label="Restrictive covenants explained" name="restrictiveCovenantsExplained" bind:value={d.restrictiveCovenantsExplained} />
		</Field>
		<Field label="Restrictive covenants acknowledged">
			<YesNoRadio label="Restrictive covenants acknowledged" name="restrictiveCovenantsAcknowledged" bind:value={d.restrictiveCovenantsAcknowledged} />
		</Field>
		<Field label="Intellectual property assigned to employer">
			<YesNoRadio label="Intellectual property assigned to employer" name="intellectualPropertyAssigned" bind:value={d.intellectualPropertyAssigned} />
		</Field>
		<Field label="Organisational data returned or destroyed">
			<YesNoRadio label="Organisational data returned or destroyed" name="dataReturnedOrDestroyed" bind:value={d.dataReturnedOrDestroyed} />
		</Field>
		<Field label="Post-employment obligations explained">
			<YesNoRadio label="Post-employment obligations explained" name="postEmploymentObligationsExplained" bind:value={d.postEmploymentObligationsExplained} />
		</Field>
	</div>

	<Field label="Notes" inputId="ndaNotes">
		<TextAreaInput id="ndaNotes" label="Notes" rows={3} bind:value={d.ndaNotes} />
	</Field>
</Fieldset>
