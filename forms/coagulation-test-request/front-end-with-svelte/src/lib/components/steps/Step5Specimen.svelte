<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const s = request.data.specimen;
</script>

<Fieldset legend="5. Specimen / Pre-analytical">
	<p class="hint">
		Sodium-citrate tube fill, 9:1 ratio, and analysis timing determine the pre-analytical band.
	</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Specimen collected" inputId="specimenCollected">
			<Select id="specimenCollected" label="Specimen collected" bind:value={s.specimenCollected}>
				<option value="">Select…</option>
				<option value="yes">Yes</option>
				<option value="no">No</option>
			</Select>
		</Field>
		<Field label="Collection date / time" inputId="collectionDatetime">
			<input
				id="collectionDatetime"
				class="date-input"
				type="datetime-local"
				aria-label="Collection date / time"
				bind:value={s.collectionDatetime}
			/>
		</Field>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Citrate tube fill" inputId="citrateTubeFill">
			<Select id="citrateTubeFill" label="Citrate tube fill" bind:value={s.citrateTubeFill}>
				<option value="">Select…</option>
				<option value="adequate">Adequate (filled to the line)</option>
				<option value="underfilled">Under-filled</option>
				<option value="overfilled">Over-filled</option>
			</Select>
		</Field>
		<Field label="9:1 blood-to-citrate ratio correct?" inputId="citrateRatioCorrect">
			<Select id="citrateRatioCorrect" label="9:1 blood-to-citrate ratio correct?" bind:value={s.citrateRatioCorrect}>
				<option value="">Select…</option>
				<option value="yes">Yes (9:1 confirmed)</option>
				<option value="no">No</option>
				<option value="unknown">Unknown</option>
			</Select>
		</Field>
	</div>

	{#if s.specimenCollected === 'yes' && (s.citrateTubeFill === 'underfilled' || s.citrateTubeFill === 'overfilled' || s.citrateRatioCorrect === 'no')}
		<Alert type="warning" heading="Reject-risk specimen">
			<p>
				A mis-filled sodium-citrate tube or an incorrect 9:1 ratio yields unreliable coagulation
				results. Reject and recollect.
			</p>
		</Alert>
	{/if}
</Fieldset>
