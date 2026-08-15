<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const inv = assessment.data.investigations;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const ultrasoundOptions = [
		{ value: 'yes-normal', label: 'Yes — normal' },
		{ value: 'yes-abnormal', label: 'Yes — abnormal' },
		{ value: 'no', label: 'Not yet performed' }
	];
</script>

<Fieldset legend="Investigations">
	<p class="hint">Pelvic ultrasound, tubal patency, and other imaging.</p>

	<Field label="Transvaginal ultrasound performed?">
		<RadioGroup label="Transvaginal ultrasound performed?">
			{#each ultrasoundOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="transvaginalUltrasound" value={opt.value} bind:group={inv.transvaginalUltrasound} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Antral follicle count (AFC)" inputId="investigations-antralFollicleCount">
		<NumberInput id="investigations-antralFollicleCount" label="Antral follicle count" min={0} max={100} bind:value={inv.antralFollicleCount} />
	</Field>

	<Field label="Hysterosalpingogram (HSG) performed?">
		<RadioGroup label="Hysterosalpingogram (HSG) performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hysterosalpingogramDone" value={opt.value} bind:group={inv.hysterosalpingogramDone} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if inv.hysterosalpingogramDone === 'yes'}
		<Field label="HSG result">
			<RadioGroup label="HSG result">
				<label><input type="radio" class="radio-input" name="hysterosalpingogramResult" value="normal" bind:group={inv.hysterosalpingogramResult} /> Normal — both tubes patent</label>
				<label><input type="radio" class="radio-input" name="hysterosalpingogramResult" value="abnormal" bind:group={inv.hysterosalpingogramResult} /> Abnormal (block, hydrosalpinx)</label>
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Hysteroscopy performed?">
		<RadioGroup label="Hysteroscopy performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hysteroscopyDone" value={opt.value} bind:group={inv.hysteroscopyDone} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if inv.hysteroscopyDone === 'yes'}
		<Field label="Hysteroscopy result">
			<RadioGroup label="Hysteroscopy result">
				<label><input type="radio" class="radio-input" name="hysteroscopyResult" value="normal" bind:group={inv.hysteroscopyResult} /> Normal cavity</label>
				<label><input type="radio" class="radio-input" name="hysteroscopyResult" value="abnormal" bind:group={inv.hysteroscopyResult} /> Abnormal (polyp, fibroid, septum)</label>
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Laparoscopy performed?">
		<RadioGroup label="Laparoscopy performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="laparoscopyDone" value={opt.value} bind:group={inv.laparoscopyDone} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if inv.laparoscopyDone === 'yes'}
		<Field label="Laparoscopy result">
			<RadioGroup label="Laparoscopy result">
				<label><input type="radio" class="radio-input" name="laparoscopyResult" value="normal" bind:group={inv.laparoscopyResult} /> Normal</label>
				<label><input type="radio" class="radio-input" name="laparoscopyResult" value="abnormal" bind:group={inv.laparoscopyResult} /> Abnormal (endometriosis, adhesions)</label>
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Other investigations" inputId="investigations-otherInvestigations">
		<TextAreaInput id="investigations-otherInvestigations" label="Other investigations" rows={3} placeholder="Any other imaging or tests…" bind:value={inv.otherInvestigations} />
	</Field>
</Fieldset>
