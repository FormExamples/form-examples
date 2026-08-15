<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TeamMemberEntry from '#lib/components/ui/TeamMemberEntry.svelte';

	const d = assessment.data.surgicalTeam;
</script>

<Fieldset legend="Surgical Team">
	<p class="hint">Personnel responsible for the procedure.</p>

	<div class="field-grid">
		<Field label="Primary surgeon" required inputId="primarySurgeon">
			<TextInput id="primarySurgeon" label="Primary surgeon" required placeholder="e.g. Mr J. Smith" bind:value={d.primarySurgeon} />
		</Field>
		<Field label="Primary surgeon grade" inputId="primarySurgeonGrade">
			<TextInput id="primarySurgeonGrade" label="Primary surgeon grade" placeholder="e.g. Consultant" bind:value={d.primarySurgeonGrade} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Primary anaesthetist" inputId="primaryAnaesthetist">
			<TextInput id="primaryAnaesthetist" label="Primary anaesthetist" placeholder="e.g. Dr K. Chan" bind:value={d.primaryAnaesthetist} />
		</Field>
		<Field label="Primary anaesthetist grade" inputId="primaryAnaesthetistGrade">
			<TextInput id="primaryAnaesthetistGrade" label="Primary anaesthetist grade" placeholder="e.g. Consultant" bind:value={d.primaryAnaesthetistGrade} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Scrub nurse" inputId="scrubNurse">
			<TextInput id="scrubNurse" label="Scrub nurse" bind:value={d.scrubNurse} />
		</Field>
		<Field label="Circulating nurse" inputId="circulator">
			<TextInput id="circulator" label="Circulating nurse" bind:value={d.circulator} />
		</Field>
	</div>

	<Field label="Additional team members" description="Assistants, registrars, students, and other personnel present.">
		<TeamMemberEntry bind:members={d.additionalMembers} />
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
