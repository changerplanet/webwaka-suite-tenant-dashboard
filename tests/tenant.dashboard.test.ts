import { describe, it, expect } from 'vitest';
import { TENANT_DASHBOARD } from '../src/dashboards/tenant.dashboard.js';
import { TENANT_DASHBOARD_SECTIONS } from '../src/dashboards/tenant.sections.js';
import { resolveDashboard } from '../src/engine/phase4aConsumer.js';
import {
  generateDashboardSnapshot,
  verifyDashboardSnapshot,
  evaluateFromSnapshot
} from '../src/engine/snapshotEngine.js';
import { TenantDashboardResolver } from '../src/engine/tenantDashboardResolver.js';
import type { EvaluationContext } from '../src/types/index.js';

describe('Tenant Dashboard Declaration', () => {
  it('should have exactly 12 sections', () => {
    expect(TENANT_DASHBOARD_SECTIONS.length).toBe(12);
  });

  it('should be JSON-serializable', () => {
    const serialized = JSON.stringify(TENANT_DASHBOARD);
    const parsed = JSON.parse(serialized);
    expect(parsed.id).toBe(TENANT_DASHBOARD.id);
    expect(parsed.sections.length).toBe(12);
  });

  it('should have deterministic ordering', () => {
    const orders = TENANT_DASHBOARD_SECTIONS.map((s) => s.order);
    expect(orders).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('should match required section IDs', () => {
    const expectedIds = [
      'tenant-overview',
      'users-roles',
      'products-services',
      'sales-pos',
      'inventory',
      'billing-subscriptions',
      'receipts-transactions',
      'incentives-rewards',
      'branding',
      'audit-activity',
      'ai-automation',
      'settings'
    ];
    const actualIds = TENANT_DASHBOARD_SECTIONS.map((s) => s.id);
    expect(actualIds).toEqual(expectedIds);
  });
});

describe('Visibility Gating', () => {
  const baseContext: EvaluationContext = {
    tenantId: 'tenant-123',
    userId: 'user-456',
    permissions: [],
    entitlements: [],
    featureFlags: [],
    timestamp: Date.now()
  };

  it('should hide section when permission is missing', () => {
    const resolved = resolveDashboard(TENANT_DASHBOARD, baseContext);
    const overviewSection = resolved.sections.find((s) => s.id === 'tenant-overview');
    expect(overviewSection?.visible).toBe(false);
    expect(overviewSection?.hiddenReasons).toContain('Missing permission: tenant:overview:read');
  });

  it('should show section when permission is present', () => {
    const context: EvaluationContext = {
      ...baseContext,
      permissions: ['tenant:overview:read']
    };
    const resolved = resolveDashboard(TENANT_DASHBOARD, context);
    const overviewSection = resolved.sections.find((s) => s.id === 'tenant-overview');
    expect(overviewSection?.visible).toBe(true);
    expect(overviewSection?.hiddenReasons).toHaveLength(0);
  });

  it('should hide section when entitlement is missing', () => {
    const context: EvaluationContext = {
      ...baseContext,
      permissions: ['users:read']
    };
    const resolved = resolveDashboard(TENANT_DASHBOARD, context);
    const usersSection = resolved.sections.find((s) => s.id === 'users-roles');
    expect(usersSection?.visible).toBe(false);
    expect(usersSection?.hiddenReasons).toContain('Missing entitlement: user-management');
  });

  it('should hide section when feature flag is disabled', () => {
    const context: EvaluationContext = {
      ...baseContext,
      permissions: ['pos:read'],
      entitlements: ['pos-access']
    };
    const resolved = resolveDashboard(TENANT_DASHBOARD, context);
    const posSection = resolved.sections.find((s) => s.id === 'sales-pos');
    expect(posSection?.visible).toBe(false);
    expect(posSection?.hiddenReasons).toContain('Feature flag disabled: pos-enabled');
  });

  it('should show section only when all gating requirements are met', () => {
    const context: EvaluationContext = {
      ...baseContext,
      permissions: ['pos:read'],
      entitlements: ['pos-access'],
      featureFlags: ['pos-enabled']
    };
    const resolved = resolveDashboard(TENANT_DASHBOARD, context);
    const posSection = resolved.sections.find((s) => s.id === 'sales-pos');
    expect(posSection?.visible).toBe(true);
    expect(posSection?.hiddenReasons).toHaveLength(0);
  });
});

describe('Determinism', () => {
  it('should produce identical output for same input (10x repeat test)', () => {
    const context: EvaluationContext = {
      tenantId: 'tenant-abc',
      userId: 'user-xyz',
      permissions: ['tenant:overview:read', 'users:read', 'catalog:read'],
      entitlements: ['user-management'],
      featureFlags: [],
      timestamp: 1700000000000
    };

    const results: string[] = [];
    for (let i = 0; i < 10; i++) {
      const resolved = resolveDashboard(TENANT_DASHBOARD, context);
      results.push(JSON.stringify(resolved));
    }

    const firstResult = results[0];
    for (const result of results) {
      expect(result).toBe(firstResult);
    }
  });
});

describe('Snapshot Integrity', () => {
  const fullContext: EvaluationContext = {
    tenantId: 'tenant-snapshot-test',
    userId: 'user-snapshot-test',
    permissions: ['tenant:overview:read'],
    entitlements: [],
    featureFlags: [],
    timestamp: Date.now()
  };

  it('should verify valid snapshot', () => {
    const resolved = resolveDashboard(TENANT_DASHBOARD, fullContext);
    const snapshot = generateDashboardSnapshot(resolved, 24);
    const verification = verifyDashboardSnapshot(snapshot);
    expect(verification.valid).toBe(true);
    expect(verification.expired).toBe(false);
    expect(verification.tampered).toBe(false);
  });

  it('should fail verification for tampered snapshot', () => {
    const resolved = resolveDashboard(TENANT_DASHBOARD, fullContext);
    const snapshot = generateDashboardSnapshot(resolved, 24);
    const tamperedSnapshot = {
      ...snapshot,
      resolved: {
        ...snapshot.resolved,
        tenantId: 'hacked-tenant'
      }
    };
    const verification = verifyDashboardSnapshot(tamperedSnapshot);
    expect(verification.valid).toBe(false);
    expect(verification.tampered).toBe(true);
  });

  it('should fail verification for expired snapshot', () => {
    const resolved = resolveDashboard(TENANT_DASHBOARD, fullContext);
    const snapshot = generateDashboardSnapshot(resolved, 1);
    const futureTime = snapshot.expiresAt + 1000;
    const verification = verifyDashboardSnapshot(snapshot, futureTime);
    expect(verification.valid).toBe(false);
    expect(verification.expired).toBe(true);
  });

  it('should throw error when evaluating invalid snapshot', () => {
    const resolved = resolveDashboard(TENANT_DASHBOARD, fullContext);
    const snapshot = generateDashboardSnapshot(resolved, 1);
    const futureTime = snapshot.expiresAt + 1000;
    expect(() => evaluateFromSnapshot(snapshot, futureTime)).toThrow(
      'Snapshot evaluation failed'
    );
  });

  it('should return identical resolved dashboard from valid snapshot', () => {
    const resolved = resolveDashboard(TENANT_DASHBOARD, fullContext);
    const snapshot = generateDashboardSnapshot(resolved, 24);
    const offlineResolved = evaluateFromSnapshot(snapshot);
    expect(JSON.stringify(offlineResolved)).toBe(JSON.stringify(resolved));
  });
});

describe('Tenant Isolation', () => {
  it('should throw error when tenantId is missing', () => {
    const invalidContext = {
      tenantId: '',
      userId: 'user-123',
      permissions: ['tenant:overview:read'],
      entitlements: [],
      featureFlags: [],
      timestamp: Date.now()
    };
    expect(() => resolveDashboard(TENANT_DASHBOARD, invalidContext)).toThrow(
      'Tenant isolation violation'
    );
  });

  it('should include tenantId in resolved dashboard', () => {
    const context: EvaluationContext = {
      tenantId: 'isolated-tenant-999',
      userId: 'user-abc',
      permissions: [],
      entitlements: [],
      featureFlags: [],
      timestamp: Date.now()
    };
    const resolved = resolveDashboard(TENANT_DASHBOARD, context);
    expect(resolved.tenantId).toBe('isolated-tenant-999');
  });
});

describe('Hard-Stop Condition: Deterministic Explainable Verifiable Result', () => {
  it('HARD-STOP: Tenant receives deterministic, explainable, verifiable dashboard both online and offline', () => {
    const currentTime = Date.now();
    const context: EvaluationContext = {
      tenantId: 'hard-stop-tenant',
      userId: 'hard-stop-user',
      permissions: ['tenant:overview:read', 'pos:read', 'billing:read'],
      entitlements: ['pos-access', 'billing-access'],
      featureFlags: ['pos-enabled'],
      timestamp: currentTime
    };

    const onlineResolved = resolveDashboard(TENANT_DASHBOARD, context);

    expect(onlineResolved.sections.find((s) => s.id === 'tenant-overview')?.visible).toBe(true);
    expect(onlineResolved.sections.find((s) => s.id === 'sales-pos')?.visible).toBe(true);
    expect(onlineResolved.sections.find((s) => s.id === 'billing-subscriptions')?.visible).toBe(true);

    const inventorySection = onlineResolved.sections.find((s) => s.id === 'inventory');
    expect(inventorySection?.visible).toBe(false);
    expect(inventorySection?.hiddenReasons).toContain('Missing permission: inventory:read');

    const snapshot = generateDashboardSnapshot(onlineResolved, 24);
    const verification = verifyDashboardSnapshot(snapshot, currentTime);
    expect(verification.valid).toBe(true);

    const offlineResolved = evaluateFromSnapshot(snapshot, currentTime);
    expect(JSON.stringify(offlineResolved)).toBe(JSON.stringify(onlineResolved));

    for (let i = 0; i < 5; i++) {
      const repeatResolved = resolveDashboard(TENANT_DASHBOARD, context);
      expect(JSON.stringify(repeatResolved)).toBe(JSON.stringify(onlineResolved));
    }
  });
});

describe('TenantDashboardResolver Class', () => {
  const resolver = new TenantDashboardResolver();

  it('should resolve dashboard through resolver class', () => {
    const context: EvaluationContext = {
      tenantId: 'resolver-tenant',
      userId: 'resolver-user',
      permissions: ['tenant:overview:read'],
      entitlements: [],
      featureFlags: [],
      timestamp: Date.now()
    };
    const resolved = resolver.resolve(context);
    expect(resolved.tenantId).toBe('resolver-tenant');
  });

  it('should generate and verify snapshot through resolver class', () => {
    const context: EvaluationContext = {
      tenantId: 'resolver-snapshot-tenant',
      userId: 'resolver-snapshot-user',
      permissions: [],
      entitlements: [],
      featureFlags: [],
      timestamp: Date.now()
    };
    const resolved = resolver.resolve(context);
    const snapshot = resolver.generateSnapshot(resolved, 48);
    const verification = resolver.verifySnapshot(snapshot);
    expect(verification.valid).toBe(true);
  });

  it('should evaluate offline through resolver class', () => {
    const context: EvaluationContext = {
      tenantId: 'offline-tenant',
      userId: 'offline-user',
      permissions: ['tenant:overview:read'],
      entitlements: [],
      featureFlags: [],
      timestamp: Date.now()
    };
    const resolved = resolver.resolve(context);
    const snapshot = resolver.generateSnapshot(resolved);
    const offlineResult = resolver.evaluateOffline(snapshot);
    expect(offlineResult.tenantId).toBe('offline-tenant');
  });

  it('should resolve and snapshot in one call', () => {
    const context: EvaluationContext = {
      tenantId: 'combined-tenant',
      userId: 'combined-user',
      permissions: [],
      entitlements: [],
      featureFlags: [],
      timestamp: Date.now()
    };
    const { resolved, snapshot } = resolver.resolveAndSnapshot(context, 12);
    expect(resolved.tenantId).toBe('combined-tenant');
    expect(snapshot.resolved.tenantId).toBe('combined-tenant');
  });
});
