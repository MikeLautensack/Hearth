export type UserRole = 'user' | 'admin'
export type AccessStatus = 'pending' | 'approved' | 'denied'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  access_status: AccessStatus
  access_requested_at: string | null
  access_granted_at: string | null
  access_granted_by: string | null
  created_at: string
  updated_at: string
}

export interface ServerConfig {
  server_host: string
  server_password: string
  discord_url: string
  mod_profile_url: string
}
