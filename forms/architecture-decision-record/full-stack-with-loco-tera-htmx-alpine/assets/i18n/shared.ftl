# Intentionally empty.
#
# The Loco view-engine initializer still passes this file to
# fluent_templates::ArcLoader::shared_resources(), but defining any message
# here causes fluent-bundle 0.16 to return `Overriding` when the same id is
# also present in a per-locale main.ftl. Keep this file empty and inline any
# shared terms (Fluent `-name = value` form) into each `en-US/main.ftl`,
# `de-DE/main.ftl`, etc.
