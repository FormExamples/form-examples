<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.planContext;
</script>

<Fieldset legend="Step 1 of 8 — Plan context">
	<p class="hint">Who is authoring the plan, when, in what setting, and the type of plan.</p>

	<Field label="Authoring nurse name" required inputId="context-nurseName">
		<TextInput
			id="context-nurseName"
			label="Authoring nurse name"
			placeholder="e.g. Sarah Okoro"
			required
			bind:value={c.nurseName}
		/>
	</Field>

	<Field label="Nurse role" required inputId="context-nurseRole">
		<Select id="context-nurseRole" label="Nurse role" required bind:value={c.nurseRole}>
			<option value="">— Select —</option>
			<option value="registered-nurse">Registered nurse</option>
			<option value="nursing-associate">Nursing associate</option>
			<option value="student-nurse">Student nurse</option>
		</Select>
	</Field>

	<Field label="Registration (NMC) number" inputId="context-nmcNumber">
		<TextInput
			id="context-nmcNumber"
			label="Registration (NMC) number"
			placeholder="e.g. 12A3456B"
			bind:value={c.nmcNumber}
		/>
	</Field>

	<Field label="Date and time" inputId="context-authoredAt">
		<TextInput
			id="context-authoredAt"
			label="Date and time"
			type="datetime-local"
			class="date-input"
			bind:value={c.authoredAt}
		/>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="hospital-ward">Hospital ward</option>
			<option value="community">Community / district nursing</option>
			<option value="care-home">Care home</option>
			<option value="hospice">Hospice</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Plan type" required inputId="context-planType">
		<Select id="context-planType" label="Plan type" required bind:value={c.planType}>
			<option value="">— Select —</option>
			<option value="admission">Admission</option>
			<option value="ongoing">Ongoing</option>
			<option value="discharge">Discharge</option>
		</Select>
	</Field>

	<Field label="Nursing model used" inputId="context-modelUsed">
		<TextInput
			id="context-modelUsed"
			label="Nursing model used"
			placeholder="e.g. Roper–Logan–Tierney"
			bind:value={c.modelUsed}
		/>
	</Field>
</Fieldset>
