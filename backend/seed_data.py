import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from utils.auth import get_password_hash
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'zikra_db')]

async def seed_data():
    print("🌱 Seeding initial data...")
    
    # 1. Create admin user
    existing_admin = await db.users.find_one({"email": "admin@zikra.com"})
    if not existing_admin:
        admin_user = {
            "id": "admin-001",
            "email": "admin@zikra.com",
            "password": get_password_hash("admin123"),  # Change this in production!
            "name": "Admin",
            "role": "admin"
        }
        await db.users.insert_one(admin_user)
        print("✅ Admin user created (email: admin@zikra.com, password: admin123)")
    else:
        print("ℹ️  Admin user already exists")
    
    # 2. Create categories
    categories = [
        {"id": "zikirmatik", "name": "Zikirmatik", "description": "Mücevher sanatıyla buluşan zikir", "order": 1},
        {"id": "aksesuar", "name": "Aksesuar", "description": "Zarif ve şık tasarımlar", "order": 2},
        {"id": "kisisellestirilmis", "name": "Kişiselleştirilmiş Aksesuar", "description": "Size özel tasarımlar", "order": 3}
    ]
    
    for cat in categories:
        existing = await db.categories.find_one({"id": cat["id"]})
        if not existing:
            await db.categories.insert_one(cat)
            print(f"✅ Category created: {cat['name']}")
        else:
            print(f"ℹ️  Category already exists: {cat['name']}")
    
    # 3. Create sample products with country pricing
    products = [
        {
            "id": "prod-001",
            "name": "Zikra Zikirmatik - Altın Kalp",
            "short_name": "Altın Kalp",
            "description": "Mücevher ustasından kalplere. Bazı yolculuklar ellerle başlar… Bazıları ise kalple.",
            "category": "zikirmatik",
            "category_name": "Zikirmatik",
            "images": ["https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/r94trf83_zikrmatik%201.png"],
            "prices": {
                "TR": {"price": 45000, "currency": "TRY", "symbol": "₺"},
                "US": {"price": 1299, "currency": "USD", "symbol": "$"},
                "DE": {"price": 1199, "currency": "EUR", "symbol": "€"},
                "GB": {"price": 999, "currency": "GBP", "symbol": "£"}
            },
            "featured": True,
            "in_stock": True
        },
        {
            "id": "prod-002",
            "name": "Zikra Zikirmatik - Gümüş Hilal",
            "short_name": "Gümüş Hilal",
            "description": "Her dokunuşta hatırla, her sayışta yenile. Mücevher sanatının zikirle buluştuğu yer.",
            "category": "zikirmatik",
            "category_name": "Zikirmatik",
            "images": ["https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png"],
            "prices": {
                "TR": {"price": 35000, "currency": "TRY", "symbol": "₺"},
                "US": {"price": 999, "currency": "USD", "symbol": "$"},
                "DE": {"price": 899, "currency": "EUR", "symbol": "€"},
                "GB": {"price": 799, "currency": "GBP", "symbol": "£"}
            },
            "featured": True,
            "in_stock": True
        }
    ]
    
    for product in products:
        existing = await db.products.find_one({"id": product["id"]})
        if not existing:
            await db.products.insert_one(product)
            print(f"✅ Product created: {product['name']}")
        else:
            print(f"ℹ️  Product already exists: {product['name']}")
    
    print("\n🎉 Seeding complete!")
    print("\n📝 Admin credentials:")
    print("   Email: admin@zikra.com")
    print("   Password: admin123")
    print("   ⚠️  Please change the password after first login!\n")

if __name__ == "__main__":
    asyncio.run(seed_data())
    client.close()
