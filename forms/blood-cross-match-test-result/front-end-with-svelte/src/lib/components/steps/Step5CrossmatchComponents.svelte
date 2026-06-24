<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Crossmatch & Components">
	<p class="hint">The crossmatch / compatibility outcome, the component, unit counts, and special requirements.</p>

	<Field label="Crossmatch result" inputId="crossmatchResult">
		<Select id="crossmatchResult" label="Crossmatch result" bind:value={d.crossmatchResult}>
			<option value="">Select…</option>
			<option value="compatible">Compatible</option>
			<option value="incompatible">Incompatible</option>
			<option value="electronic-issue">Electronic issue</option>
			<option value="not-performed">Not performed</option>
		</Select>
	</Field>

	<Field label="Component" inputId="component">
		<Select id="component" label="Component" bind:value={d.component}>
			<option value="">Select…</option>
			<option value="red-cells">Red cells</option>
			<option value="platelets">Platelets</option>
			<option value="fresh-frozen-plasma">Fresh frozen plasma</option>
			<option value="cryoprecipitate">Cryoprecipitate</option>
			<option value="none">None</option>
		</Select>
	</Field>

	<Field
		label="Units crossmatched"
		inputId="unitsCrossmatched"
		description="Number of units crossmatched / tested (0–50)."
	>
		<NumberInput
			id="unitsCrossmatched"
			label="Units crossmatched"
			min={0}
			max={50}
			step={1}
			bind:value={d.unitsCrossmatched}
		/>
	</Field>

	<Field
		label="Units available"
		inputId="unitsAvailable"
		description="Number of compatible units available for issue (0–50)."
	>
		<NumberInput
			id="unitsAvailable"
			label="Units available"
			min={0}
			max={50}
			step={1}
			bind:value={d.unitsAvailable}
		/>
	</Field>

	<Field
		label="Special requirements"
		inputId="specialRequirements"
		description="Special component requirements met or required (e.g. irradiated, CMV-negative, antigen-negative, washed)."
	>
		<TextAreaInput
			id="specialRequirements"
			label="Special requirements"
			rows={2}
			placeholder="e.g. irradiated, CMV-negative, K-negative…"
			bind:value={d.specialRequirements}
		/>
	</Field>

	{#if d.crossmatchResult === 'incompatible'}
		<Alert type="error" heading="Incompatible crossmatch">
			<p>
				An incompatible crossmatch auto-escalates the follow-up urgency to a critical alert. Do not
				issue; investigate and arrange serologically compatible units.
			</p>
		</Alert>
	{:else if d.unitsCrossmatched !== null && d.unitsAvailable !== null && d.unitsAvailable < d.unitsCrossmatched}
		<Alert type="warning" heading="Insufficient compatible units">
			<p>Fewer compatible units are available than were crossmatched. Order additional units as required.</p>
		</Alert>
	{/if}
</Fieldset>
