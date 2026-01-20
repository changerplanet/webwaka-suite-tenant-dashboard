import CryptoJS from 'crypto-js';
import type {
  ResolvedDashboard,
  DashboardSnapshot,
  SnapshotVerificationResult
} from '../types/index.js';

const SNAPSHOT_SECRET = 'webwaka-phase4d-snapshot-key';

function generateSnapshotId(): string {
  return `snap-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function computeSignature(resolved: ResolvedDashboard, expiresAt: number): string {
  const payload = JSON.stringify({ resolved, expiresAt });
  return CryptoJS.HmacSHA256(payload, SNAPSHOT_SECRET).toString();
}

export function generateDashboardSnapshot(
  resolved: ResolvedDashboard,
  expirationHours: number = 24
): DashboardSnapshot {
  const expiresAt = resolved.resolvedAt + expirationHours * 60 * 60 * 1000;
  const signature = computeSignature(resolved, expiresAt);

  return {
    snapshotId: generateSnapshotId(),
    resolved,
    expiresAt,
    signature
  };
}

export function verifyDashboardSnapshot(
  snapshot: DashboardSnapshot,
  currentTime?: number
): SnapshotVerificationResult {
  const now = currentTime ?? Date.now();

  if (now > snapshot.expiresAt) {
    return {
      valid: false,
      expired: true,
      tampered: false,
      reason: 'Snapshot has expired'
    };
  }

  const expectedSignature = computeSignature(snapshot.resolved, snapshot.expiresAt);
  if (snapshot.signature !== expectedSignature) {
    return {
      valid: false,
      expired: false,
      tampered: true,
      reason: 'Snapshot signature verification failed'
    };
  }

  return {
    valid: true,
    expired: false,
    tampered: false
  };
}

export function evaluateFromSnapshot(
  snapshot: DashboardSnapshot,
  currentTime?: number
): ResolvedDashboard {
  const verification = verifyDashboardSnapshot(snapshot, currentTime);

  if (!verification.valid) {
    throw new Error(`Snapshot evaluation failed: ${verification.reason}`);
  }

  return snapshot.resolved;
}
