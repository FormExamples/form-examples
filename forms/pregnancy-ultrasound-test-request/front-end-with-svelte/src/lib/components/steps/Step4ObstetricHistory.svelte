<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="4. Obstetric History">
	<p class="hint">Gravida / para, plurality, conception, and rhesus status.</p>

	<Field label="Gravida" inputId="gravida">
		<NumberInput id="gravida" label="Gravida" min={0} max={30} bind:value={d.history.gravida} />
	</Field>

	<Field label="Para" inputId="para">
		<NumberInput id="para" label="Para" min={0} max={30} bind:value={d.history.para} />
	</Field>

	<Field label="Plurality" inputId="plurality">
		<Select id="plurality" label="Plurality" bind:value={d.history.plurality}>
			<option value="">Select…</option>
			<option value="singleton">Singleton</option>
			<option value="twin">Twin</option>
			<option value="triplet">Triplet</option>
			<option value="higher-order">Higher-order</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Chorionicity" inputId="chorionicity">
		<Select id="chorionicity" label="Chorionicity" bind:value={d.history.chorionicity}>
			<option value="">Select…</option>
			<option value="dichorionic-diamniotic">Dichorionic diamniotic</option>
			<option value="monochorionic-diamniotic">Monochorionic diamniotic</option>
			<option value="monochorionic-monoamniotic">Monochorionic monoamniotic</option>
			<option value="not-applicable">Not applicable</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Conception method" inputId="conceptionMethod">
		<Select id="conceptionMethod" label="Conception method" bind:value={d.history.conceptionMethod}>
			<option value="">Select…</option>
			<option value="spontaneous">Spontaneous</option>
			<option value="ivf">IVF</option>
			<option value="iui">IUI</option>
			<option value="ovulation-induction">Ovulation induction</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Rhesus status" inputId="rhesusStatus">
		<Select id="rhesusStatus" label="Rhesus status" bind:value={d.history.rhesusStatus}>
			<option value="">Select…</option>
			<option value="positive">Positive</option>
			<option value="negative">Negative</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
