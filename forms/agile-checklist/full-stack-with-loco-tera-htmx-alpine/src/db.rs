use crate::dashboard::ChecklistRow;
use chrono::Utc;
use rusqlite::{Connection, OptionalExtension, params};
use std::collections::HashMap;
use std::path::Path;
use std::sync::Mutex;

const SCHEMA: &str = "
CREATE TABLE IF NOT EXISTS submissions (
    id                     TEXT PRIMARY KEY,
    created_at             TEXT NOT NULL,
    submission_date        TEXT NOT NULL,
    team                   TEXT NOT NULL,
    organisation           TEXT NOT NULL,
    respondent             TEXT NOT NULL,
    role                   TEXT NOT NULL,
    is_anonymous           INTEGER NOT NULL DEFAULT 0,
    answered               INTEGER NOT NULL,
    teams_percent          INTEGER,
    stakeholders_percent   INTEGER,
    practices_percent      INTEGER,
    overall_percent        INTEGER,
    maturity               TEXT NOT NULL,
    weak_sections          TEXT NOT NULL DEFAULT '',
    flags                  TEXT NOT NULL DEFAULT '',
    answers_json           TEXT NOT NULL DEFAULT '{}',
    top_action_1           TEXT NOT NULL DEFAULT '',
    top_action_2           TEXT NOT NULL DEFAULT '',
    top_action_3           TEXT NOT NULL DEFAULT '',
    coach_notes            TEXT NOT NULL DEFAULT '',
    overall_notes          TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at
    ON submissions(created_at DESC);
";

pub struct Db {
    conn: Mutex<Connection>,
}

impl Db {
    pub fn open(path: &Path) -> rusqlite::Result<Self> {
        let conn = if path.as_os_str() == ":memory:" {
            Connection::open_in_memory()?
        } else {
            Connection::open(path)?
        };
        conn.execute_batch(SCHEMA)?;
        Ok(Db { conn: Mutex::new(conn) })
    }

    pub fn insert(
        &self,
        row: &ChecklistRow,
        answers: &HashMap<String, String>,
        plan: &ActionPlan,
    ) -> rusqlite::Result<()> {
        let answers_json = serde_json::to_string(answers).unwrap_or_else(|_| "{}".to_string());
        let conn = self.conn.lock().expect("db lock");
        conn.execute(
            "INSERT INTO submissions (
                id, created_at, submission_date, team, organisation, respondent, role,
                is_anonymous, answered, teams_percent, stakeholders_percent,
                practices_percent, overall_percent, maturity, weak_sections, flags,
                answers_json, top_action_1, top_action_2, top_action_3,
                coach_notes, overall_notes
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            params![
                row.id,
                Utc::now().to_rfc3339(),
                row.date,
                row.team,
                row.organisation,
                row.respondent,
                row.role,
                row.is_anonymous as i32,
                row.answered as i32,
                row.teams_percent.map(|p| p as i32),
                row.stakeholders_percent.map(|p| p as i32),
                row.practices_percent.map(|p| p as i32),
                row.overall_percent.map(|p| p as i32),
                row.maturity,
                row.weak_sections.join(";"),
                row.flags.join(";"),
                answers_json,
                plan.top_action_1,
                plan.top_action_2,
                plan.top_action_3,
                plan.coach_notes,
                plan.overall_notes,
            ],
        )?;
        Ok(())
    }

    pub fn action_plan_for(&self, id: &str) -> rusqlite::Result<Option<ActionPlan>> {
        let conn = self.conn.lock().expect("db lock");
        conn.query_row(
            "SELECT top_action_1, top_action_2, top_action_3, coach_notes, overall_notes
             FROM submissions WHERE id = ?1",
            params![id],
            |row| {
                Ok(ActionPlan {
                    top_action_1: row.get(0)?,
                    top_action_2: row.get(1)?,
                    top_action_3: row.get(2)?,
                    coach_notes: row.get(3)?,
                    overall_notes: row.get(4)?,
                })
            },
        )
        .optional()
    }

    pub fn answers_for(&self, id: &str) -> rusqlite::Result<Option<HashMap<String, String>>> {
        let conn = self.conn.lock().expect("db lock");
        let answers_json: Option<String> = conn
            .query_row(
                "SELECT answers_json FROM submissions WHERE id = ?1",
                params![id],
                |r| r.get(0),
            )
            .optional()?;
        Ok(answers_json
            .and_then(|s| serde_json::from_str::<HashMap<String, String>>(&s).ok()))
    }

    pub fn find(&self, id: &str) -> rusqlite::Result<Option<PersistedRow>> {
        let conn = self.conn.lock().expect("db lock");
        conn.query_row(
            "SELECT id, submission_date, team, organisation, respondent, role,
                    is_anonymous, answered, teams_percent, stakeholders_percent,
                    practices_percent, overall_percent, maturity, weak_sections, flags
             FROM submissions WHERE id = ?1",
            params![id],
            |row| {
                let weak_str: String = row.get(13)?;
                let flags_str: String = row.get(14)?;
                Ok(PersistedRow {
                    id: row.get(0)?,
                    date: row.get(1)?,
                    team: row.get(2)?,
                    organisation: row.get(3)?,
                    respondent: row.get(4)?,
                    role: row.get(5)?,
                    is_anonymous: row.get::<_, i32>(6)? != 0,
                    answered: row.get::<_, i32>(7)? as u8,
                    teams_percent: row.get::<_, Option<i32>>(8)?.map(|v| v as u8),
                    stakeholders_percent: row.get::<_, Option<i32>>(9)?.map(|v| v as u8),
                    practices_percent: row.get::<_, Option<i32>>(10)?.map(|v| v as u8),
                    overall_percent: row.get::<_, Option<i32>>(11)?.map(|v| v as u8),
                    maturity: row.get(12)?,
                    weak_sections: split_or_empty(&weak_str),
                    flags: split_or_empty(&flags_str),
                })
            },
        )
        .optional()
    }

    pub fn list(&self) -> rusqlite::Result<Vec<PersistedRow>> {
        let conn = self.conn.lock().expect("db lock");
        let mut stmt = conn.prepare(
            "SELECT id, submission_date, team, organisation, respondent, role,
                    is_anonymous, answered, teams_percent, stakeholders_percent,
                    practices_percent, overall_percent, maturity, weak_sections, flags
             FROM submissions
             ORDER BY submission_date DESC, created_at DESC",
        )?;
        let rows = stmt.query_map([], |row| {
            let weak_str: String = row.get(13)?;
            let flags_str: String = row.get(14)?;
            Ok(PersistedRow {
                id: row.get(0)?,
                date: row.get(1)?,
                team: row.get(2)?,
                organisation: row.get(3)?,
                respondent: row.get(4)?,
                role: row.get(5)?,
                is_anonymous: row.get::<_, i32>(6)? != 0,
                answered: row.get::<_, i32>(7)? as u8,
                teams_percent: row.get::<_, Option<i32>>(8)?.map(|v| v as u8),
                stakeholders_percent: row.get::<_, Option<i32>>(9)?.map(|v| v as u8),
                practices_percent: row.get::<_, Option<i32>>(10)?.map(|v| v as u8),
                overall_percent: row.get::<_, Option<i32>>(11)?.map(|v| v as u8),
                maturity: row.get(12)?,
                weak_sections: split_or_empty(&weak_str),
                flags: split_or_empty(&flags_str),
            })
        })?;
        rows.collect()
    }

    #[allow(dead_code)]
    pub fn count(&self) -> rusqlite::Result<usize> {
        let conn = self.conn.lock().expect("db lock");
        let n: i64 = conn.query_row("SELECT COUNT(*) FROM submissions", [], |r| r.get(0))?;
        Ok(n as usize)
    }

    #[allow(dead_code)]
    pub fn clear(&self) -> rusqlite::Result<()> {
        let conn = self.conn.lock().expect("db lock");
        conn.execute("DELETE FROM submissions", [])?;
        Ok(())
    }

    #[allow(dead_code)]
    pub fn latest(&self) -> rusqlite::Result<Option<String>> {
        let conn = self.conn.lock().expect("db lock");
        conn.query_row(
            "SELECT id FROM submissions ORDER BY created_at DESC LIMIT 1",
            [],
            |r| r.get::<_, String>(0),
        )
        .optional()
    }
}

fn split_or_empty(s: &str) -> Vec<String> {
    if s.is_empty() {
        Vec::new()
    } else {
        s.split(';').map(|p| p.to_string()).collect()
    }
}

#[derive(Debug, Clone, Default, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionPlan {
    pub top_action_1: String,
    pub top_action_2: String,
    pub top_action_3: String,
    pub coach_notes: String,
    pub overall_notes: String,
}

