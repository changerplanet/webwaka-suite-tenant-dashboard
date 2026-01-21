import CryptoJS from 'crypto-js';
let configuredSecret = null;
export function configureSnapshotSecret(secret) {
    if (!secret || secret.length < 32) {
        throw new Error('Snapshot secret must be at least 32 characters');
    }
    configuredSecret = secret;
}
export function clearSnapshotSecret() {
    configuredSecret = null;
}
function getSecret() {
    if (!configuredSecret) {
        throw new Error('Snapshot secret not configured. Call configureSnapshotSecret() first.');
    }
    return configuredSecret;
}
function generateSnapshotId() {
    return `snap-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
function computeSignature(resolved, expiresAt, secret) {
    const payload = JSON.stringify({ resolved, expiresAt });
    return CryptoJS.HmacSHA256(payload, secret).toString();
}
export function generateDashboardSnapshot(resolved, expirationHours = 24) {
    const secret = getSecret();
    const expiresAt = resolved.resolvedAt + expirationHours * 60 * 60 * 1000;
    const signature = computeSignature(resolved, expiresAt, secret);
    return {
        snapshotId: generateSnapshotId(),
        resolved,
        expiresAt,
        signature
    };
}
export function verifyDashboardSnapshot(snapshot, currentTime) {
    const secret = getSecret();
    const now = currentTime ?? Date.now();
    if (now > snapshot.expiresAt) {
        return {
            valid: false,
            expired: true,
            tampered: false,
            reason: 'Snapshot has expired'
        };
    }
    const expectedSignature = computeSignature(snapshot.resolved, snapshot.expiresAt, secret);
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
export function evaluateFromSnapshot(snapshot, currentTime) {
    const verification = verifyDashboardSnapshot(snapshot, currentTime);
    if (!verification.valid) {
        throw new Error(`Snapshot evaluation failed: ${verification.reason}`);
    }
    return snapshot.resolved;
}
