<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.nearestRelative;
</script>

<Fieldset legend="Step 8 of 9 — Nearest relative / consultees">
	<p class="hint">The nearest-relative position and the AMHP consultation record.</p>

	<Field label="Nearest relative identified?" inputId="nearestRelative-nearestRelativeIdentified">
		<Select
			id="nearestRelative-nearestRelativeIdentified"
			label="Nearest relative identified?"
			bind:value={n.nearestRelativeIdentified}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Nearest relative consulted?"
		description="For Section 3, consult the nearest relative or record why it is not practicable."
		inputId="nearestRelative-nearestRelativeConsulted"
	>
		<Select
			id="nearestRelative-nearestRelativeConsulted"
			label="Nearest relative consulted?"
			bind:value={n.nearestRelativeConsulted}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="not-practicable">Not practicable</option>
		</Select>
	</Field>

	<Field
		label="Nearest relative objection (to a s3 application)"
		inputId="nearestRelative-nearestRelativeObjection"
	>
		<Select
			id="nearestRelative-nearestRelativeObjection"
			label="Nearest relative objection (to a s3 application)"
			bind:value={n.nearestRelativeObjection}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Consultation record" inputId="nearestRelative-consultationRecord">
		<TextAreaInput
			id="nearestRelative-consultationRecord"
			label="Consultation record"
			rows={3}
			placeholder="AMHP consultation notes."
			bind:value={n.consultationRecord}
		/>
	</Field>
</Fieldset>
