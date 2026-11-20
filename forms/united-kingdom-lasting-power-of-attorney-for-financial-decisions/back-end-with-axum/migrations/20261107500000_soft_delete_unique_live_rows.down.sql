DO $$
DECLARE
    item record;
BEGIN
    FOR item IN
        SELECT i.indexrelid::regclass AS name, pg_get_indexdef(i.indexrelid) AS definition
        FROM pg_index i
        JOIN pg_class t ON t.oid = i.indrelid
        JOIN pg_namespace n ON n.oid = t.relnamespace
        WHERE i.indisunique AND i.indpred IS NOT NULL AND n.nspname = current_schema()
    LOOP
        EXECUTE format('DROP INDEX %s', item.name);
        EXECUTE replace(item.definition, ' WHERE (deleted_at IS NULL)', '');
    END LOOP;
END
$$;
