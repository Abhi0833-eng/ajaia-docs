import { describe, it, expect } from 'vitest';

export function checkUserPermission(
  docOwnerId: string,
  shares: { userId: string; role: 'VIEWER' | 'EDITOR' }[],
  userId: string
): 'OWNER' | 'EDITOR' | 'VIEWER' | null {
  if (docOwnerId === userId) return 'OWNER';
  const share = shares.find((s) => s.userId === userId);
  if (share) return share.role;
  return null;
}

export function canEditDocument(role: 'OWNER' | 'EDITOR' | 'VIEWER' | null): boolean {
  return role === 'OWNER' || role === 'EDITOR';
}

describe('Document Access Control & Permissions', () => {
  const docOwnerId = 'usr_alex_01';
  const shares = [
    { userId: 'usr_sarah_02', role: 'EDITOR' as const },
    { userId: 'usr_devin_03', role: 'VIEWER' as const },
  ];

  it('should assign OWNER role to the document creator', () => {
    const role = checkUserPermission(docOwnerId, shares, 'usr_alex_01');
    expect(role).toBe('OWNER');
    expect(canEditDocument(role)).toBe(true);
  });

  it('should grant EDITOR edit rights for explicitly shared editors', () => {
    const role = checkUserPermission(docOwnerId, shares, 'usr_sarah_02');
    expect(role).toBe('EDITOR');
    expect(canEditDocument(role)).toBe(true);
  });

  it('should restrict VIEWER to read-only mode and disallow editing', () => {
    const role = checkUserPermission(docOwnerId, shares, 'usr_devin_03');
    expect(role).toBe('VIEWER');
    expect(canEditDocument(role)).toBe(false);
  });

  it('should deny access to uninvited third-party users', () => {
    const role = checkUserPermission(docOwnerId, shares, 'usr_stranger_99');
    expect(role).toBeNull();
    expect(canEditDocument(role)).toBe(false);
  });
});
