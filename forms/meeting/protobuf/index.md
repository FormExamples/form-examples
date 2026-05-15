# Meeting — Protocol Buffers

Generated Protocol Buffers `.proto` schemas, one file per SQL table.
Produced by `bin/protobuf/generate-protobuf-representations.py` from the
migrations in [`../sql-migrations/`](../sql-migrations/).

The schemas serve as the service-to-service interchange format for
backends that prefer protobuf over JSON. The wire field numbers are
assigned in the same order as the SQL columns so the encoding is stable
under additive schema changes.

See the sibling [`AGENTS.md`](./AGENTS.md) for agent instructions.
