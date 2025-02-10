-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'company', 'user')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    total_reviews INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_helpful INTEGER DEFAULT 0
);

-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    location TEXT,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) NOT NULL,
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    helpful INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create review_responses table
CREATE TABLE IF NOT EXISTS public.review_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    review_id UUID REFERENCES public.reviews(id) NOT NULL,
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role TEXT NOT NULL,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Companies policies
CREATE POLICY "Anyone can view approved companies" ON public.companies
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Companies can update own profile" ON public.companies
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage all companies" ON public.companies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'user'
        )
    );

CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Review responses policies
CREATE POLICY "Anyone can view responses" ON public.review_responses
    FOR SELECT USING (true);

CREATE POLICY "Companies can respond to their reviews" ON public.review_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.companies
            WHERE companies.id = company_id
            AND companies.user_id = auth.uid()
        )
    );

-- Create functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role, created_at)
    VALUES (NEW.id, NEW.email, 'user', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
