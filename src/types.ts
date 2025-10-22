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
  // Admin mode
  adminMode: boolean;
}

export interface KonarrConfig {
  initialised: boolean;
  registration: boolean;
}

export interface KonarrAdmin {
  loading: boolean;
  settings: { [key: string]: any };
  projectStats: KonarrAdminProjectStats;
  project_stats: KonarrAdminProjectStats;
  users: KonarrAdminUser[];
  userStats: KonarrAdminUserStats;
  // Pagination state for users list
  page?: number;
  pages?: number;
  limit?: number;
  total?: number;
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
  id: number;
  username: string;
  avatar?: string;
  role: string;
  state?: string;
}

export interface KonarrAdminUser {
  id: number;
  username: string;
  state: string;
  role: string;
  createdAt: string;
}

export interface SessionSummary {
  id: number;
  token: string;
  createdAt: string;
  lastAccessed: string;
  state: string;
}

export interface KonarrProjectsSummary {
  total: number;
  containers: number;
  servers: number;
}

export interface KonarrDependenciesSummary {
  total: number;
  // Additional dynamic properties for dependency categories
  [key: string]: any;
}

export interface KonarrSecuritySummary {
  advisories?: number;
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  malware: number;
  unmaintained: number;
  informational: number;
  unknown: number;
  other?: number;
}

export interface Pagination<T> {
  // The data to be paginated
  data: T[];
  // In the process of loading the data
  loading: boolean;
  // Total number of items
  total: number;
  // Search result count
  count: number;
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
  // Possible Parents to select from (not from API)
  parents?: KonarrProject[];
  children?: KonarrProject[];
}

export type KonarrSnapshots = Pagination<KonarrSnapshot>;

export interface KonarrSnapshot {
  id: number;
  // Status of the snapshot processing
  status: string | null;
  // Error message if snapshot processing failed
  error?: string | null;
  // ISO 8601 timestamp
  createdAt: string;
  // ISO 8601 timestamp
  updatedAt: string;
  // Number of associated dependencies
  dependencies: number;
  // Number of associated security alerts
  security: KonarrSecuritySummary;
  // Metadata extracted from the SBOM
  metadata: KonarrSnapshotMetadata;
}

export interface KonarrSnapshotMetadata {
  tool?: string;
  tool_version?: string;
  bom?: string;
  bom_version?: string;
  container_image?: string;
  container_version?: string;
  // Additional dynamic properties
  [key: string]: any;
}

export type KonarrDependencies = Pagination<KonarrDependency>;

export interface KonarrDependency {
  id: number;
  type: string;
  manager: string;
  name: string;
  namespace?: string;
  version?: string;
  versions?: string[];
  purl?: string;
  logo?: string;
  projects?: KonarrProject[];
}

export type KonarrSecurityAlerts = Pagination<KonarrSecurityAlert>;

export interface KonarrSecurityAlert {
  id: number;
  name: string;
  severity: string;
  description?: string;
  dependency?: string | KonarrDependency;
}
