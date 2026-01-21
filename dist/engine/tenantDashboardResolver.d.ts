import type { EvaluationContext, ResolvedDashboard, DashboardSnapshot, SnapshotVerificationResult } from '../types/index.js';
export declare class TenantDashboardResolver {
    resolve(context: EvaluationContext): ResolvedDashboard;
    generateSnapshot(resolved: ResolvedDashboard, expirationHours?: number): DashboardSnapshot;
    verifySnapshot(snapshot: DashboardSnapshot, currentTime?: number): SnapshotVerificationResult;
    evaluateOffline(snapshot: DashboardSnapshot, currentTime?: number): ResolvedDashboard;
    resolveAndSnapshot(context: EvaluationContext, expirationHours?: number): {
        resolved: ResolvedDashboard;
        snapshot: DashboardSnapshot;
    };
}
export declare const tenantDashboardResolver: TenantDashboardResolver;
//# sourceMappingURL=tenantDashboardResolver.d.ts.map