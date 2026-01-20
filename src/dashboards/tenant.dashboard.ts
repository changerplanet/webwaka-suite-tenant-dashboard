import type { DashboardDeclaration } from '../types/index.js';
import { TENANT_DASHBOARD_SECTIONS } from './tenant.sections.js';

export const TENANT_DASHBOARD: DashboardDeclaration = {
  id: 'webwaka-tenant-dashboard',
  name: 'WebWaka Tenant Dashboard',
  type: 'tenant',
  version: '1.0.0',
  sections: TENANT_DASHBOARD_SECTIONS
} as const;
