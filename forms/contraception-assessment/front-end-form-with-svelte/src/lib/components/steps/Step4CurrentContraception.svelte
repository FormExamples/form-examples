<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.currentContraception;
</script>

<Fieldset legend="Current Contraception">
	<p class="hint">Your current or most recent method of contraception.</p>

	<Field label="Current contraceptive method" required inputId="currentMethod">
		<Select id="currentMethod" label="Current contraceptive method" required bind:value={c.currentMethod}>
			<option value="">-- Select --</option>
			<option value="combined-oral">Combined oral contraceptive (COC)</option>
			<option value="progestogen-only-pill">Progestogen-only pill (POP)</option>
			<option value="injectable">Injectable (e.g., Depo-Provera)</option>
			<option value="implant">Subdermal implant (e.g., Nexplanon)</option>
			<option value="copper-iud">Copper IUD (non-hormonal coil)</option>
			<option value="lng-ius">LNG-IUS (hormonal coil, e.g., Mirena)</option>
			<option value="patch">Contraceptive patch</option>
			<option value="vaginal-ring">Vaginal ring (e.g., NuvaRing)</option>
			<option value="barrier">Barrier method (condoms, diaphragm)</option>
			<option value="natural-methods">Natural family planning / fertility awareness</option>
			<option value="sterilisation">Sterilisation</option>
			<option value="none">None / not currently using</option>
		</Select>
	</Field>

	<Field label="How long have you been using this method?" inputId="durationOfUse">
		<TextInput id="durationOfUse" label="Duration of use" placeholder="e.g., 6 months, 2 years, 5 years" bind:value={c.durationOfUse} />
	</Field>

	<Field label="Reason for change or review" inputId="reasonForChange">
		<TextAreaInput id="reasonForChange" label="Reason for change or review" rows={3} placeholder="Why are you considering changing or reviewing your contraception?" bind:value={c.reasonForChange} />
	</Field>

	<Field label="Side effects experienced" inputId="sideEffects">
		<TextAreaInput id="sideEffects" label="Side effects experienced" rows={3} placeholder="List any side effects you have experienced with your current or previous methods..." bind:value={c.sideEffects} />
	</Field>
</Fieldset>
