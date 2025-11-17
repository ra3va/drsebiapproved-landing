-- =====================================================
-- Dr. Sebi Approved - Customer Portal & Admin CRM
-- Complete Database Schema for Supabase
-- =====================================================
--
-- PROJECT: ohxtngzmyamixwfvisje
-- URL: https://ohxtngzmyamixwfvisje.supabase.co
--
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy and paste this entire file
-- 3. Click "Run" to execute
-- 4. Verify all tables are created under "Table Editor"
--
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE 1: profiles (User Accounts)
-- Extends Supabase auth.users with additional fields
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,

  -- Preferences
  marketing_consent BOOLEAN DEFAULT true,
  sms_consent BOOLEAN DEFAULT false,

  -- Loyalty & Rewards
  loyalty_points INTEGER DEFAULT 0 CHECK (loyalty_points >= 0),
  lifetime_value DECIMAL(10,2) DEFAULT 0.00 CHECK (lifetime_value >= 0),

  -- External Service IDs (for syncing)
  square_customer_id TEXT UNIQUE,
  brevo_contact_id INTEGER UNIQUE,

  -- Referral tracking
  referral_code TEXT UNIQUE,
  referred_by_code TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Additional metadata (flexible JSON)
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_square_customer_id ON public.profiles(square_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE 2: orders (Order History - Synced from Square)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Square Integration
  square_order_id TEXT UNIQUE NOT NULL,
  square_payment_id TEXT,

  -- Order Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),

  -- Financial Details
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
  subtotal_amount DECIMAL(10,2) NOT NULL CHECK (subtotal_amount >= 0),
  shipping_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (shipping_amount >= 0),
  discount_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (discount_amount >= 0),
  tax_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (tax_amount >= 0),

  -- Customer Information (snapshot at time of order)
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,

  -- Shipping Details
  shipping_address JSONB NOT NULL,
  tracking_number TEXT,
  carrier TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Loyalty Points
  points_earned INTEGER DEFAULT 0,
  points_used INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_square_order_id ON public.orders(square_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id
    OR customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  );

-- Admins can view all orders (we'll add admin check later)
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE 3: order_items (Line Items for Orders)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,

  -- Product Details
  product_id TEXT NOT NULL, -- 'paracleanse', 'maya', 'seamoss', 'mucus-cleanser'
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),

  -- Pricing
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),

  -- Square Integration
  square_catalog_object_id TEXT,
  square_variation_id TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Row Level Security
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR orders.customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid()))
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- =====================================================
-- TABLE 4: subscriptions (Recurring Orders)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Product Details
  product_id TEXT NOT NULL CHECK (product_id IN ('paracleanse', 'maya', 'seamoss', 'mucus-cleanser')),
  product_name TEXT NOT NULL,

  -- Subscription Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),

  -- Frequency & Pricing
  frequency TEXT NOT NULL CHECK (frequency IN ('monthly', 'every_60_days', 'every_90_days')),
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
  discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discounted_price DECIMAL(10,2) GENERATED ALWAYS AS (base_price * (100 - discount_percentage) / 100) STORED,

  -- Schedule
  next_shipment_date DATE,
  last_shipment_date DATE,
  total_shipments INTEGER DEFAULT 0 CHECK (total_shipments >= 0),

  -- Payment Method (Square)
  square_customer_id TEXT,
  payment_method_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paused_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_shipment ON public.subscriptions(next_shipment_date) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscriptions_product_id ON public.subscriptions(product_id);

-- Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
  ON public.subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- Trigger
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE 5: loyalty_transactions (Points History)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Transaction Details
  points_change INTEGER NOT NULL, -- Can be positive (earn) or negative (redeem)
  reason TEXT NOT NULL CHECK (reason IN ('purchase', 'redemption', 'signup_bonus', 'referral_made', 'referral_joined', 'birthday', 'admin_adjustment', 'review')),
  description TEXT,

  -- Related Entities
  order_id UUID REFERENCES public.orders(id),
  referral_id UUID, -- Will reference referrals table

  -- Balance Tracking
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON public.loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_created_at ON public.loyalty_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_reason ON public.loyalty_transactions(reason);

-- Row Level Security
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own loyalty transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all loyalty transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- =====================================================
-- TABLE 6: loyalty_coupons (One-Time Discount Codes)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.loyalty_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Coupon Details
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL DEFAULT 'fixed_amount' CHECK (discount_type IN ('fixed_amount', 'percentage')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),

  -- Points Information
  points_redeemed INTEGER NOT NULL CHECK (points_redeemed > 0),

  -- Status & Usage
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired')),
  used_at TIMESTAMPTZ,
  used_in_order_id UUID REFERENCES public.orders(id),

  -- Expiration
  expires_at TIMESTAMPTZ NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_coupons_code ON public.loyalty_coupons(code);
CREATE INDEX IF NOT EXISTS idx_loyalty_coupons_user_id ON public.loyalty_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_coupons_status ON public.loyalty_coupons(status);
CREATE INDEX IF NOT EXISTS idx_loyalty_coupons_expires_at ON public.loyalty_coupons(expires_at);

-- Row Level Security
ALTER TABLE public.loyalty_coupons ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own coupons"
  ON public.loyalty_coupons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all coupons"
  ON public.loyalty_coupons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- =====================================================
