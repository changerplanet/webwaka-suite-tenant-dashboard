import { TENANT_DASHBOARD } from '../dashboards/tenant.dashboard.js';
import { resolveDashboard } from './phase4aConsumer.js';
import { generateDashboardSnapshot, verifyDashboardSnapshot, evaluateFromSnapshot } from './snapshotEngine.js';
export class TenantDashboardResolver {
    resolve(context) {
        return resolveDashboard(TENANT_DASHBOARD, context);
    }
    generateSnapshot(resolved, expirationHours) {
        return generateDashboardSnapshot(resolved, expirationHours);
    }
    verifySnapshot(snapshot, currentTime) {
        return verifyDashboardSnapshot(snapshot, currentTime);
    }
    evaluateOffline(snapshot, currentTime) {
        return evaluateFromSnapshot(snapshot, currentTime);
    }
    resolveAndSnapshot(context, expirationHours) {
        const resolved = this.resolve(context);
        const snapshot = this.generateSnapshot(resolved, expirationHours);
        return { resolved, snapshot };
    }
}
export const tenantDashboardResolver = new TenantDashboardResolver();
