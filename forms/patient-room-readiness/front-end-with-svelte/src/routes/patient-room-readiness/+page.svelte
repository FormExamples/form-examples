<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the inspection wizard and the
	// housekeeping dashboard. The collection routes
	// (`/patient-room-readiness-checklists` and `…/new`) hold the actual
	// functionality.
	const plural = 'patient-room-readiness-checklists';
</script>

<main class="mx-16 px-4 py-12">
	<p class="mb-6 text-lg font-medium text-base-content">
		A room-readiness checklist for confirming a patient room is ready for occupancy.
	</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/patient-room-readiness/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new inspection</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step inspection wizard. One continuous single-page form covering location,
				the 25 room-fixture checkpoints, and inspector sign-off.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/patient-room-readiness/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Housekeeping dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse completed room inspections by building, room, checkpoint completeness, and
				inspector, and filter by readiness.
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
					A housekeeping / facilities room-readiness checklist, completed by an inspector immediately
					before a patient room is handed over for occupancy. It confirms 25 concrete room-fixture
					checkpoints — bedding and furniture, utilities, bathroom fittings, and the physical fabric
					of the room (walls, window, ceiling, door) — are present and in acceptable condition. Each
					checkpoint is a simple checked / not-checked confirmation; there is no clinical grading
					engine here, since this is a facilities readiness sign-off, not a diagnostic instrument.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec catalogues the 25 checkpoints verbatim and maps each
					to its field name. The same shared tally function grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Transcribed verbatim from a hospital housekeeping / facilities room-readiness proforma.
					Intended for housekeeping supervisors, ward clerks, facilities inspectors, or nursing staff
					performing a pre-occupancy or turnover room check.
				</dd>
			</div>
		</dl>
	</section>
</main>
