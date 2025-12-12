-- Create a table for public profiles
drop table if exists profiles cascade;
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  age integer,
  height numeric, -- stored in cm
  target_weight numeric,
  created_at timestamp with time zone default now(),

  constraint full_name_length check (char_length(full_name) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- Trigger to call the function on signup
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, age, height)
  values (new.id, new.raw_user_meta_data->>'full_name', (new.raw_user_meta_data->>'age')::int, (new.raw_user_meta_data->>'height')::numeric);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
