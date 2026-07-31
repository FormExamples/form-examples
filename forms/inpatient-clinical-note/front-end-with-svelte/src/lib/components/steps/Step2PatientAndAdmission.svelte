<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import * as options from '$lib/config/options';
	import { TOTAL_STEPS } from '$lib/config/steps';

	const s = assessment.data.admission;
</script>

<Fieldset legend={`Step 2 of ${TOTAL_STEPS} — Patient and admission`}>
	<p class="hint">
		Who the patient is and when the admission episode began. Length of stay is derived from the
		admission and note timestamps.
	</p>

	<Field label="Patient name" inputId="admission-patientName">
		<TextInput
			id="admission-patientName"
			label="Patient name"
			placeholder="Full name as on the wristband"
			bind:value={s.patientName}
		/>
	</Field>

	<Field label="NHS number" inputId="admission-nhsNumber">
		<TextInput id="admission-nhsNumber" label="NHS number" placeholder="e.g. 943 476 5919" bind:value={s.nhsNumber} />
	</Field>

	<Field label="Hospital MRN" inputId="admission-hospitalMrn">
		<TextInput
			id="admission-hospitalMrn"
			label="Hospital MRN"
			placeholder="Local medical record number"
			bind:value={s.hospitalMrn}
		/>
	</Field>

	<Field label="Date of birth" inputId="admission-birthDate">
		<DateInput id="admission-birthDate" label="Date of birth" bind:value={s.birthDate} />
	</Field>

	<Field label="Sex" inputId="admission-sex">
		<Select id="admission-sex" label="Sex" bind:value={s.sex}>
			<option value="">— Select —</option>
			{#each options.sex as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Admission date and time" inputId="admission-admissionAt">
		<TextInput
			id="admission-admissionAt"
			label="Admission date and time"
			type="datetime-local"
			class="date-input"
			bind:value={s.admissionAt}
		/>
	</Field>

	<Field label="Admission method" inputId="admission-admissionMethod">
		<Select id="admission-admissionMethod" label="Admission method" bind:value={s.admissionMethod}>
			<option value="">— Select —</option>
			{#each options.admissionMethod as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Admitting specialty" inputId="admission-admittingSpecialty">
		<TextInput
			id="admission-admittingSpecialty"
			label="Admitting specialty"
			bind:value={s.admittingSpecialty}
		/>
	</Field>

	<Field label="Reason for admission" inputId="admission-admissionReason">
		<TextAreaInput
			id="admission-admissionReason"
			label="Reason for admission"
			rows={3}
			placeholder="Presenting problem or reason for admission."
			bind:value={s.admissionReason}
		/>
	</Field>
</Fieldset>
