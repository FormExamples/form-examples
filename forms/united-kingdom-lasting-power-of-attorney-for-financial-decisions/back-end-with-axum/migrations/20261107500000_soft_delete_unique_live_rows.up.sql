-- A deleted row must not block its replacement, so uniqueness covers live rows.
DO $$
DECLARE
    item record;
    definition text;
BEGIN
    FOR item IN
        SELECT i.indexrelid::regclass AS name, i.indrelid::regclass AS owner, c.conname
        FROM pg_index i
        JOIN pg_class t ON t.oid = i.indrelid
        JOIN pg_namespace n ON n.oid = t.relnamespace
        LEFT JOIN pg_constraint c ON c.conindid = i.indexrelid AND c.contype = 'u'
        WHERE i.indisunique AND NOT i.indisprimary AND i.indpred IS NULL
          AND n.nspname = current_schema()
          AND EXISTS (
              SELECT 1 FROM pg_attribute a
              WHERE a.attrelid = i.indrelid AND a.attname = 'deleted_at'
          )
    LOOP
        definition := pg_get_indexdef(item.name);
        IF item.conname IS NULL THEN
            EXECUTE format('DROP INDEX %s', item.name);
        ELSE
            EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', item.owner, item.conname);
        END IF;
        EXECUTE definition || ' WHERE deleted_at IS NULL';
    END LOOP;
END
$$;
