#!/usr/bin/env python3
"""
Database setup script for EchoFind API
"""
import os
import sys
from sqlalchemy import create_engine
from api.db.database import Base, engine
from api.config import settings

def create_database():
    """Create the database and tables."""
    try:
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error creating database tables: {e}")
        return False

def check_database_connection():
    """Check if database connection is working."""
    try:
        # Test connection
        engine.connect()
        print("✅ Database connection successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print(f"Please check your DATABASE_URL: {settings.database_url}")
        return False

def main():
    """Main setup function."""
    print("🚀 EchoFind Database Setup")
    print("=" * 40)
    
    # Check database connection
    if not check_database_connection():
        print("\n💡 Setup Instructions:")
        print("1. Install PostgreSQL")
        print("2. Create a database named 'echofind'")
        print("3. Update DATABASE_URL in your .env file")
        print("4. Run this script again")
        sys.exit(1)
    
    # Create tables
    if create_database():
        print("\n🎉 Setup completed successfully!")
        print("\nNext steps:")
        print("1. Set your OPENAI_API_KEY in .env file")
        print("2. Run: python run.py")
        print("3. Visit: http://localhost:8000")
    else:
        print("\n❌ Setup failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
