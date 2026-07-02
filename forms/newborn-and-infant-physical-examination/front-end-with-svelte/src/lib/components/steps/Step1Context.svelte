<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 9 — Examination context">
	<p class="hint">Who is examining, when, the screening context, and the care setting.</p>

	<Field label="Examining practitioner name" required inputId="context-practitionerName">
		<TextInput
			id="context-practitionerName"
			label="Examining practitioner name"
			placeholder="e.g. J. Okonkwo"
			required
			bind:value={c.practitionerName}
		/>
	</Field>

	<Field label="Practitioner role" required inputId="context-practitionerRole">
		<Select
			id="context-practitionerRole"
			label="Practitioner role"
			required
			bind:value={c.practitionerRole}
		>
			<option value="">— Select —</option>
			<option value="midwife">Midwife</option>
			<option value="neonatal-nurse">Neonatal nurse</option>
			<option value="paediatrician">Paediatrician</option>
			<option value="gp">GP</option>
			<option value="nurse-practitioner">Nurse practitioner</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of examination" inputId="context-examinedAt">
		<TextInput
			id="context-examinedAt"
			label="Date and time of examination"
			type="datetime-local"
			class="date-input"
			bind:value={c.examinedAt}
		/>
	</Field>

	<Field label="Examination context" required inputId="context-examinationContext">
		<Select
			id="context-examinationContext"
			label="Examination context"
			required
			bind:value={c.examinationContext}
		>
			<option value="">— Select —</option>
			<option value="newborn-72h">Newborn — within 72 hours of birth</option>
			<option value="infant-6-8-week">Infant — 6-8 week review</option>
		</Select>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="maternity-ward">Maternity ward</option>
			<option value="neonatal-unit">Neonatal unit</option>
			<option value="community">Community / midwife-led clinic</option>
			<option value="gp-surgery">GP surgery</option>
			<option value="home">Home visit</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
