-- Every table, function and domain of this form lives in its own schema,
-- named for the form, so no two forms' names can collide; see
-- spec/form-namespacing/.
CREATE SCHEMA IF NOT EXISTS united_kingdom_statement_of_fitness_for_work;

COMMENT ON SCHEMA united_kingdom_statement_of_fitness_for_work IS
    'Namespace for the United Kingdom Statement of Fitness for Work form''s tables, functions and domains.';
