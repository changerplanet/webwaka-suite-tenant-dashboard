import type { ResolvedDashboard, DashboardSnapshot, SnapshotVerificationResult } from '../types/index.js';
export declare function configureSnapshotSecret(secret: string): void;
export declare function clearSnapshotSecret(): void;
export declare function generateDashboardSnapshot(resolved: ResolvedDashboard, expirationHours?: number): DashboardSnapshot;
export declare function verifyDashboardSnapshot(snapshot: DashboardSnapshot, currentTime?: number): SnapshotVerificationResult;
export declare function evaluateFromSnapshot(snapshot: DashboardSnapshot, currentTime?: number): ResolvedDashboard;
//# sourceMappingURL=snapshotEngine.d.ts.map