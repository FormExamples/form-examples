<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the certificate form and the registry
	// dashboard. The collection routes hold the actual functionality.
	const plural = 'international-certificates-of-vaccination-or-prophylaxis';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/international-certificate-of-vaccination-or-prophylaxis/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Issue a new certificate</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step certificate form. One continuous single-page wizard that validates the
				certificate as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/international-certificate-of-vaccination-or-prophylaxis/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Certificate registry</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse issued certificates with their primary disease, vaccination date, computed validity,
				and error / warning counts, and filter by disease and validity.
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
					Capture a structured vaccination record — centre and supervising clinician, vaccinee
					identity and consent, travel context, and each vaccination entry — and produce a
					validated certificate: overall validity against rules VAL001–VAL012, per-entry validity
					dates (yellow fever: vaccination + 10 days, lifetime per the 2016 IHR amendment), and the
					fired-rule report, for international travel.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the validation engine, and the
					rule set. The same engine validates both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Based on the WHO Model International Certificate of Vaccination or Prophylaxis (IHR 2005,
					Annex 6) and the CDC ICVP guidance.
				</dd>
			</div>
		</dl>
	</section>
</main>
