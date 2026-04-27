import logging
import os
from datetime import datetime, timezone
from database import db

logger = logging.getLogger(__name__)

# GIB e-Arsiv Portal credentials
GIB_USER = os.environ.get("GIB_PORTAL_USER")
GIB_PASS = os.environ.get("GIB_PORTAL_PASS")


async def create_invoice_for_order(order_id: str) -> dict:
    """Create e-Arsiv invoice for a shipped order via GIB Portal"""
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        logger.error(f"Invoice: Order {order_id} not found")
        return {"success": False, "error": "Siparis bulunamadi"}

    if order.get("invoice_created"):
        logger.info(f"Invoice: Already created for order {order_id}")
        return {"success": True, "message": "Fatura zaten kesilmis", "ettn": order.get("invoice_ettn")}

    if not GIB_USER or not GIB_PASS:
        logger.error("Invoice: GIB Portal credentials not configured")
        return {"success": False, "error": "GIB Portal bilgileri yapilandirilmamis"}

    try:
        from eArsivPortal import eArsivPortal

        portal = eArsivPortal(kullanici_kodu=GIB_USER, sifre=GIB_PASS, test_modu=False)
        portal.giris_yap()

        shipping = order.get("shipping_address", {})
        products = order.get("products", [])
        total = float(order.get("total_amount", 0))
        currency = order.get("currency", "TRY")

        # Customer info
        full_name = shipping.get("full_name", "")
        name_parts = full_name.split(" ", 1)
        first_name = name_parts[0] if name_parts else ""
        last_name = name_parts[1] if len(name_parts) > 1 else ""

        # Build product description
        urun_listesi = []
        for item in products:
            name = item.get("name", "Urun")
            qty = item.get("quantity", 1)
            price = item.get("price", 0)
            urun_listesi.append(f"{name} x{qty}")
        urun_adi = " | ".join(urun_listesi)

        now = datetime.now(timezone.utc)
        tarih = now.strftime("%d/%m/%Y")
        saat = now.strftime("%H:%M:%S")

        fatura_notu = f"Siparis No: {order.get('order_number', '')}"
        if order.get("tracking_number"):
            fatura_notu += f" | Kargo Takip: {order.get('tracking_number')}"

        # Create invoice - bireysel musteri (TCKN: 11111111111)
        portal.fatura_olustur(
            tarih=tarih,
            saat=saat,
            vkn_veya_tckn="11111111111",
            ad=first_name,
            soyad=last_name,
            unvan="",
            vergi_dairesi="",
            urun_adi=urun_adi,
            fiyat=total,
            fatura_notu=fatura_notu,
        )

        # Get the latest invoice to find ETTN
        faturalar = portal.faturalari_getir(
            baslangic_tarihi=tarih,
            bitis_tarihi=tarih,
        )

        ettn = ""
        invoice_html = ""
        if faturalar:
            son_fatura = faturalar[-1]
            ettn = son_fatura.ettn if hasattr(son_fatura, 'ettn') else ""

            # Get invoice HTML
            try:
                onay_durumu = son_fatura.onayDurumu if hasattr(son_fatura, 'onayDurumu') else ""
                invoice_html = portal.fatura_html(ettn=ettn, onay_durumu=onay_durumu)
            except Exception as e:
                logger.warning(f"Invoice HTML fetch error: {e}")

        portal.cikis_yap()

        # Update order with invoice info
        await db.orders.update_one(
            {"id": order_id},
            {"$set": {
                "invoice_created": True,
                "invoice_ettn": ettn,
                "invoice_date": now.isoformat(),
                "invoice_html": invoice_html,
                "updated_at": now,
            }}
        )

        logger.info(f"Invoice created for order {order_id}, ETTN: {ettn}")
        return {"success": True, "ettn": ettn, "message": "Fatura basariyla kesildi"}

    except Exception as e:
        logger.error(f"Invoice creation error for order {order_id}: {e}")
        return {"success": False, "error": str(e)}


async def send_invoice_email(order_id: str):
    """Send invoice to customer via email"""
    from utils.email import send_email_raw

    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        logger.error(f"Invoice email: No invoice data for order {order_id}")
        return False

    customer_email = order.get("customer_email")
    if not customer_email:
        logger.error(f"Invoice email: No customer email for order {order_id}")
        return False

    order_number = order.get("order_number", "")
    subject = f"Faturaniz - Siparis #{order_number} | Craponia Atelier"
    ettn = order.get("invoice_ettn", "")
    invoice_html_content = order.get("invoice_html", "")

    html_body = f"""
    <html>
    <body style="font-family: 'Source Serif 4', Georgia, serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #5a0a1a, #7a1a2e); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #fff; margin: 0; font-size: 24px;">Zikra</h1>
                <p style="color: #e8b4b8; margin: 5px 0 0; font-size: 12px;">Craponia Atelier</p>
            </div>
            <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                <h2 style="color: #722F37;">e-Arsiv Faturaniz</h2>
                <p>Sayin {order.get('shipping_address', {}).get('full_name', 'Degerli Musterimiz')},</p>
                <p>Siparisleriniz icin e-Arsiv faturaniz kesilmistir.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Siparis No:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">{order_number}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Tutar:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">{order.get('total_amount', 0)} {order.get('currency', 'TRY')}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #666;">Fatura No (ETTN):</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">{ettn}</td></tr>
                </table>
                {"<div style='border: 1px solid #ddd; padding: 10px; margin: 15px 0; border-radius: 4px;'>" + invoice_html_content + "</div>" if invoice_html_content else ""}
                <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">Craponia Atelier | zikramatik.com</p>
            </div>
        </div>
    </body>
    </html>
    """

    try:
        await send_email_raw(customer_email, subject, html_body)
        logger.info(f"Invoice email sent to {customer_email} for order {order_id}")
        return True
    except Exception as e:
        logger.error(f"Invoice email error: {e}")
        return False
