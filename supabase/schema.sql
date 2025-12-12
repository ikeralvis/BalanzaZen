-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,

  constraint username_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for measurements
create table measurements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  date date default current_date not null,
  weight numeric,
  bmi numeric,
  body_fat_percent numeric,
  fat_mass_kg numeric,
  muscle_mass_kg numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for measurements
alter table measurements enable row level security;

create policy "Users can view own measurements." on measurements
  for select using (auth.uid() = user_id);

create policy "Users can insert own measurements." on measurements
  for insert with check (auth.uid() = user_id);

create policy "Users can update own measurements." on measurements
  for update using (auth.uid() = user_id);

create policy "Users can delete own measurements." on measurements
  for delete using (auth.uid() = user_id);

-- Set up Realtime for measurements (optional, for live updates)
alter publication supabase_realtime add table measurements;
