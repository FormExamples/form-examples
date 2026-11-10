-- The sql/ columns the scaffold left out, with their CHECKs.
ALTER TABLE "united_kingdom_statement_of_fitness_for_works" ADD COLUMN "is_duplicate_of" uuid REFERENCES "united_kingdom_statement_of_fitness_for_works" (id) ON DELETE SET NULL;
