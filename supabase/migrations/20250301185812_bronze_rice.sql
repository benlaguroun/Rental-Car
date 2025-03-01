/*
  # Initial schema for car rental application

  1. New Tables
    - `cars`
      - `id` (integer, primary key)
      - `created_at` (timestamp with time zone)
      - `make` (text)
      - `model` (text)
      - `year` (integer)
      - `daily_rate` (numeric)
      - `image_url` (text)
      - `available` (boolean)
      - `category` (text)
      - `description` (text)
    - `bookings`
      - `id` (integer, primary key)
      - `created_at` (timestamp with time zone)
      - `car_id` (integer, foreign key to cars.id)
      - `user_id` (uuid, foreign key to auth.users.id)
      - `start_date` (date)
      - `end_date` (date)
      - `total_price` (numeric)
      - `status` (text)
    - `profiles`
      - `id` (uuid, primary key, references auth.users.id)
      - `created_at` (timestamp with time zone)
      - `full_name` (text)
      - `phone` (text)
      - `address` (text)
      - `license_number` (text)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read and manage their own data
    - Add policies for public access to cars table
*/

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  daily_rate NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  category TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  car_id INTEGER REFERENCES cars(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT,
  phone TEXT,
  address TEXT,
  license_number TEXT
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for cars table
CREATE POLICY "Anyone can view available cars" 
  ON cars 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert cars" 
  ON cars 
  FOR INSERT 
  TO authenticated 
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));

CREATE POLICY "Only admins can update cars" 
  ON cars 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() IN (SELECT auth.uid() FROM auth.users WHERE auth.uid() = '00000000-0000-0000-0000-000000000000'));

-- Policies for bookings table
CREATE POLICY "Users can view their own bookings" 
  ON bookings 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings" 
  ON bookings 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
  ON bookings 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Insert sample car data
INSERT INTO cars (make, model, year, daily_rate, image_url, category, description)
VALUES
  ('Toyota', 'Camry', 2023, 45.99, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'sedan', 'The Toyota Camry is a comfortable and reliable sedan with excellent fuel efficiency. Perfect for business trips or family outings.'),
  ('Honda', 'CR-V', 2022, 59.99, 'https://images.unsplash.com/photo-1568844293986-ca9c5c1d4cba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'suv', 'The Honda CR-V offers ample space and versatility. This SUV is ideal for those who need extra room for passengers or cargo.'),
  ('BMW', '3 Series', 2023, 89.99, 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'luxury', 'Experience luxury and performance with the BMW 3 Series. This premium sedan offers a smooth ride and advanced features.'),
  ('Ford', 'Mustang', 2022, 79.99, 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'sports', 'The iconic Ford Mustang delivers thrilling performance and head-turning style. Perfect for those who want to make a statement.'),
  ('Chevrolet', 'Equinox', 2023, 54.99, 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'suv', 'The Chevrolet Equinox is a versatile and fuel-efficient compact SUV with modern technology and comfortable seating for five.'),
  ('Volkswagen', 'Golf', 2022, 49.99, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'compact', 'The Volkswagen Golf combines practicality with driving enjoyment. This compact hatchback is perfect for city driving and parking.'),
  ('Jeep', 'Wrangler', 2023, 69.99, 'https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'suv', 'Adventure awaits with the Jeep Wrangler. This rugged SUV is built for off-road exploration and outdoor activities.'),
  ('Hyundai', 'Elantra', 2022, 42.99, 'https://images.unsplash.com/photo-1629421889558-e2315ffc869d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'sedan', 'The Hyundai Elantra offers excellent value with its stylish design, fuel efficiency, and comprehensive feature set.'),
  ('Audi', 'Q5', 2023, 84.99, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'luxury', 'The Audi Q5 combines luxury, technology, and performance in a premium SUV package. Experience refined driving at its best.'),
  ('Nissan', 'Altima', 2022, 47.99, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'sedan', 'The Nissan Altima delivers a comfortable ride with good fuel economy and plenty of modern features for everyday driving.');