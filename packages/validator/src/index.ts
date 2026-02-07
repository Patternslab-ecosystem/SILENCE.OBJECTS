// @silence/validator — Contract & Language Audit
import { validate } from '@silence/language';

export function auditText(text: string): { pass: boolean; issues: string[] } {
  const result = validate(text);
  return { pass: result.valid, issues: result.violations };
}

export function auditBatch(texts: string[]): { total: number; passed: number; failed: string[][] } {
  const results = texts.map((t) => validate(t));
  return {
    total: texts.length,
    passed: results.filter((r) => r.valid).length,
    failed: results.filter((r) => !r.valid).map((r) => [...r.violations]),
  };
}
