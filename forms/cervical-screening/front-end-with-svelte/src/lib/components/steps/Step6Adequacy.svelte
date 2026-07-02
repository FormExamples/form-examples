<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const a = assessment.data.adequacy;
</script>

<Fieldset legend="Step 6 of 9 — Sample adequacy">
	<p class="hint">
		An inadequate sample is never HPV-classified; it is repeated in ~3 months (three consecutive
		inadequate samples escalate to colposcopy).
	</p>

	<Field label="Sample adequacy" inputId="adequacy-sampleAdequacy">
		<Select id="adequacy-sampleAdequacy" label="Sample adequacy" bind:value={a.sampleAdequacy}>
			<option value="">— Select —</option>
			<option value="adequate">Adequate</option>
			<option value="inadequate">Inadequate / unsatisfactory</option>
		</Select>
	</Field>

	{#if a.sampleAdequacy === 'inadequate'}
		<Field label="Reason inadequate" inputId="adequacy-inadequateReason">
			<Select
				id="adequacy-inadequateReason"
				label="Reason inadequate"
				bind:value={a.inadequateReason}
			>
				<option value="">— Select —</option>
				<option value="insufficient-cells">Insufficient cells</option>
				<option value="obscuring-blood">Obscuring blood</option>
				<option value="inflammation">Inflammation</option>
				<option value="labelling">Labelling error</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}
</Fieldset>
