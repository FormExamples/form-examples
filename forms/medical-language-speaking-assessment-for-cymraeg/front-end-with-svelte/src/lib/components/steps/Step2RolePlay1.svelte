<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import RolePlaySection from './RolePlaySection.svelte';
</script>

<RolePlaySection
	section={assessment.data.rolePlay1}
	legend="Role-play 1 — Sgwrs gyda Chlaf (Patient Conversation)"
	description="A Welsh-language patient-interview scenario: history-taking, eliciting concerns, building rapport in Cymraeg."
	idPrefix="rp1"
	examples={{
		title: 'e.g. Poen yn y frest mewn dyn 62 oed (suspected angina)',
		summary:
			'Mae claf yn cyflwyno â phoen canolog yn y frest wrth ymarfer; cymerwch hanes ac archwiliwch bryderon yn Gymraeg.',
		patientRole: 'e.g. Claf â phoen yn y frest',
		setting: 'e.g. Meddygfa / GP clinic'
	}}
/>
