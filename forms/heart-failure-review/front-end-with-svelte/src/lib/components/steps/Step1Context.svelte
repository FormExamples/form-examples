<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 9 — Review context">
	<p class="hint">Who is reviewing, when, where, the review type, and the date of the last review.</p>

	<Field label="Reviewing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Reviewing clinician name"
			placeholder="e.g. Sister J. Okoro"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="gp">General practitioner</option>
			<option value="practice-nurse">Practice nurse</option>
			<option value="hf-nurse">Heart-failure specialist nurse</option>
			<option value="pharmacist">Clinical pharmacist</option>
			<option value="cardiologist">Cardiologist</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Review date" inputId="context-reviewDate">
		<DateInput id="context-reviewDate" label="Review date" bind:value={c.reviewDate} />
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="general-practice">General practice</option>
			<option value="community-hf-service">Community heart-failure service</option>
			<option value="hospital-clinic">Hospital clinic</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Review type" inputId="context-reviewType">
		<Select id="context-reviewType" label="Review type" bind:value={c.reviewType}>
			<option value="">— Select —</option>
			<option value="routine-annual">Routine annual</option>
			<option value="post-discharge">Post-discharge</option>
			<option value="medication-titration">Medication titration</option>
		</Select>
	</Field>

	<Field label="Date of last review" inputId="context-lastReviewDate">
		<DateInput id="context-lastReviewDate" label="Date of last review" bind:value={c.lastReviewDate} />
	</Field>
</Fieldset>
