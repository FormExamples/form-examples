<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { formState } from '$stores/formState.svelte';

	const d = formState.data;
</script>

<Fieldset legend="1. Reporter &amp; cycle" data-step="1">
	<Field label="Reporter name" inputId="reporterName" required>
		<TextInput id="reporterName" label="Reporter name" bind:value={d.reporter.name} required />
	</Field>

	<Field label="Reporter email" inputId="reporterEmail">
		<TextInput id="reporterEmail" type="email" label="Reporter email" bind:value={d.reporter.email} />
	</Field>

	<Field label="Reporter role" inputId="reporterRole">
		<TextInput id="reporterRole" label="Reporter role" bind:value={d.reporter.role} />
	</Field>

	<Field label="Level" inputId="cycleLevel">
		<Select id="cycleLevel" label="Level" bind:value={d.cycle.level}>
			<option value="">—</option>
			<option value="individual">individual</option>
			<option value="team">team</option>
			<option value="department">department</option>
			<option value="company">company</option>
		</Select>
	</Field>

	<Field label="Cycle" inputId="cycleCycle">
		<Select id="cycleCycle" label="Cycle" bind:value={d.cycle.cycle}>
			<option value="">—</option>
			<option value="monthly">monthly</option>
			<option value="quarterly">quarterly</option>
			<option value="half-yearly">half-yearly</option>
			<option value="annual">annual</option>
			<option value="custom">custom</option>
		</Select>
	</Field>

	<Field label="Cycle start date" inputId="cycleStartDate">
		<DateInput id="cycleStartDate" label="Cycle start date" bind:value={d.cycle.cycleStartDate} />
	</Field>

	<Field label="Cycle end date" inputId="cycleEndDate">
		<DateInput id="cycleEndDate" label="Cycle end date" bind:value={d.cycle.cycleEndDate} />
	</Field>
</Fieldset>
