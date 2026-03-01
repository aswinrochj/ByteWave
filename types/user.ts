export interface User {
    id: string;
    email: string;
    role: 'student' | 'recruiter' | 'institution';
    name: string;
    username?: string;
    avatarUrl?: string;
    location?: string;
    bio?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    byteCoin?: number;
    department?: string;
    createdAt: Date;
    videoIntroUrl?: string;
    certificates?: Certificate[];
}

export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    issueDate: string;
    description?: string;
    verificationLink?: string;
    fileUrl: string;
    badgeType: 'Self Uploaded' | 'Verified' | 'ByteWave Earned';
}

export interface RecruiterProfile extends User {
    companyName?: string;
    companyWebsite?: string;
    industry?: string;
    position?: string;
    verifiedOffice?: boolean;
}

export interface InstitutionProfile extends User {
    institutionName?: string;
    institutionType?: 'college' | 'university' | 'bootcamp';
    department?: string;
    accreditation?: string;
}

export interface Session {
    user: User;
    expires: Date;
    accessToken: string;
}

export interface SkillDNA {
    logicScore: number;
    patternStrength: number;
    optimizationRating: number;
    consistencyScore: number;
    skillScore: number;
    growthCurve: number;
    streak: number;
    byteCoin: number;
    lastUpdated?: Date;
}
