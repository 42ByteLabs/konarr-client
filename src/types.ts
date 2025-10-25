/**
 * Types for Konarr application
 * Based on: https://github.com/42ByteLabs/konarr/tree/main/server/src/api
 */

/** Pagination Helper Type
 *
 * Generic pagination structure used by the frontend stores
 * Wraps API responses with additional client-side pagination state
 */
export interface Pagination<T> {
  /** The array of paginated items */
  data: T[];
  /** Loading state indicator (client-side only) */
  loading: boolean;
  /** Total number of items across all pages (from API) */
  total: number;
  /** Number of items in current result set (from API) */
  count: number;
  /** Total number of pages available (from API) */
  pages: number;
  /** Current page number (0-indexed) */
  page: number;
  /** Currently selected/viewed item ID (client-side only) */
  current: number | null;
  /** Number of items per page */
  limit: number;
}

/** Server Information
 *
 * Response from GET /api/
 * Contains version info, config, and user session data
 */
export interface ServerInfo {
  /** Server version (semver format) */
  version: string;
  /** Git commit SHA of the build */
  commit: string;
  /** Server configuration settings */
  config: Config;
  /** Current authenticated user (if logged in) */
  user?: User;
  /** Summary statistics for all projects */
  projects?: ProjectsSummary;
  /** Summary statistics for all dependencies */
  dependencies?: DependenciesSummary;
  /** Summary statistics for security alerts */
  security?: SecuritySummary;
}

/** Server Configuration
 *
 * Configuration settings returned by the API
 */
export interface Config {
  /** Whether the server has been initialized with first user */
  initialised: boolean;
  /** Whether new user registration is enabled */
  registration: boolean;
}

/** Admin User Statistics
 *
 * Statistics about users in the system (admin only)
 */
export interface AdminUserStats {
  /** Total number of users */
  total: number;
  /** Number of active users */
  active: number;
  /** Number of inactive/disabled users */
  inactive: number;
}

/** Admin Project Statistics
 *
 * Statistics about projects in the system (admin only)
 */
export interface AdminProjectStats {
  /** Total number of projects */
  total: number;
  /** Number of inactive projects */
  inactive: number;
  /** Number of archived projects */
  archived: number;
}

/** User Information
 *
 * Response from GET /api/user/whoami
 * Represents the current authenticated user
 */
export interface User {
  /** Username of the user */
  username: string;
  /** Avatar URL (optional) */
  avatar?: string;
  /** User role (Admin, User) */
  role: string;
  /** User state (Active, Disabled, Reset) */
  state: string;
  /** ISO 8601 timestamp when user account was created */
  createdAt: string;
  /** ISO 8601 timestamp of last login */
  lastLogin: string;
}

/** Admin User Summary
 *
 * Response from GET /api/admin/users
 * Summary information about a user (admin view)
 */
export interface AdminUser {
  /** User ID */
  id: number;
  /** Username */
  username: string;
  /** User state (Active, Disabled, Reset) */
  state: string;
  /** User role (Admin, User) */
  role: string;
  /** ISO 8601 timestamp when user was created */
  createdAt: string;
}

/** Session Summary
 *
 * Response from GET /api/user/sessions
 * Information about a user session
 */
export interface SessionSummary {
  /** Session ID */
  id: number;
  /** ISO 8601 timestamp when session was created */
  createdAt: string;
  /** ISO 8601 timestamp of last session access */
  lastAccessed: string;
  /** Session state (Active, Expired) */
  state: string;
}

/** Projects Summary
 *
 * Summary statistics for all projects in the system
 */
export interface ProjectsSummary {
  /** Total number of active projects */
  total: number;
  /** Number of container projects */
  containers: number;
  /** Number of server projects */
  servers: number;
}

/** Dependencies Summary
 *
 * Summary statistics for all dependencies/components
 * Includes totals for different component types
 */
export interface DependenciesSummary {
  /** Total number of dependencies */
  total: number;
  /** Number of library dependencies */
  libraries?: number;
  /** Number of application dependencies */
  applications?: number;
  /** Number of framework dependencies */
  frameworks?: number;
  /** Number of operating system dependencies */
  "operating-systems"?: number;
  /** Number of language dependencies */
  languages?: number;
  /** Number of package manager dependencies */
  "package-managers"?: number;
  /** Number of compression library dependencies */
  "compression-libraries"?: number;
  /** Number of cryptographic library dependencies */
  "cryptographic-libraries"?: number;
  /** Number of database dependencies */
  databases?: number;
  /** Number of operating environment dependencies */
  "operating-environments"?: number;
  /** Number of middleware dependencies */
  middleware?: number;
  /** Additional dynamic properties for other dependency categories */
  [key: string]: any;
}

/** Security Summary
 *
 * Summary of security alerts by severity level
 * Used for projects, snapshots, and global statistics
 */
export interface SecuritySummary {
  /** Number of security advisories (optional) */
  advisories?: number;
  /** Total number of security alerts */
  total: number;
  /** Number of critical severity alerts */
  critical: number;
  /** Number of high severity alerts */
  high: number;
  /** Number of medium severity alerts */
  medium: number;
  /** Number of low severity alerts */
  low: number;
  /** Number of malware alerts */
  malware: number;
  /** Number of unmaintained dependency alerts */
  unmaintained: number;
  /** Number of informational alerts */
  informational: number;
  /** Number of unknown severity alerts */
  unknown: number;
  /** Number of other category alerts */
  other?: number;
}

