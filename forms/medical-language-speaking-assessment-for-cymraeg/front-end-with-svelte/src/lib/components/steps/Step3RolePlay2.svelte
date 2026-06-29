<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import RolePlaySection from './RolePlaySection.svelte';
</script>

<RolePlaySection
	section={assessment.data.rolePlay2}
	legend="Role-play 2 — Esboniad Clinigol (Clinical Explanation)"
	description="A Welsh-language clinical-explanation scenario: explaining a diagnosis, treatment, or procedure to the patient or relative in Cymraeg."
	idPrefix="rp2"
	examples={{
		title: 'e.g. Esbonio diagnosis diabetes (new diagnosis)',
		summary:
			'Esboniwch ddiagnosis newydd a chynllun rheoli i glaf neu berthynas yn Gymraeg, gan wirio dealltwriaeth.',
		patientRole: 'e.g. Claf newydd-ddiagnosedig',
		setting: 'e.g. Clinig cleifion allanol'
	}}
/>
