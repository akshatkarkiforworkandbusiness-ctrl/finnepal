import { TALLY_SYNC, TALLY_XML_SUMMARY } from "@/data/mockTallySync";
import { TallySyncState, TallySyncStep } from "@/types";

/**
 * Simulated Tally Prime sync — no HTTP calls, no credentials. Frontend-only prototype
 * boundary; a real integration would run through an Orbit Cloud → Tally Connector, never
 * directly from the mobile app.
 */
export function getTallySyncState(): TallySyncState {
  return TALLY_SYNC;
}

export async function runSync(onStep?: (step: TallySyncStep, index: number) => void): Promise<TallySyncState> {
  const steps = TALLY_SYNC.steps.map((s) => ({ ...s, done: false }));
  for (let i = 0; i < steps.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    steps[i] = { ...steps[i], done: true };
    onStep?.(steps[i], i);
  }
  return { ...TALLY_SYNC, steps };
}

export interface TallyXmlResult {
  ready: boolean;
  summary: typeof TALLY_XML_SUMMARY;
}

export async function generateXml(): Promise<TallyXmlResult> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return { ready: true, summary: TALLY_XML_SUMMARY };
}