/** Admin Response
 *
 * Response from GET /api/admin/ and PATCH /api/admin/
 * Contains all admin-related data and settings
 * Rust source: server/src/api/admin.rs AdminResponse
 */
export interface AdminSettings {
  /** Server settings as key-value pairs (setting name -> value) */
  settings: { [key: string]: string };
  /** Project statistics */
  projectStats: AdminProjectStats;
  /** List of all users in the system */
  users: AdminUser[];
  /** User statistics */
  userStats: AdminUserStats;
}

/** Projects Collection
 *
 * Response from GET /api/projects
 * Paginated list of projects
 */
export type Projects = Pagination<Project>;

/** Project
 *
 * Response from GET /api/projects/:id
 * Represents a single project (application, server, container, cluster, or group)
 */
export interface Project {
  /** Project ID */
  id: number;
  /** Project name (unique identifier, e.g., "org/project") */
  name: string;
  /** Display title for the project */
  title: string;
  /** Project type (Application, Server, Container, Cluster, Group) */
  type: string;
  /** Online/offline status (from latest snapshot metadata) */
  status: boolean;
  /** Latest snapshot associated with this project */
  snapshot?: Snapshot;
  /** Security summary from latest snapshot */
  security?: SecuritySummary;
  /** Project description */
  description?: string;
  /** ISO 8601 timestamp when project was created */
  created_at: string;
  /** Parent project ID (for hierarchical projects) */
  parent?: number;
  /** Possible parent projects to select from (client-side only) */
  parents?: Project[];
  /** Child projects (for Groups and Clusters) */
  children?: Project[];
}

/** Snapshots Collection
 *
 * Response from GET /api/snapshots
 * Paginated list of snapshots for a project
 */
export type Snapshots = Pagination<Snapshot>;

/** Snapshot
 *
 * Response from GET /api/snapshots/:id
 * Represents a snapshot (point-in-time scan) of a project's dependencies and security state
 * Created by uploading an SBOM (Software Bill of Materials)
 */
export interface Snapshot {
  /** Snapshot ID */
  id: number;
  /** Processing status (Pending, Processing, Complete, Failed) */
  status: string | null;
  /** Error message if snapshot processing failed */
  error?: string | null;
  /** ISO 8601 timestamp when snapshot was created */
  createdAt: string;
  /** ISO 8601 timestamp when snapshot was last updated */
  updatedAt: string;
  /** Number of dependencies found in this snapshot */
  dependencies: number;
  /** Security summary for this snapshot */
  security: SecuritySummary;
  /** Metadata extracted from the SBOM */
  metadata: SnapshotMetadata;
}

/** Snapshot Metadata
 *
 * Key-value metadata extracted from the SBOM file
 * Contains information about the scan tool, BOM format, and custom metadata
 */
export interface SnapshotMetadata {
  /** Name of the tool that generated the SBOM (e.g., "syft", "grype", "trivy") */
  tool?: string;
  /** Version of the tool */
  tool_version?: string;
  /** BOM format (e.g., "CycloneDX", "SPDX") */
  bom?: string;
  /** BOM format version */
  bom_version?: string;
  /** Container image name (for container scans) */
  container_image?: string;
  /** Container image version/tag */
  container_version?: string;
  /** Additional custom metadata fields */
  [key: string]: any;
}

/** Dependencies Collection
 *
 * Response from GET /api/dependencies
 * Paginated list of dependencies (components)
 */
export type Dependencies = Pagination<Dependency>;

/** Dependency (Component)
 *
 * Response from GET /api/dependencies/:id
 * Represents a software dependency/component found in project snapshots
 * Aggregated across all projects and versions
 */
export interface Dependency {
  /** Dependency ID (component ID) */
  id: number;
  /** Component type (Library, Application, Framework, Operating-System, etc.) */
  type: string;
  /** Package manager (npm, maven, pypi, gem, etc.) */
  manager: string;
  /** Component name */
  name: string;
  /** Component namespace (e.g., "@organization" for npm scoped packages) */
  namespace?: string;
  /** Specific version (when viewing a single version) */
  version?: string;
  /** All versions found across projects */
  versions?: string[];
  /** Package URL (purl) - universal identifier */
  purl?: string;
  /** Logo URL for the dependency */
  logo?: string;
  /** Projects that use this dependency */
  projects?: Project[];
}

/** Security Alerts Collection
 *
 * Response from GET /api/security
 * Paginated list of security alerts/advisories
 */
export type SecurityAlerts = Pagination<SecurityAlert>;

/** Security Alert
 *
 * Response from GET /api/security/:id
 * Represents a security vulnerability or advisory affecting a dependency
 */
export interface SecurityAlert {
  /** Alert ID */
  id: number;
  /** Alert/CVE identifier (e.g., "CVE-2024-1234", "GHSA-xxxx-xxxx-xxxx") */
  name: string;
  /** Severity level (Critical, High, Medium, Low, Informational, Unknown) */
  severity: string;
  /** Description of the vulnerability */
  description?: string;
  /** Affected dependency (can be dependency name string or full object) */
  dependency?: string | Dependency;
}
