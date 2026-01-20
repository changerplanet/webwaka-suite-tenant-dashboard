import type {
  EvaluationContext,
  ResolvedDashboard,
  DashboardSnapshot,
  SnapshotVerificationResult
} from '../types/index.js';
import { TENANT_DASHBOARD } from '../dashboards/tenant.dashboard.js';
import { resolveDashboard } from './phase4aConsumer.js';
import {
  generateDashboardSnapshot,
  verifyDashboardSnapshot,
  evaluateFromSnapshot
} from './snapshotEngine.js';

export class TenantDashboardResolver {
  resolve(context: EvaluationContext): ResolvedDashboard {
    return resolveDashboard(TENANT_DASHBOARD, context);
  }

  generateSnapshot(
    resolved: ResolvedDashboard,
    expirationHours?: number
  ): DashboardSnapshot {
    return generateDashboardSnapshot(resolved, expirationHours);
  }

  verifySnapshot(
    snapshot: DashboardSnapshot,
    currentTime?: number
  ): SnapshotVerificationResult {
    return verifyDashboardSnapshot(snapshot, currentTime);
  }

  evaluateOffline(
    snapshot: DashboardSnapshot,
    currentTime?: number
  ): ResolvedDashboard {
    return evaluateFromSnapshot(snapshot, currentTime);
  }

  resolveAndSnapshot(
    context: EvaluationContext,
    expirationHours?: number
  ): { resolved: ResolvedDashboard; snapshot: DashboardSnapshot } {
    const resolved = this.resolve(context);
    const snapshot = this.generateSnapshot(resolved, expirationHours);
    return { resolved, snapshot };
  }
}

export const tenantDashboardResolver = new TenantDashboardResolver();
