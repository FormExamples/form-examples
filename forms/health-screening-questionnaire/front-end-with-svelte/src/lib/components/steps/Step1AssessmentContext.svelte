<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { questionnaireStore } from '#lib/stores/questionnaire.svelte.js';

	const d = questionnaireStore.data;
</script>

<Fieldset legend="1. Assessment Context">
	<p class="hint">
		What this screen is for, and who is conducting it. Step 10 (occupational factors) only appears
		when the purpose is occupational pre-placement.
	</p>

	<Field label="Screening purpose" inputId="context-screeningPurpose" required>
		<Select
			id="context-screeningPurpose"
			label="Screening purpose"
			bind:value={d.context.screeningPurpose}
			required
		>
			<option value="">— Select —</option>
			{#each OPTIONS.screeningPurpose as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Assessor name" inputId="assessor-name" required>
		<TextInput id="assessor-name" label="Assessor name" bind:value={d.assessor.name} required />
	</Field>
	<Field label="Assessor role" inputId="assessor-role">
		<Select id="assessor-role" label="Assessor role" bind:value={d.assessor.role}>
			<option value="">— Select —</option>
			{#each OPTIONS.assessorRole as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Employer" inputId="assessor-employer">
		<TextInput id="assessor-employer" label="Employer" bind:value={d.assessor.employer} />
	</Field>
	<Field label="Site" inputId="context-siteName">
		<TextInput id="context-siteName" label="Site" bind:value={d.context.siteName} />
	</Field>
	<Field label="Assessment date" inputId="context-assessmentDate" required
		description="Used to compute age for the paediatric safety flag.">
		<DateInput id="context-assessmentDate" label="Assessment date" bind:value={d.context.assessmentDate} required />
	</Field>
	<Field label="Assessment mode" inputId="context-assessmentMode">
		<Select id="context-assessmentMode" label="Assessment mode" bind:value={d.context.assessmentMode}>
			<option value="">— Select —</option>
			{#each OPTIONS.assessmentMode as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
