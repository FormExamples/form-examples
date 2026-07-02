<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 10 — Person identification">
	<p class="hint">
		Who the check is for. This check is for people aged 14 or over on the LD register.
	</p>

	<Field label="Person identifier" required inputId="identification-personIdentifier">
		<TextInput
			id="identification-personIdentifier"
			label="Person identifier"
			placeholder="e.g. NHS number or local ID"
			required
			bind:value={i.personIdentifier}
		/>
	</Field>

	<Field label="Age band" required inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" required bind:value={i.ageBand}>
			<option value="">— Select —</option>
			<option value="14-17">14-17</option>
			<option value="18-24">18-24</option>
			<option value="25-44">25-44</option>
			<option value="45-64">45-64</option>
			<option value="65+">65 and over</option>
		</Select>
	</Field>

	<Field label="Sex" inputId="identification-sex">
		<Select id="identification-sex" label="Sex" bind:value={i.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Learning-disability register status" inputId="identification-ldRegisterStatus">
		<Select
			id="identification-ldRegisterStatus"
			label="Learning-disability register status"
			bind:value={i.ldRegisterStatus}
		>
			<option value="">— Select —</option>
			<option value="on-register">On the LD register</option>
			<option value="not-on-register">Not on the LD register</option>
			<option value="newly-added">Newly added to the register</option>
		</Select>
	</Field>

	<Field label="Main carer or supporter" inputId="identification-mainCarer">
		<TextInput
			id="identification-mainCarer"
			label="Main carer or supporter"
			placeholder="e.g. Parent, paid supporter, or none"
			bind:value={i.mainCarer}
		/>
	</Field>
</Fieldset>
