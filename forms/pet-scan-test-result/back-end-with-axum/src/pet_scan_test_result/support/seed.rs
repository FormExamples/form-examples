//! Loading YAML fixtures into a table.

use axa::{Error, Result};
use serde_json::{Map, Value};
use sqlx::{AssertSqlSafe, PgPool};

/// A name with case and underscores removed, so that a fixture's JSON key
/// `countryAsIso31661Alpha2` matches the column `country_as_iso_3166_1_alpha_2`.
fn normalize(name: &str) -> String {
    name.chars()
        .filter(|character| *character != '_')
        .flat_map(char::to_lowercase)
        .collect()
}

/// Insert every row of the YAML fixture at `path` into `table`, then move the
/// table's id sequence, if it has one, past the inserted rows.
///
/// # Errors
///
/// Fails when the file cannot be read or parsed, or the insert fails.
pub async fn seed(db: &PgPool, table: &str, path: &str) -> Result<()> {
    let bytes = tokio::fs::read(path).await?;
    let rows: Vec<Map<String, Value>> = serde_saphyr::from_slice(&bytes).map_err(Error::wrap)?;
    if rows.is_empty() {
        return Ok(());
    }
    let known: Vec<String> = sqlx::query_scalar(
        "SELECT column_name::text FROM information_schema.columns \
         WHERE table_schema = current_schema() AND table_name = $1",
    )
    .bind(table)
    .fetch_all(db)
    .await?;
    let column_for = |key: &str| {
        known
            .iter()
            .find(|column| normalize(column) == normalize(key))
            .cloned()
            .ok_or_else(|| Error::Message(format!("{table} has no column for fixture key {key}")))
    };
    // Only the keys a row carries are inserted, so a column default still
    // applies when every fixture row leaves that column out.
    let mut columns: Vec<String> = Vec::new();
    let mut named = Vec::with_capacity(rows.len());
    for row in rows {
        let mut object = Map::with_capacity(row.len());
        for (key, value) in row {
            let column = column_for(&key)?;
            if !columns.contains(&column) {
                columns.push(column.clone());
            }
            object.insert(column, value);
        }
        named.push(Value::Object(object));
    }
    let rows = Value::Array(named);
    let list = columns
        .iter()
        .map(|column| format!("\"{column}\""))
        .collect::<Vec<_>>()
        .join(", ");
    let insert = format!(
        "INSERT INTO \"{table}\" ({list}) \
         SELECT {list} FROM jsonb_populate_recordset(NULL::\"{table}\", $1)"
    );
    // Table and column names come from this repository: the caller and the
    // fixture files, never a request.
    sqlx::query(AssertSqlSafe(insert))
        .bind(rows)
        .execute(db)
        .await?;
    let sequence: Option<String> = sqlx::query_scalar("SELECT pg_get_serial_sequence($1, 'id')")
        .bind(format!("\"{table}\""))
        .fetch_one(db)
        .await?;
    if sequence.is_some() {
        let reset = format!(
            "SELECT setval(pg_get_serial_sequence('\"{table}\"', 'id'), \
             (SELECT COALESCE(MAX(id), 1) FROM \"{table}\"))"
        );
        sqlx::query(AssertSqlSafe(reset)).fetch_one(db).await?;
    }
    Ok(())
}
