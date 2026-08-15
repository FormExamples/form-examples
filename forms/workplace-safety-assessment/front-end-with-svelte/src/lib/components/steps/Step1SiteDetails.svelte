<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import YesNoNA from '#lib/components/ui/YesNoNA.svelte';

	const d = assessment.data.siteDetails;
</script>

<Fieldset legend="Demographics & Site Details">
	<p class="hint">Identify the auditor, the site, and the scope of this audit.</p>

	<div class="field-grid">
		<Field label="Auditor name" required inputId="auditorName">
			<TextInput id="auditorName" label="Auditor name" required bind:value={d.auditorName} />
		</Field>
		<Field label="Auditor role" inputId="auditorRole">
			<TextInput id="auditorRole" label="Auditor role" bind:value={d.auditorRole} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Audit date" required inputId="auditDate">
			<DateInput id="auditDate" label="Audit date" required bind:value={d.auditDate} />
		</Field>
		<Field label="Previous audit date" inputId="previousAuditDate">
			<DateInput id="previousAuditDate" label="Previous audit date" bind:value={d.previousAuditDate} />
		</Field>
	</div>

	<Field label="Site name" required inputId="siteName">
		<TextInput id="siteName" label="Site name" required bind:value={d.siteName} />
	</Field>

	<Field label="Site address" inputId="siteAddress">
		<TextAreaInput id="siteAddress" label="Site address" rows={2} bind:value={d.siteAddress} />
	</Field>

	<div class="field-grid">
		<Field label="Department / area" inputId="departmentArea">
			<TextInput id="departmentArea" label="Department / area" bind:value={d.departmentArea} />
		</Field>
		<Field label="Site manager" inputId="siteManager">
			<TextInput id="siteManager" label="Site manager" bind:value={d.siteManager} />
		</Field>
	</div>

	<YesNoNA
		id="previousFindingsClosed"
		label="Findings from previous audit have been closed out."
		bind:value={d.previousFindingsClosed}
	/>
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
