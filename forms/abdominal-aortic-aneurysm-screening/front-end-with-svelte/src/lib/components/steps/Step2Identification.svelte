<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 6 — Patient identification and eligibility">
	<p class="hint">The patient identifier, age and sex, and how they entered the screening programme.</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="NHS number or local identifier"
			required
			bind:value={i.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age (years)"
		description="The programme routinely invites men in the year they turn 65."
		inputId="identification-age"
	>
		<NumberInput id="identification-age" label="Age" min={0} max={120} step={1} bind:value={i.age} />
	</Field>

	<Field label="Sex" inputId="identification-sex">
		<Select id="identification-sex" label="Sex" bind:value={i.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Eligibility route" inputId="identification-eligibilityRoute">
		<Select
			id="identification-eligibilityRoute"
			label="Eligibility route"
			bind:value={i.eligibilityRoute}
		>
			<option value="">— Select —</option>
			<option value="routine-year-of-65">Routine — year of 65 invitation</option>
			<option value="self-referral-over-65">Self-referral — over 65</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Scan type" inputId="identification-scanType">
		<Select id="identification-scanType" label="Scan type" bind:value={i.scanType}>
			<option value="">— Select —</option>
			<option value="first-scan">First scan</option>
			<option value="surveillance-rescan">Surveillance re-scan</option>
		</Select>
	</Field>
</Fieldset>
