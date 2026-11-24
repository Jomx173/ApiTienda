import { prisma } from "../lib/prisma.js";

interface RoleRow {
    name: string;
}

interface PermissionRow {
    key: string;
}

interface PermissionExistsRow {
    allowed: boolean;
}

function validateUserId(userId: number): void {
    if (!Number.isSafeInteger(userId) || userId <= 0) {
        throw new Error("El identificador del usuario no es válido");
    }
}

export const rbacService = {
    async getUserRoles(userId: number): Promise<string[]> {
        validateUserId(userId);

        const roles = await prisma.$queryRaw<RoleRow[]>`
            SELECT r.name
            FROM public.roles r
            INNER JOIN public.user_roles ur ON ur.role_id = r.id
            WHERE ur.user_id = ${userId}
              AND r.status = 'active'
        `;

        return roles.map((role) => role.name);
    },

    async getUserPermissions(userId: number): Promise<string[]> {
        validateUserId(userId);

        const permissions = await prisma.$queryRaw<PermissionRow[]>`
            SELECT DISTINCT
                p.key
            FROM public.permissions p
            INNER JOIN public.role_permissions rp
                ON rp.permission_id = p.id
            INNER JOIN public.roles r
                ON r.id = rp.role_id
            INNER JOIN public.user_roles ur
                ON ur.role_id = r.id
            INNER JOIN public.users u
                ON u.id = ur.user_id
            WHERE u.id = ${userId}
              AND u.status = 'active'
              AND r.status = 'active'
            ORDER BY p.key
        `;

        return permissions.map((permission) =>
            permission.key
        );
    },

    async hasPermission(
        userId: number,
        permission: string
    ): Promise<boolean> {
        validateUserId(userId);

        if (!permission.trim()) {
            return false;
        }

        const result = await prisma.$queryRaw<PermissionExistsRow[]>`
            SELECT EXISTS (
                SELECT 1
                FROM public.users u
                INNER JOIN public.user_roles ur
                    ON ur.user_id = u.id
                INNER JOIN public.roles r
                    ON r.id = ur.role_id
                INNER JOIN public.role_permissions rp
                    ON rp.role_id = r.id
                INNER JOIN public.permissions p
                    ON p.id = rp.permission_id
                WHERE u.id = ${userId}
                  AND u.status = 'active'
                  AND r.status = 'active'
                  AND p.key = ${permission}
            ) AS allowed
        `;

        return result[0]?.allowed === true;
    }
};