-- TABLE 7: referrals (Referral Program Tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Referrer (person who referred)
  referrer_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  referrer_code TEXT NOT NULL,

  -- Referee (person who was referred)
  referee_email TEXT NOT NULL,
  referee_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),

  -- Reward Tracking
  referrer_points_awarded INTEGER DEFAULT 0,
  referee_points_awarded INTEGER DEFAULT 0,

  -- Related Order (when referee makes first purchase)
  first_order_id UUID REFERENCES public.orders(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ, -- When referee registered
  rewarded_at TIMESTAMPTZ, -- When points were awarded

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_user_id ON public.referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee_email ON public.referrals(referee_email);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_code ON public.referrals(referrer_code);

-- Row Level Security
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = referrer_user_id OR auth.uid() = referee_user_id);

CREATE POLICY "Admins can view all referrals"
  ON public.referrals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- =====================================================
-- TABLE 8: digital_products (PDFs, Courses, Content)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.digital_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Product Details
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'video', 'course', 'guide', 'ebook')),

  -- File Storage (Supabase Storage)
  file_url TEXT,
  file_size INTEGER, -- bytes
  thumbnail_url TEXT,

  -- Access Control
  requires_purchase BOOLEAN DEFAULT false,
  linked_product_id TEXT, -- Which product purchase unlocks this?
  is_free BOOLEAN DEFAULT false,

  -- Visibility
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_digital_products_type ON public.digital_products(type);
CREATE INDEX IF NOT EXISTS idx_digital_products_is_active ON public.digital_products(is_active);
CREATE INDEX IF NOT EXISTS idx_digital_products_linked_product_id ON public.digital_products(linked_product_id);

-- Row Level Security
ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active digital products"
  ON public.digital_products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage digital products"
  ON public.digital_products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- Trigger
CREATE TRIGGER update_digital_products_updated_at
  BEFORE UPDATE ON public.digital_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE 9: user_digital_access (Content Permissions)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_digital_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  digital_product_id UUID REFERENCES public.digital_products(id) ON DELETE CASCADE NOT NULL,

  -- Access Details
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by TEXT NOT NULL CHECK (granted_by IN ('purchase', 'admin', 'promotion', 'free')),
  order_id UUID REFERENCES public.orders(id),

  -- Usage Tracking
  first_accessed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0 CHECK (access_count >= 0),

  -- Constraints
  UNIQUE(user_id, digital_product_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_digital_access_user_id ON public.user_digital_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_digital_access_product_id ON public.user_digital_access(digital_product_id);

-- Row Level Security
ALTER TABLE public.user_digital_access ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own digital access"
  ON public.user_digital_access FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all digital access"
  ON public.user_digital_access FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- =====================================================
-- TABLE 10: admin_users (CRM Access Control)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,

  -- Role & Permissions
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'support')),
  permissions JSONB DEFAULT '["view_customers", "view_orders", "view_analytics"]'::jsonb,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON public.admin_users(is_active);

-- Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view admin users"
  ON public.admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Only super_admins can modify admin_users
CREATE POLICY "Super admins can manage admin users"
  ON public.admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

-- Trigger
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE 11: sync_logs (Integration Sync Tracking)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Sync Details
  service TEXT NOT NULL CHECK (service IN ('square', 'brevo')),
  sync_type TEXT NOT NULL, -- 'order', 'customer', 'contact', etc.
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),

  -- Status
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'partial')),

  -- Data
  entity_id TEXT, -- Square order ID, Brevo contact ID, etc.
  local_id UUID, -- Our database record ID

  -- Error Tracking
  error_message TEXT,
  error_details JSONB,

  -- Performance
  duration_ms INTEGER,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sync_logs_service ON public.sync_logs(service);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON public.sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON public.sync_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_entity_id ON public.sync_logs(entity_id);

-- Row Level Security
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view sync logs"
  ON public.sync_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function: Automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_referral_code TEXT;
BEGIN
  -- Generate unique referral code (6 chars)
  new_referral_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));

  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    new_referral_code
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function: Award signup bonus points
CREATE OR REPLACE FUNCTION public.award_signup_bonus()
RETURNS TRIGGER AS $$
BEGIN
  -- Award 100 points for signing up
  UPDATE public.profiles
  SET loyalty_points = 100
  WHERE id = NEW.id;

  -- Record transaction
  INSERT INTO public.loyalty_transactions (user_id, points_change, reason, description, balance_after)
  VALUES (NEW.id, 100, 'signup_bonus', 'Welcome bonus for creating an account', 100);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Award signup bonus after profile creation
CREATE TRIGGER on_profile_created_award_bonus
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.award_signup_bonus();

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert admin users (kingthriva@gmail.com and carljoseph@mogulmedianyc.biz)
-- Note: These will be inserted via API after users register
-- This is just a placeholder for documentation

-- =====================================================
-- STORAGE BUCKETS (Run separately in Supabase Dashboard → Storage)
-- =====================================================

-- Bucket: digital-content
-- Purpose: Store PDFs, videos, course materials
-- Public: false (authenticated access only)
-- Allowed MIME types: application/pdf, video/mp4, image/*

-- SQL to create bucket (run in SQL Editor):
/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('digital-content', 'digital-content', false);

-- Policy: Users can view files they have access to
CREATE POLICY "Users can view accessible content"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'digital-content'
  AND auth.uid() IN (
    SELECT user_id FROM public.user_digital_access
    WHERE digital_product_id::text = (storage.foldername(name))[1]
  )
);
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- After running this schema, verify tables:
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Expected output (11 tables):
-- admin_users
-- digital_products
-- loyalty_coupons
-- loyalty_transactions
-- order_items
-- orders
-- profiles
-- referrals
-- subscriptions
-- sync_logs
-- user_digital_access

-- =====================================================
-- SCHEMA COMPLETE ✅
-- =====================================================
