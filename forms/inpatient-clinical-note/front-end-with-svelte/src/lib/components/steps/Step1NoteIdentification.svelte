<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import * as options from '#lib/config/options.js';
	import { TOTAL_STEPS } from '#lib/config/steps.js';

	const h = assessment.data.header;
</script>

<Fieldset legend={`Step 1 of ${TOTAL_STEPS} — Note identification`}>
	<p class="hint">
		What kind of note this is, who is writing it, and when. The note type determines which
		components the completeness engine requires.
	</p>

	<Field
		label="Note type"
		description="Drives the required-component set: an admission clerking requires an examination and investigations; a progress note does not."
		required
		inputId="header-noteType"
	>
		<Select id="header-noteType" label="Note type" required bind:value={h.noteType}>
			<option value="">— Select —</option>
			{#each options.noteType as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Date and time of the note"
		description="When the clinical events occurred, which may differ from when you write the entry."
		required
		inputId="header-noteAt"
	>
		<TextInput
			id="header-noteAt"
			label="Date and time of the note"
			type="datetime-local"
			class="date-input"
			required
			bind:value={h.noteAt}
		/>
	</Field>

	<Field label="Author name" required inputId="header-authorName">
		<TextInput
			id="header-authorName"
			label="Author name"
			placeholder="e.g. Dr A. Okafor"
			required
			bind:value={h.authorName}
		/>
	</Field>

	<Field label="Author grade" required inputId="header-authorGrade">
		<Select id="header-authorGrade" label="Author grade" required bind:value={h.authorGrade}>
			<option value="">— Select —</option>
			{#each options.authorGrade as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Author registration number" inputId="header-authorRegistrationNumber">
		<TextInput
			id="header-authorRegistrationNumber"
			label="Author registration number"
			placeholder="GMC / NMC / HCPC / GPhC number"
			bind:value={h.authorRegistrationNumber}
		/>
	</Field>

	<Field label="Hospital" inputId="header-hospitalName">
		<TextInput id="header-hospitalName" label="Hospital" bind:value={h.hospitalName} />
	</Field>

	<Field label="Ward" inputId="header-wardName">
		<TextInput
			id="header-wardName"
			label="Ward"
			placeholder="e.g. Ward 12B, Acute Medical Unit"
			bind:value={h.wardName}
		/>
	</Field>

	<Field label="Bed" inputId="header-bedNumber">
		<TextInput id="header-bedNumber" label="Bed" placeholder="e.g. Bay 3, Bed 2" bind:value={h.bedNumber} />
	</Field>

	<Field label="Parent specialty" inputId="header-parentSpecialty">
		<TextInput
			id="header-parentSpecialty"
			label="Parent specialty"
			placeholder="Specialty the patient is under"
			bind:value={h.parentSpecialty}
		/>
	</Field>

	<Field label="Responsible consultant" inputId="header-responsibleConsultantName">
		<TextInput
			id="header-responsibleConsultantName"
			label="Responsible consultant"
			bind:value={h.responsibleConsultantName}
		/>
	</Field>

	<!--
		Note-type-specific fields. Shown only for the type they belong to, so the
		step stays short for the common progress note.
	-->
	{#if h.noteType === 'consult'}
		<Field label="Requesting team" inputId="header-consultRequestingTeam">
			<TextInput
				id="header-consultRequestingTeam"
				label="Requesting team"
				bind:value={h.consultRequestingTeam}
			/>
		</Field>

		<Field label="Consult question" inputId="header-consultQuestion">
			<TextAreaInput
				id="header-consultQuestion"
				label="Consult question"
				rows={2}
				placeholder="The clinical question the parent team asked."
				bind:value={h.consultQuestion}
			/>
		</Field>
	{/if}

	{#if h.noteType === 'procedure'}
		<Field
			label="Procedure performed"
			description="Bedside ward procedures only. Theatre procedures belong in the operation-note form."
			inputId="header-procedurePerformed"
		>
			<TextInput
				id="header-procedurePerformed"
				label="Procedure performed"
				placeholder="e.g. Ascitic drain insertion"
				bind:value={h.procedurePerformed}
			/>
		</Field>

		<Field label="Procedure detail" inputId="header-procedureDetail">
			<TextAreaInput
				id="header-procedureDetail"
				label="Procedure detail"
				rows={3}
				placeholder="Technique, site, equipment, and findings."
				bind:value={h.procedureDetail}
			/>
		</Field>

		<Field label="Consent basis" inputId="header-procedureConsent">
			<Select id="header-procedureConsent" label="Consent basis" bind:value={h.procedureConsent}>
				<option value="">— Select —</option>
				{#each options.procedureConsent as o (o.value)}
					<option value={o.value}>{o.label}</option>
				{/each}
			</Select>
		</Field>

		<Field label="Procedure complications" inputId="header-procedureComplications">
			<TextAreaInput
				id="header-procedureComplications"
				label="Procedure complications"
				rows={2}
				placeholder="Complications, or an explicit &quot;none&quot;."
				bind:value={h.procedureComplications}
			/>
		</Field>
	{/if}

	{#if h.noteType === 'transfer'}
		<Field label="Transfer from" inputId="header-transferFromWard">
			<TextInput id="header-transferFromWard" label="Transfer from" bind:value={h.transferFromWard} />
		</Field>

		<Field label="Transfer to" inputId="header-transferToWard">
			<TextInput id="header-transferToWard" label="Transfer to" bind:value={h.transferToWard} />
		</Field>

		<Field label="Transfer reason" inputId="header-transferReason">
			<TextAreaInput
				id="header-transferReason"
				label="Transfer reason"
				rows={2}
				bind:value={h.transferReason}
			/>
		</Field>
	{/if}
</Fieldset>
