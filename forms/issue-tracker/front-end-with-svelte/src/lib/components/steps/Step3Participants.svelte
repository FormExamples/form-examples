<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const p = assessment.data.pt;
</script>

<Fieldset legend="Participants">
	<p class="hint">Who discovered the issue, who is affected, and who is involved.</p>

	<div class="field-grid">
		<Field label="Discoverer name" inputId="ptDiscovererName">
			<TextInput id="ptDiscovererName" label="Discoverer name" bind:value={p.ptDiscovererName} />
		</Field>
		<Field label="Affected users (count)" inputId="ptAffectedUsersCount">
			<NumberInput id="ptAffectedUsersCount" label="Affected users" min={0} bind:value={p.ptAffectedUsersCount} />
		</Field>
	</div>

	<Field label="Affected user groups" inputId="ptAffectedUserGroups">
		<TextInput id="ptAffectedUserGroups" label="Affected user groups" placeholder="e.g. Clinicians, external customers" bind:value={p.ptAffectedUserGroups} />
	</Field>

	<Field label="Assignees" inputId="ptAssignees">
		<TextInput id="ptAssignees" label="Assignees" bind:value={p.ptAssignees} />
	</Field>

	<Field label="Stakeholders to inform" inputId="ptStakeholdersToInform">
		<TextInput id="ptStakeholdersToInform" label="Stakeholders to inform" bind:value={p.ptStakeholdersToInform} />
	</Field>

	<Field label="Observers" inputId="ptObservers">
		<TextInput id="ptObservers" label="Observers" bind:value={p.ptObservers} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
