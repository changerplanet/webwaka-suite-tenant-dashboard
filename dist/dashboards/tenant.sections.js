export const TENANT_DASHBOARD_SECTIONS = [
    {
        id: 'tenant-overview',
        label: 'Tenant Overview',
        order: 1,
        gating: {
            permissions: ['tenant:overview:read'],
            entitlements: [],
            featureFlags: []
        }
    },
    {
        id: 'users-roles',
        label: 'Users & Roles',
        order: 2,
        gating: {
            permissions: ['users:read'],
            entitlements: ['user-management'],
            featureFlags: []
        }
    },
    {
        id: 'products-services',
        label: 'Products / Services',
        order: 3,
        gating: {
            permissions: ['catalog:read'],
            entitlements: [],
            featureFlags: []
        }
    },
    {
        id: 'sales-pos',
        label: 'Sales / POS',
        order: 4,
        gating: {
            permissions: ['pos:read'],
            entitlements: ['pos-access'],
            featureFlags: ['pos-enabled']
        }
    },
    {
        id: 'inventory',
        label: 'Inventory',
        order: 5,
        gating: {
            permissions: ['inventory:read'],
            entitlements: ['inventory-access'],
            featureFlags: ['inventory-enabled']
        }
    },
    {
        id: 'billing-subscriptions',
        label: 'Billing & Subscriptions',
        order: 6,
        gating: {
            permissions: ['billing:read'],
            entitlements: ['billing-access'],
            featureFlags: []
        }
    },
    {
        id: 'receipts-transactions',
        label: 'Receipts & Transactions',
        order: 7,
        gating: {
            permissions: ['receipts:read'],
            entitlements: [],
            featureFlags: []
        }
    },
    {
        id: 'incentives-rewards',
        label: 'Incentives & Rewards',
        order: 8,
        gating: {
            permissions: ['incentives:read'],
            entitlements: ['incentives-access'],
            featureFlags: ['incentives-enabled']
        }
    },
    {
        id: 'branding',
        label: 'Branding (Tenant-level)',
        order: 9,
        gating: {
            permissions: ['branding:read'],
            entitlements: ['tenant-branding'],
            featureFlags: ['whitelabel-enabled']
        }
    },
    {
        id: 'audit-activity',
        label: 'Audit & Activity',
        order: 10,
        gating: {
            permissions: ['audit:read'],
            entitlements: ['audit-access'],
            featureFlags: []
        }
    },
    {
        id: 'ai-automation',
        label: 'AI / Automation',
        order: 11,
        gating: {
            permissions: ['ai:read'],
            entitlements: ['ai-access'],
            featureFlags: ['ai-features-enabled']
        }
    },
    {
        id: 'settings',
        label: 'Settings',
        order: 12,
        gating: {
            permissions: ['tenant:settings:read'],
            entitlements: [],
            featureFlags: []
        }
    }
];
