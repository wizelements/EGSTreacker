-- ESGTracker Database Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profile table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  company_name text,
  stripe_customer_id text unique,
  subscription_status text default 'free' check (subscription_status in ('free', 'starter', 'pro', 'cancelled')),
  subscription_period text check (subscription_period in ('monthly', 'annual')),
  subscription_end_date timestamp with time zone,
  reports_used_this_month integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ESG Reports table
create table public.esg_reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  company_name text not null,
  industry text not null,
  employee_count integer,
  annual_revenue numeric,
  
  -- Scores
  environmental_score integer check (environmental_score >= 0 and environmental_score <= 100),
  social_score integer check (social_score >= 0 and social_score <= 100),
  governance_score integer check (governance_score >= 0 and governance_score <= 100),
  overall_score integer check (overall_score >= 0 and overall_score <= 100),
  
  -- Report content
  summary text,
  environmental_details text,
  social_details text,
  governance_details text,
  compliance_status text,
  recommendations jsonb,
  
  -- Input data (stored for regeneration)
  input_data jsonb,
  
  -- Metadata
  is_guest_report boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.esg_reports enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Reports policies
create policy "Users can view own reports" on public.esg_reports
  for select using (auth.uid() = user_id);

create policy "Users can insert own reports" on public.esg_reports
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own reports" on public.esg_reports
  for delete using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to reset monthly report count (run via cron)
create or replace function public.reset_monthly_reports()
returns void as $$
begin
  update public.profiles set reports_used_this_month = 0;
end;
$$ language plpgsql security definer;

-- Indexes for performance
create index idx_esg_reports_user_id on public.esg_reports(user_id);
create index idx_esg_reports_created_at on public.esg_reports(created_at desc);
create index idx_profiles_stripe_customer_id on public.profiles(stripe_customer_id);
