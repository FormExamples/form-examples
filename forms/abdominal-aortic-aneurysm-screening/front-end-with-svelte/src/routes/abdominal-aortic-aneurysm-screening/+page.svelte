<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the screening wizard and the clinician
	// dashboard.
	const plural = 'abdominal-aortic-aneurysm-screenings';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/abdominal-aortic-aneurysm-screening/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new scan record</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step wizard. One continuous single-page form that classifies the aorta by
				diameter as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/abdominal-aortic-aneurysm-screening/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse scanned patients with their maximum aortic diameter and category, and filter by
				eligibility route and category.
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
					Document an AAA screening scan and, from the maximum aortic diameter, derive the aneurysm
					category — normal (&lt; 3.0 cm), small (3.0-4.4 cm), medium (4.5-5.4 cm), or large (&ge;
					5.5 cm), or non-visualised when the aorta cannot be adequately measured — the surveillance
					or referral band, and a graded report with flagged issues.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the diameter thresholds (3.0 /
					4.5 / 5.5 cm), and the classification and flag rules. The same engine grades both the form
					and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from the NHS AAA Screening Programme standards and NICE NG156. This is documentation
					plus a deterministic classification engine; it does not diagnose and does not decide on
					surgical repair.
				</dd>
			</div>
		</dl>
	</section>
</main>
