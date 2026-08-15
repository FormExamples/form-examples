<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.contraceptiveHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Contraceptive History" description="Previous methods used and reasons for change.">
	<RadioGroup label="Have you used contraception before?" name="previousContraception" options={yesNo} bind:value={c.previousContraception} />

	{#if c.previousContraception === 'yes'}
		<RadioGroup label="Combined oral contraceptive (COC)?" name="previousCOC" options={yesNo} bind:value={c.previousCOC} />
		{#if c.previousCOC === 'yes'}
			<TextInput label="COC details" name="cocDetails" placeholder="e.g. Microgynon, 3 years" bind:value={c.cocDetails} />
		{/if}

		<RadioGroup label="Progestogen-only pill (POP)?" name="previousPOP" options={yesNo} bind:value={c.previousPOP} />
		{#if c.previousPOP === 'yes'}
			<TextInput label="POP details" name="popDetails" bind:value={c.popDetails} />
		{/if}

		<RadioGroup label="Contraceptive implant?" name="previousImplant" options={yesNo} bind:value={c.previousImplant} />
		{#if c.previousImplant === 'yes'}
			<TextInput label="Implant details" name="implantDetails" bind:value={c.implantDetails} />
		{/if}

		<RadioGroup label="Contraceptive injection?" name="previousInjection" options={yesNo} bind:value={c.previousInjection} />
		{#if c.previousInjection === 'yes'}
			<TextInput label="Injection details" name="injectionDetails" bind:value={c.injectionDetails} />
		{/if}

		<RadioGroup label="Copper IUD (coil)?" name="previousIUD" options={yesNo} bind:value={c.previousIUD} />
		{#if c.previousIUD === 'yes'}
			<TextInput label="IUD details" name="iudDetails" bind:value={c.iudDetails} />
		{/if}

		<RadioGroup label="Hormonal IUS (e.g. Mirena)?" name="previousIUS" options={yesNo} bind:value={c.previousIUS} />
		{#if c.previousIUS === 'yes'}
			<TextInput label="IUS details" name="iusDetails" bind:value={c.iusDetails} />
		{/if}

		<RadioGroup label="Patch or vaginal ring?" name="previousPatchRing" options={yesNo} bind:value={c.previousPatchRing} />
		{#if c.previousPatchRing === 'yes'}
			<TextInput label="Patch/ring details" name="patchRingDetails" bind:value={c.patchRingDetails} />
		{/if}

		<RadioGroup label="Barrier methods (condoms, diaphragm)?" name="previousBarrier" options={yesNo} bind:value={c.previousBarrier} />

		<TextInput label="Reason for changing method" name="reasonForChange" bind:value={c.reasonForChange} />
		<TextAreaInput label="Adverse effects experienced" name="adverseEffects" rows={3} bind:value={c.adverseEffects} />
	{/if}
</Fieldset>
