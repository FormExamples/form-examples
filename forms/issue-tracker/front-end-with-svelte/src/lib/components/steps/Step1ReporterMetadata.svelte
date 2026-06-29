<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const d = assessment.data.reporter;
</script>

<Fieldset legend="Reporter & Metadata">
	<p class="hint">Who is reporting the issue, and the context it occurred in.</p>

	<div class="field-grid">
		<Field label="Reporter name" required inputId="reporterName">
			<TextInput id="reporterName" label="Reporter name" required bind:value={d.reporterName} />
		</Field>
		<Field label="Reporter email" inputId="reporterEmail">
			<TextInput
				id="reporterEmail"
				label="Reporter email"
				type="email"
				placeholder="name@example.com"
				bind:value={d.reporterEmail}
			/>
		</Field>
	</div>

	<Field label="Reporter role" inputId="reporterRole">
		<TextInput id="reporterRole" label="Reporter role" placeholder="e.g. On-call engineer" bind:value={d.reporterRole} />
	</Field>

	<div class="field-grid">
		<Field label="Reported at" inputId="reportedAt">
			<DateInput id="reportedAt" label="Reported at" bind:value={d.reportedAt} />
		</Field>
		<Field label="Discovered at" inputId="discoveredAt">
			<DateInput id="discoveredAt" label="Discovered at" bind:value={d.discoveredAt} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Issue category" inputId="issueCategory">
			<Select id="issueCategory" label="Issue category" bind:value={d.issueCategory}>
				<option value="">-- Select --</option>
				<option value="software-defect">Software defect</option>
				<option value="service-outage">Service outage</option>
				<option value="performance">Performance</option>
				<option value="security">Security</option>
				<option value="data-protection">Data protection</option>
				<option value="clinical-safety">Clinical safety</option>
				<option value="workplace-safety">Workplace safety</option>
				<option value="medical-device">Medical device</option>
				<option value="regulatory">Regulatory</option>
				<option value="project-blocker">Project blocker</option>
				<option value="customer-complaint">Customer complaint</option>
				<option value="hardware-fault">Hardware fault</option>
				<option value="process">Process</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Environment" inputId="environment">
			<Select id="environment" label="Environment" bind:value={d.environment}>
				<option value="">-- Select --</option>
				<option value="dev">Development</option>
				<option value="test">Test</option>
				<option value="staging">Staging</option>
				<option value="production">Production</option>
				<option value="on-prem">On-premises</option>
				<option value="field">Field</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="System name" inputId="systemName">
			<TextInput id="systemName" label="System name" bind:value={d.systemName} />
		</Field>
		<Field label="Component" inputId="component">
			<TextInput id="component" label="Component" bind:value={d.component} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Customer / project tag" inputId="customerOrProjectTag">
			<TextInput id="customerOrProjectTag" label="Customer / project tag" bind:value={d.customerOrProjectTag} />
		</Field>
		<Field label="External reference" inputId="externalReference">
			<TextInput id="externalReference" label="External reference" placeholder="e.g. JIRA-123" bind:value={d.externalReference} />
		</Field>
	</div>
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
