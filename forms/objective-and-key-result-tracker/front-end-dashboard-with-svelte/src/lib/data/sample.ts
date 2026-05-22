export interface Objective {
  id: string;
  obj_title: string;
  level: 'individual' | 'team' | 'department' | 'company';
  dri: string;
  cycle: string;
  cycle_start_date: string;
  cycle_end_date: string;
  rag: 'green' | 'amber' | 'red';
  progress_percent: number;
  confidence_decile: number;
  keyResults: KeyResult[];
  flags: Flag[];
  latestCheckIn?: { checked_in_at: string; narrative: string };
}

export interface KeyResult {
  position: number;
  title: string;
  kr_type: string;
  current: number | null;
  target: number | null;
  unit: string;
  progress_fraction: number;
}

export interface Flag {
  code: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

export async function loadObjectives(fetcher: typeof fetch = fetch): Promise<Objective[]> {
  const r = await fetcher('/objectives.json');
  return await r.json();
}
