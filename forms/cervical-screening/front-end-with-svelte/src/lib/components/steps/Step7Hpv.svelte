<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const h = assessment.data.hpv;
</script>

<Fieldset legend="Step 7 of 9 — Primary hrHPV result">
	<p class="hint">
		The primary high-risk HPV test. A negative result returns the person to routine recall; only a
		positive result proceeds to reflex cytology.
	</p>

	<Field label="Primary hrHPV result" inputId="hpv-hpvResult">
		<Select id="hpv-hpvResult" label="Primary hrHPV result" bind:value={h.hpvResult}>
			<option value="">— Select —</option>
			<option value="negative">Negative (not detected)</option>
			<option value="positive">Positive (detected)</option>
			<option value="not-tested">Not tested</option>
		</Select>
	</Field>
</Fieldset>
