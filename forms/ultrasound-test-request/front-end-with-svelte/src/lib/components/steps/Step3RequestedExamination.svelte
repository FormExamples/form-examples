<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data;
</script>

<Fieldset legend="3. Requested Examination">
	<p class="hint">Body region, laterality, and the primary clinical indication — drives the appropriateness axis.</p>

	<Field label="Body region" inputId="bodyRegion" required>
		<Select id="bodyRegion" label="Body region" bind:value={d.request.bodyRegion} required>
			<option value="">Select…</option>
			<option value="abdomen">Abdomen</option>
			<option value="pelvis">Pelvis</option>
			<option value="renal-tract">Renal tract</option>
			<option value="liver-biliary">Liver / biliary</option>
			<option value="thyroid-neck">Thyroid / neck</option>
			<option value="scrotum-testes">Scrotum / testes</option>
			<option value="breast">Breast</option>
			<option value="soft-tissue">Soft tissue</option>
			<option value="vascular-doppler">Vascular Doppler</option>
			<option value="dvt-leg">DVT (leg)</option>
			<option value="carotid">Carotid</option>
			<option value="msk-joint">MSK / joint</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Laterality" inputId="laterality">
		<Select id="laterality" label="Laterality" bind:value={d.request.laterality}>
			<option value="">Select…</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
			<option value="bilateral">Bilateral</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Primary indication" inputId="primaryIndication" required>
		<Select id="primaryIndication" label="Primary indication" bind:value={d.request.primaryIndication} required>
			<option value="">Select…</option>
			<option value="abdominal-pain">Abdominal pain</option>
			<option value="suspected-gallstones">Suspected gallstones</option>
			<option value="abnormal-lfts">Abnormal LFTs</option>
			<option value="renal-impairment">Renal impairment</option>
			<option value="haematuria">Haematuria</option>
			<option value="palpable-mass">Palpable mass</option>
			<option value="suspected-dvt">Suspected DVT</option>
			<option value="suspected-aaa">Suspected AAA</option>
			<option value="thyroid-nodule">Thyroid nodule</option>
			<option value="testicular-pain">Testicular pain</option>
			<option value="follow-up">Follow-up</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
