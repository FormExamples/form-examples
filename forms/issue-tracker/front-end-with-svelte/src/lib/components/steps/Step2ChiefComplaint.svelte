<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.cc;
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">A one-line summary plus the full description of the problem.</p>

	<Field label="Summary" required inputId="ccSummary" description="One sentence, max 500 characters.">
		<TextInput id="ccSummary" label="Summary" maxlength={500} required bind:value={c.ccSummary} />
	</Field>

	<Field label="Full description" inputId="ccLongDescription">
		<TextAreaInput id="ccLongDescription" label="Full description" rows={5} bind:value={c.ccLongDescription} />
	</Field>

	<Field label="Reported by (name)" inputId="ccReportedByName">
		<TextInput id="ccReportedByName" label="Reported by" bind:value={c.ccReportedByName} />
	</Field>

	<Field label="Reported via" inputId="ccReportedVia">
		<Select id="ccReportedVia" label="Reported via" bind:value={c.ccReportedVia}>
			<option value="">-- Select --</option>
			<option value="self">Self</option>
			<option value="colleague">Colleague</option>
			<option value="customer">Customer</option>
			<option value="monitoring-alert">Monitoring alert</option>
			<option value="ticket">Ticket</option>
			<option value="phone">Phone</option>
			<option value="email">Email</option>
			<option value="chat">Chat</option>
			<option value="in-person">In person</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