impl ActionPlan {
    pub fn is_empty(&self) -> bool {
        self.top_action_1.is_empty()
            && self.top_action_2.is_empty()
            && self.top_action_3.is_empty()
            && self.coach_notes.is_empty()
            && self.overall_notes.is_empty()
    }
}

#[derive(Debug, Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PersistedRow {
    pub id: String,
    pub date: String,
    pub team: String,
    pub organisation: String,
    pub respondent: String,
    pub role: String,
    pub is_anonymous: bool,
    pub answered: u8,
    pub teams_percent: Option<u8>,
    pub stakeholders_percent: Option<u8>,
    pub practices_percent: Option<u8>,
    pub overall_percent: Option<u8>,
    pub maturity: String,
    pub weak_sections: Vec<String>,
    pub flags: Vec<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample_row(id: &str, team: &str, percent: Option<u8>, maturity: &str) -> ChecklistRow {
        ChecklistRow {
            id: Box::leak(id.to_string().into_boxed_str()),
            date: "2026-05-14",
            respondent: "Test",
            role: "scrum-master",
            team: Box::leak(team.to_string().into_boxed_str()),
            organisation: "Acme",
            answered: 57,
            teams_percent: percent,
            stakeholders_percent: percent,
            practices_percent: percent,
            overall_percent: percent,
            maturity: Box::leak(maturity.to_string().into_boxed_str()),
            maturity_class: Box::leak(maturity.to_string().into_boxed_str()),
            weak_sections: vec!["Teams"],
            flags: vec!["finished-work-risk"],
            is_anonymous: false,
        }
    }

    fn empty_answers() -> HashMap<String, String> {
        HashMap::new()
    }

    #[test]
    fn open_in_memory_and_insert() {
        let db = Db::open(Path::new(":memory:")).expect("open");
        assert_eq!(db.count().unwrap(), 0);
        let row = sample_row("R1", "Aurora", Some(85), "mature");
        db.insert(&row, &empty_answers(), &ActionPlan::default()).expect("insert");
        assert_eq!(db.count().unwrap(), 1);
        let rows = db.list().expect("list");
        assert_eq!(rows.len(), 1);
        assert_eq!(rows[0].team, "Aurora");
        assert_eq!(rows[0].overall_percent, Some(85));
        assert_eq!(rows[0].weak_sections, vec!["Teams"]);
        assert_eq!(rows[0].flags, vec!["finished-work-risk"]);
    }

    #[test]
    fn list_is_date_desc() {
        let db = Db::open(Path::new(":memory:")).expect("open");
        let mut a = sample_row("A", "Aurora", Some(70), "developing");
        let mut b = sample_row("B", "Borealis", Some(80), "mature");
        a.date = "2026-01-01";
        b.date = "2026-05-14";
        db.insert(&a, &empty_answers(), &ActionPlan::default()).unwrap();
        db.insert(&b, &empty_answers(), &ActionPlan::default()).unwrap();
        let rows = db.list().unwrap();
        assert_eq!(rows[0].id, "B");
        assert_eq!(rows[1].id, "A");
    }

    #[test]
    fn clear_removes_all_rows() {
        let db = Db::open(Path::new(":memory:")).expect("open");
        db.insert(&sample_row("R1", "Aurora", Some(85), "mature"), &empty_answers(), &ActionPlan::default()).unwrap();
        db.insert(&sample_row("R2", "Borealis", Some(70), "developing"), &empty_answers(), &ActionPlan::default()).unwrap();
        db.clear().unwrap();
        assert_eq!(db.count().unwrap(), 0);
    }

    #[test]
    fn null_percent_round_trips() {
        let db = Db::open(Path::new(":memory:")).expect("open");
        let row = sample_row("R1", "Empty", None, "insufficient-data");
        db.insert(&row, &empty_answers(), &ActionPlan::default()).unwrap();
        let rows = db.list().unwrap();
        assert_eq!(rows[0].overall_percent, None);
        assert_eq!(rows[0].teams_percent, None);
    }

    #[test]
    fn answers_round_trip() {
        let db = Db::open(Path::new(":memory:")).expect("open");
        let mut a = HashMap::new();
        a.insert("t01".to_string(), "yes".to_string());
        a.insert("s07".to_string(), "no".to_string());
        a.insert("p14".to_string(), "not-applicable".to_string());
        db.insert(&sample_row("R1", "Aurora", Some(80), "mature"), &a, &ActionPlan::default()).unwrap();
        let back = db.answers_for("R1").unwrap().expect("answers present");
        assert_eq!(back.get("t01"), Some(&"yes".to_string()));
        assert_eq!(back.get("s07"), Some(&"no".to_string()));
        assert_eq!(back.get("p14"), Some(&"not-applicable".to_string()));
        assert_eq!(back.len(), 3);
    }

    #[test]
    fn find_returns_row_by_id() {
        let db = Db::open(Path::new(":memory:")).expect("open");
        db.insert(&sample_row("R1", "Aurora", Some(80), "mature"), &empty_answers(), &ActionPlan::default()).unwrap();
        let found = db.find("R1").unwrap().expect("found");
        assert_eq!(found.team, "Aurora");
        assert!(db.find("nope").unwrap().is_none());
    }

    #[test]
    fn action_plan_round_trips() {
        let db = Db::open(Path::new(":memory:")).expect("open");
        let plan = ActionPlan {
            top_action_1: "Pair on the iOS migration".into(),
            top_action_2: "Set WIP limit of 5".into(),
            top_action_3: "Brief sponsor on experiment budget".into(),
            coach_notes: "Watch for psych-safety regressions during the cut".into(),
            overall_notes: "First quarter of the new ways of working.".into(),
        };
        db.insert(
            &sample_row("R1", "Aurora", Some(80), "mature"),
            &empty_answers(),
            &plan,
        )
        .unwrap();
        let back = db.action_plan_for("R1").unwrap().expect("plan present");
        assert_eq!(back.top_action_1, plan.top_action_1);
        assert_eq!(back.top_action_2, plan.top_action_2);
        assert_eq!(back.top_action_3, plan.top_action_3);
        assert_eq!(back.coach_notes, plan.coach_notes);
        assert_eq!(back.overall_notes, plan.overall_notes);
        assert!(!back.is_empty());
        assert!(ActionPlan::default().is_empty());
    }
}
