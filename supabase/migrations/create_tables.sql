-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  name text,
  role text check (role in ('ADMIN', 'COMPANY', 'USER')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create companies table
create table companies (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  description text,
  logo_url text,
  website text,
  industry text,
  founded_year integer,
  size text,
  verified boolean default false,
  rating float default 0,
  total_reviews integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  company_id uuid references companies on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  title text not null,
  content text not null,
  pros text,
  cons text,
  verified_purchase boolean default false,
  helpful_votes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create company_responses table
create table company_responses (
  id uuid default uuid_generate_v4() primary key,
  review_id uuid references reviews on delete cascade,
  company_id uuid references companies on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories table
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create company_categories junction table
create table company_categories (
  company_id uuid references companies on delete cascade,
  category_id uuid references categories on delete cascade,
  primary key (company_id, category_id)
);

-- Create RLS policies
alter table profiles enable row level security;
alter table companies enable row level security;
alter table reviews enable row level security;
alter table company_responses enable row level security;
alter table categories enable row level security;
alter table company_categories enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Companies policies
create policy "Companies are viewable by everyone"
  on companies for select
  using ( true );

create policy "Company owners can update their company"
  on companies for update
  using ( auth.uid() = user_id );

-- Reviews policies
create policy "Reviews are viewable by everyone"
  on reviews for select
  using ( true );

create policy "Authenticated users can create reviews"
  on reviews for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update own reviews"
  on reviews for update
  using ( auth.uid() = user_id );

-- Company responses policies
create policy "Responses are viewable by everyone"
  on company_responses for select
  using ( true );

create policy "Company owners can respond to reviews"
  on company_responses for insert
  with check ( 
    exists (
      select 1 from companies
      where id = company_id
      and user_id = auth.uid()
    )
  );
