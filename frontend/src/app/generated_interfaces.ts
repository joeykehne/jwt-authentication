export interface I_Permission {
    id: string;
    name: string;
    description: string;
    roles: I_Role[];
}

export interface I_RefreshToken {
    id: string;
    refreshToken: string;
    expiresAt: Date;
    user: I_User;
}

export interface I_Role {
    id: string;
    name: string;
    permissions: I_Permission[];
    users: I_User[];
}

export interface I_User {
    id: string;
    name: string;
    password: string;
    email: string;
    roles: I_Role[];
    refreshTokens: I_RefreshToken[];
    changePasswordToken: string;
    isPaying: boolean;
    emailVerified: boolean;
    profilePictureUrl: string;
    registeredAt: Date;
    lastLogin: Date;
}

