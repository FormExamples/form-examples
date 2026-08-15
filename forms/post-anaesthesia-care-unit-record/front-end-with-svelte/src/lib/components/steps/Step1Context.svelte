<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 10 — Recovery context">
	<p class="hint">
		Who is recording, the supervising anaesthetist, when the patient was admitted to PACU, and the
		anaesthetic and procedure.
	</p>

	<Field label="Recording nurse name" required inputId="context-nurseName">
		<TextInput
			id="context-nurseName"
			label="Recording nurse name"
			placeholder="e.g. Sister J. Okafor"
			required
			bind:value={c.nurseName}
		/>
	</Field>

	<Field label="Recording staff role" required inputId="context-nurseRole">
		<Select id="context-nurseRole" label="Recording staff role" required bind:value={c.nurseRole}>
			<option value="">— Select —</option>
			<option value="recovery-nurse">Recovery nurse</option>
			<option value="odp">Operating-department practitioner</option>
			<option value="anaesthetist">Anaesthetist</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Supervising anaesthetist" inputId="context-anaesthetistName">
		<TextInput
			id="context-anaesthetistName"
			label="Supervising anaesthetist"
			placeholder="e.g. Dr A. Khan"
			bind:value={c.anaesthetistName}
		/>
	</Field>

	<Field label="Date and time of PACU admission" inputId="context-admittedAt">
		<TextInput
			id="context-admittedAt"
			label="Date and time of PACU admission"
			type="datetime-local"
			class="date-input"
			bind:value={c.admittedAt}
		/>
	</Field>

	<Field label="Anaesthetic technique" required inputId="context-anaestheticTechnique">
		<Select
			id="context-anaestheticTechnique"
			label="Anaesthetic technique"
			required
			bind:value={c.anaestheticTechnique}
		>
			<option value="">— Select —</option>
			<option value="general">General anaesthesia</option>
			<option value="regional">Regional anaesthesia</option>
			<option value="sedation">Procedural sedation</option>
			<option value="combined">Combined</option>
		</Select>
	</Field>

	<Field label="Operation or procedure" inputId="context-procedure">
		<TextInput
			id="context-procedure"
			label="Operation or procedure"
			placeholder="e.g. Laparoscopic cholecystectomy"
			bind:value={c.procedure}
		/>
	</Field>
</Fieldset>
