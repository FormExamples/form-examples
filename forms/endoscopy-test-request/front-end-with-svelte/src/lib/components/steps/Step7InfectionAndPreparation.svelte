<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.infectionPrep;
</script>

<Fieldset legend="7. Infection and Preparation">
	<p class="hint">Infection-control flags, bowel preparation, sedation, and escort arrangements.</p>

	<Field label="Infection-control flags">
		<CheckboxGroup label="Infection-control flags">
			<label><CheckboxInput label="vCJD risk" bind:checked={d.vcjdRisk} /> vCJD risk</label>
			<label><CheckboxInput label="CPE carriage" bind:checked={d.cpeCarriage} /> CPE carriage</label>
			<label><CheckboxInput label="MRSA" bind:checked={d.mrsa} /> MRSA</label>
			<label><CheckboxInput label="Blood-borne virus" bind:checked={d.bloodBorneVirus} /> Blood-borne virus</label>
		</CheckboxGroup>
	</Field>

	<Field label="Fit for bowel preparation">
		<CheckboxGroup label="Fit for bowel preparation">
			<label>
				<CheckboxInput label="Fit for bowel preparation" bind:checked={d.fitForBowelPrep} />
				Fit for bowel preparation (lower-GI procedures)
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Bowel preparation agent" inputId="bowelPrepAgent">
		<Select id="bowelPrepAgent" label="Bowel preparation agent" bind:value={d.bowelPrepAgent}>
			<option value="">Not applicable / select…</option>
			<option value="split-dose-peg">Split-dose PEG</option>
			<option value="sodium-picosulfate">Sodium picosulfate</option>
			<option value="phosphate-enema">Phosphate enema</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Sedation" inputId="sedation">
		<Select id="sedation" label="Sedation" bind:value={d.sedation}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="throat-spray">Throat spray only</option>
			<option value="conscious-sedation">Conscious sedation</option>
			<option value="deep-sedation">Deep sedation</option>
			<option value="general-anaesthetic">General anaesthetic</option>
		</Select>
	</Field>

	<Field label="Escort">
		<CheckboxGroup label="Escort">
			<label>
				<CheckboxInput label="Escort available" bind:checked={d.escortAvailable} />
				Escort available for discharge after sedation
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
