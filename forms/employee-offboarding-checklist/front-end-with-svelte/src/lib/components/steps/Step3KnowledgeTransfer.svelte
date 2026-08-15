<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoRadio from '#lib/components/ui/YesNoRadio.svelte';

	const d = assessment.data.knowledgeTransfer;
</script>

<Fieldset legend="Knowledge Transfer">
	<p class="hint">Confirm handover of work, contacts, and clinical caseload to protect service continuity.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Successor / recipient identified">
			<YesNoRadio label="Successor / recipient identified" name="successorIdentified" bind:value={d.successorIdentified} />
		</Field>
		<Field label="Successor name" inputId="successorName">
			<TextInput id="successorName" label="Successor name" bind:value={d.successorName} />
		</Field>
		<Field label="Handover document created">
			<YesNoRadio label="Handover document created" name="handoverDocumentCreated" bind:value={d.handoverDocumentCreated} />
		</Field>
		<Field label="Handover meetings held">
			<YesNoRadio label="Handover meetings held" name="handoverMeetingsHeld" bind:value={d.handoverMeetingsHeld} />
		</Field>
		<Field label="Work-in-progress documented">
			<YesNoRadio label="Work-in-progress documented" name="workInProgressDocumented" bind:value={d.workInProgressDocumented} />
		</Field>
		<Field label="Key contacts shared">
			<YesNoRadio label="Key contacts shared" name="keyContactsShared" bind:value={d.keyContactsShared} />
		</Field>
		<Field label="SOPs / files transferred">
			<YesNoRadio label="SOPs / files transferred" name="sopFilesTransferred" bind:value={d.sopFilesTransferred} />
		</Field>
		<Field label="Clinical caseload reassigned">
			<YesNoRadio label="Clinical caseload reassigned" name="clinicalCaseloadReassigned" bind:value={d.clinicalCaseloadReassigned} />
		</Field>
	</div>

	<Field label="Notes" inputId="knowledgeTransferNotes">
		<TextAreaInput id="knowledgeTransferNotes" label="Notes" rows={3} bind:value={d.knowledgeTransferNotes} />
	</Field>
</Fieldset>
