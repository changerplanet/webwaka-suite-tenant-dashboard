function evaluateSectionVisibility(section, context) {
    const hiddenReasons = [];
    for (const permission of section.gating.permissions) {
        if (!context.permissions.includes(permission)) {
            hiddenReasons.push(`Missing permission: ${permission}`);
        }
    }
    for (const entitlement of section.gating.entitlements) {
        if (!context.entitlements.includes(entitlement)) {
            hiddenReasons.push(`Missing entitlement: ${entitlement}`);
        }
    }
    for (const flag of section.gating.featureFlags) {
        if (!context.featureFlags.includes(flag)) {
            hiddenReasons.push(`Feature flag disabled: ${flag}`);
        }
    }
    return {
        id: section.id,
        label: section.label,
        order: section.order,
        visible: hiddenReasons.length === 0,
        hiddenReasons
    };
}
export function resolveDashboard(declaration, context) {
    if (!context.tenantId) {
        throw new Error('Tenant isolation violation: tenantId is required');
    }
    const resolvedSections = declaration.sections
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((section) => evaluateSectionVisibility(section, context));
    return {
        declarationId: declaration.id,
        declarationVersion: declaration.version,
        tenantId: context.tenantId,
        userId: context.userId,
        resolvedAt: context.timestamp,
        sections: resolvedSections
    };
}
