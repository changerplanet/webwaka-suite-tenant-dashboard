export interface DashboardSection {
    readonly id: string;
    readonly label: string;
    readonly order: number;
    readonly gating: SectionGating;
}
export interface SectionGating {
    readonly permissions: readonly string[];
    readonly entitlements: readonly string[];
    readonly featureFlags: readonly string[];
}
export interface DashboardDeclaration {
    readonly id: string;
    readonly name: string;
    readonly type: 'tenant' | 'partner' | 'superadmin';
    readonly version: string;
    readonly sections: readonly DashboardSection[];
}
export interface EvaluationContext {
    readonly tenantId: string;
    readonly userId: string;
    readonly permissions: readonly string[];
    readonly entitlements: readonly string[];
    readonly featureFlags: readonly string[];
    readonly timestamp: number;
}
export interface ResolvedSection {
    readonly id: string;
    readonly label: string;
    readonly order: number;
    readonly visible: boolean;
    readonly hiddenReasons: readonly string[];
}
export interface ResolvedDashboard {
    readonly declarationId: string;
    readonly declarationVersion: string;
    readonly tenantId: string;
    readonly userId: string;
    readonly resolvedAt: number;
    readonly sections: readonly ResolvedSection[];
}
export interface DashboardSnapshot {
    readonly snapshotId: string;
    readonly resolved: ResolvedDashboard;
    readonly expiresAt: number;
    readonly signature: string;
}
export interface SnapshotVerificationResult {
    readonly valid: boolean;
    readonly expired: boolean;
    readonly tampered: boolean;
    readonly reason?: string;
}
//# sourceMappingURL=index.d.ts.map