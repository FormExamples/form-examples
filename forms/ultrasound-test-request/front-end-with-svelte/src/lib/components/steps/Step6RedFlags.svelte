<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data;
</script>

<Fieldset legend="6. Red Flags">
	<p class="hint">Red flags auto-escalate the triage tier regardless of the other axes.</p>

	<Field label="Safety-critical red flags">
		<CheckboxGroup label="Safety-critical red flags">
			<label><CheckboxInput label="Suspected DVT" bind:checked={d.redFlags.suspectedDvt} /> Suspected DVT (deep vein thrombosis)</label>
			<label><CheckboxInput label="Suspected testicular torsion" bind:checked={d.redFlags.suspectedTesticularTorsion} /> Suspected testicular torsion</label>
			<label><CheckboxInput label="Suspected AAA" bind:checked={d.redFlags.suspectedAaa} /> Suspected AAA (abdominal aortic aneurysm)</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
