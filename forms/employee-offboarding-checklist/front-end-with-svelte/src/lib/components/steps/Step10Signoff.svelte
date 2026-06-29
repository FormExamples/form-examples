<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import YesNoRadio from '$lib/components/ui/YesNoRadio.svelte';

	const d = assessment.data.signoff;
</script>

<Fieldset legend="Sign-off">
	<p class="hint">Final countersignatures from HR, the line manager, and IT, plus employee acknowledgement.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="HR signed off">
			<YesNoRadio label="HR signed off" name="hrSignedOff" bind:value={d.hrSignedOff} />
		</Field>
		<Field label="HR sign-off name" inputId="hrSignOffName">
			<TextInput id="hrSignOffName" label="HR sign-off name" bind:value={d.hrSignOffName} />
		</Field>
		<Field label="HR sign-off date" inputId="hrSignOffDate">
			<DateInput id="hrSignOffDate" label="HR sign-off date" bind:value={d.hrSignOffDate} />
		</Field>
		<Field label="Line manager signed off">
			<YesNoRadio label="Line manager signed off" name="lineManagerSignedOff" bind:value={d.lineManagerSignedOff} />
		</Field>
		<Field label="Line manager sign-off name" inputId="lineManagerSignOffName">
			<TextInput id="lineManagerSignOffName" label="Line manager sign-off name" bind:value={d.lineManagerSignOffName} />
		</Field>
		<Field label="Line manager sign-off date" inputId="lineManagerSignOffDate">
			<DateInput id="lineManagerSignOffDate" label="Line manager sign-off date" bind:value={d.lineManagerSignOffDate} />
		</Field>
		<Field label="IT signed off">
			<YesNoRadio label="IT signed off" name="itSignedOff" bind:value={d.itSignedOff} />
		</Field>
		<Field label="IT sign-off name" inputId="itSignOffName">
			<TextInput id="itSignOffName" label="IT sign-off name" bind:value={d.itSignOffName} />
		</Field>
		<Field label="IT sign-off date" inputId="itSignOffDate">
			<DateInput id="itSignOffDate" label="IT sign-off date" bind:value={d.itSignOffDate} />
		</Field>
		<Field label="Employee acknowledged offboarding">
			<YesNoRadio label="Employee acknowledged offboarding" name="employeeAcknowledged" bind:value={d.employeeAcknowledged} />
		</Field>
		<Field label="Employee sign-off date" inputId="employeeSignOffDate">
			<DateInput id="employeeSignOffDate" label="Employee sign-off date" bind:value={d.employeeSignOffDate} />
		</Field>
	</div>

	<Field label="Notes" inputId="signoffNotes">
		<TextAreaInput id="signoffNotes" label="Notes" rows={3} bind:value={d.signoffNotes} />
	</Field>
</Fieldset>
