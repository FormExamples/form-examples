<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Review context">
	<p class="hint">Who is reviewing, when, where, and the review type.</p>

	<Field label="Reviewing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Reviewing clinician name"
			placeholder="e.g. Dr A. Rahman"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="gp">General practitioner</option>
			<option value="nurse">Practice / advanced nurse</option>
			<option value="pharmacist">Clinical pharmacist</option>
			<option value="nephrology">Nephrology team</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date of review" inputId="context-reviewedAt">
		<DateInput id="context-reviewedAt" label="Date of review" bind:value={c.reviewedAt} />
	</Field>

	<Field label="Care setting" inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="general-practice">General practice</option>
			<option value="long-term-conditions-clinic">Long-term-conditions clinic</option>
			<option value="community-nephrology">Community nephrology</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Review type" inputId="context-reviewType">
		<Select id="context-reviewType" label="Review type" bind:value={c.reviewType}>
			<option value="">— Select —</option>
			<option value="annual">Annual</option>
			<option value="interval">Interval</option>
			<option value="post-referral">Post-referral</option>
		</Select>
	</Field>
</Fieldset>
