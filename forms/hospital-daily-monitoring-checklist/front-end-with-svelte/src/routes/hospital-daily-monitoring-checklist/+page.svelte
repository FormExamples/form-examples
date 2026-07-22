<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the daily rounds checklist wizard and
	// the administrator review dashboard. The collection routes
	// (`/hospital-daily-monitoring-checklists` and `…/new`) hold the actual
	// functionality.
	const plural = 'hospital-daily-monitoring-checklists';
</script>

<main class="mx-16 px-4 py-12">

	<h1 class="text-2xl font-bold text-base-content">Hospital Daily Monitoring Checklist</h1>
	<p class="mt-2 max-w-2xl text-base-content/70">
		A hospital administrator's daily rounds checklist auditing 97 operational checkpoints across
		22 hospital areas.
	</p>

	<div class="mt-8 grid gap-4 sm:grid-cols-2">
		<a
			href="/hospital-daily-monitoring-checklist/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new inspection round</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step rounds checklist. One continuous single-page wizard covering
				inspection details, all 22 hospital areas, and sign-off.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/hospital-daily-monitoring-checklist/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Administrator review dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse inspection rounds with their needs-attention tally and affected areas, and filter
				by hospital and needs-attention count.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture a hospital administrator's or medical superintendent's daily rounds observations
					— 97 concrete operational checkpoints across 22 hospital areas (OPD, Causality, Dispensary,
					H.R. attendance, Ambulance, Diagnostic Facility, Store, OT/ICU, Labour Room, Wards, House
					Keeping, Water Supply, Electric Supply, Diet, Hospital Signage, Fire Fighting Equipment,
					Patient Feedback, Mortuary, Hospital Furniture, Hospital Waste Management, Infection
					Control Protocols, and Record Room) — each answered satisfactory / needs attention / not
					applicable with an optional remark, and produce a tally of checkpoints answered and
					needs-attention checkpoints grouped by area, to seed the inspecting officer's overall
					notes and action plan.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec catalogues all 97 checkpoints, grouped into the 22
					areas, with stable dotted identifiers. This is an operational compliance checklist, not a
					clinical grading engine — the shared engine only tallies and lists needs-attention
					checkpoints. The same engine feeds both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Transcribed from a hospital administration daily-monitoring rounds proforma (Resident
					Medical Officer / Medical Superintendent daily checklist format). This form is non-clinical
					— a facility/operations audit, not a patient record.
				</dd>
			</div>
		</dl>
	</section>
</main>
