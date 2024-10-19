
export interface KonarrServer {
    version: string;
    commit: string;
    config: KonarrConfig;
    user?: KonarrUser;
    projects?: KonarrProjectsSummary;
    dependencies?: KonarrDependenciesSummary;
    security?: KonarrSecuritySummary;
    // Is the user in the process of logging in
    logging_in: boolean;
}

export interface KonarrConfig {
    initialised: boolean;
    registration: boolean;
}

export interface KonarrAdmin {
    loading: boolean;
    settings: [string, string][];
    project_stats: KonarrAdminProjectStats;
    users: KonarrUser[];
    userStats: KonarrAdminUserStats;
}

export interface KonarrAdminUserStats {
    total: number;
    active: number;
    inactive: number;
}

export interface KonarrAdminProjectStats {
    total: number;
    inactive: number;
    archived: number;
}

export interface KonarrUser {
    username: string;
    avatar?: string;
    role: string;
}

export interface KonarrAdminUser {
    id: number;
    username: string;
    state: string;
    role: string;
    createdAt: string;
}

export interface KonarrProjectsSummary {
    total: number;
    containers: number;
    servers: number;
}

export interface KonarrDependenciesSummary {
    total: number;
}

export interface KonarrSecuritySummary {
    advisories?: number;
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    other: number;
}

export interface Pagination<T> {
    // The data to be paginated
    data: T[];
    // In the process of loading the data
    loading: boolean;
    // Total number of items
    total: number;
    // Total number of pages
    pages: number;
    // Current page
    page: number;
    // Current item
    current: number | null;
    // Number of items per page
    limit: number;
}

export type KonarrProjects = Pagination<KonarrProject>;

export interface KonarrProject {
    id: number;
    name: string;
    title: string;
    type: string;
    status: boolean;
    snapshot?: KonarrSnapshot;
    security?: KonarrSecuritySummary;
    description?: string;
    created_at: string;
    parent?: number;
    children?: KonarrProject[];
}


export type KonarrSnapshots = Pagination<KonarrSnapshot>;

export interface KonarrSnapshot {
    id: number;
    created_at: string;
    dependencies: number;
    security: KonarrSecuritySummary;
    metadata: KonarrSnapshotMetadata;
}

export interface KonarrSnapshotMetadata {
    tool?: string;
    tool_version?: string;
    bom?: string;
    bom_version?: string;
    container_image?: string;
    container_version?: string;
}

export type KonarrDependencies = Pagination<KonarrDependency>;

export interface KonarrDependency {
    id: number;
    type: string;
    manager: string;
    name: string;
    namespace?: string;
    version?: string;
    purl?: string;
    logo?: string;
}

