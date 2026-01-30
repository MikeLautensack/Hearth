# Hearth - Mike's Valheim Server Portal

A web portal for managing access to a private modded Valheim server. Users can request access, and admins can approve or deny requests. Approved users get access to server details, mod installation instructions, and more.

## Features

- **Google OAuth Authentication** - Sign in with Google via Supabase Auth
- **Access Request System** - Users can request access to the server
- **Admin Panel** - Approve/deny access requests, manage users, promote to admin
- **Server Dashboard** - View server address, password, Discord link, and mod profile
- **Setup Instructions** - Detailed r2modman installation and mod setup guide

## Tech Stack

- **Next.js 16** - React framework with App Router
- **Supabase** - Authentication and database
- **Tailwind CSS 4** - Styling
- **TypeScript** - Type safety

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd hearth
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Authentication > Providers** and enable Google OAuth
3. Copy your project URL and anon key from **Settings > API**

### 3. Set Up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Run the SQL from `supabase-schema.sql` to create the profiles table
3. After signing in for the first time, run the SQL at the bottom of the schema file to make yourself an admin

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key

# Valheim Server Configuration
VALHEIM_SERVER_HOST=your-server.com:2456
VALHEIM_SERVER_PASSWORD=your-password

# Discord & Mods
DISCORD_INVITE_URL=https://discord.gg/your-invite
MOD_PROFILE_URL=https://thunderstore.io/package/your-profile
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Making Yourself an Admin

After signing in for the first time:

1. Go to Supabase **SQL Editor**
2. Find your user ID:
   ```sql
   SELECT id, email FROM auth.users;
   ```
3. Insert your admin profile:
   ```sql
   INSERT INTO profiles (id, email, full_name, role, access_status, access_granted_at)
   VALUES (
     'your-user-id-here',
     'your@email.com',
     'Mike',
     'admin',
     'approved',
     NOW()
   );
   ```

## Pages

- `/` - Landing page with server info and sign-up CTA
- `/sign-in` - Google OAuth sign-in
- `/request-access` - Request access form (for authenticated users)
- `/dashboard` - Server info for approved users
- `/admin` - Admin panel for managing access requests

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/hearth)

Make sure to add your environment variables in the Vercel dashboard.

## License

MIT
