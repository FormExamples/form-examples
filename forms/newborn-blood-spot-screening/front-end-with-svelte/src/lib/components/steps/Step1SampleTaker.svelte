<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const s = assessment.data.sampleTaker;
</script>

<Fieldset legend="Step 1 of 7 — Sample-taker and setting">
	<p class="hint">Who is taking or recording the sample, and where.</p>

	<Field label="Sample-taker name" required inputId="sampleTaker-sampleTakerName">
		<TextInput
			id="sampleTaker-sampleTakerName"
			label="Sample-taker name"
			placeholder="e.g. J. Okonkwo"
			required
			bind:value={s.sampleTakerName}
		/>
	</Field>

	<Field label="Sample-taker role" required inputId="sampleTaker-sampleTakerRole">
		<Select
			id="sampleTaker-sampleTakerRole"
			label="Sample-taker role"
			required
			bind:value={s.sampleTakerRole}
		>
			<option value="">— Select —</option>
			<option value="midwife">Midwife</option>
			<option value="health-visitor">Health visitor</option>
			<option value="neonatal-nurse">Neonatal nurse</option>
			<option value="laboratory">Laboratory</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Care setting" required inputId="sampleTaker-careSetting">
		<Select id="sampleTaker-careSetting" label="Care setting" required bind:value={s.careSetting}>
			<option value="">— Select —</option>
			<option value="community">Community</option>
			<option value="home">Home</option>
			<option value="neonatal-unit">Neonatal unit</option>
			<option value="hospital">Hospital</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Record date" inputId="sampleTaker-recordDate">
		<DateInput id="sampleTaker-recordDate" label="Record date" bind:value={s.recordDate} />
	</Field>
</Fieldset>
