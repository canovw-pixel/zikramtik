import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

async def send_shipping_notification(order: dict, tracking_number: str, cargo_company: str):
    """
    Mock email service - logs the email that would be sent.
    Replace with real email service (SendGrid, Resend, etc.) later.
    """
    customer_email = order.get("customer_email", "")
    customer_name = order.get("shipping_address", {}).get("full_name", "Musteri")
    order_number = order.get("order_number", "")

    email_content = f"""
    ============================================
    KARGO BILDIRIM E-POSTASI (MOCK)
    ============================================
    Gonderilecek: {customer_email}
    Tarih: {datetime.now(timezone.utc).isoformat()}
    --------------------------------------------
    Sayin {customer_name},

    {order_number} numarali siparisiniz kargoya verilmistir.

    Kargo Firmasi: {cargo_company}
    Takip Numarasi: {tracking_number}

    Siparisinizi takip etmek icin:
    /order-tracking sayfasindan siparis numaraniz ile sorgulama yapabilirsiniz.

    Craponia Atelier - Zikra
    ============================================
    """

    logger.info(email_content)

    return {
        "sent": True,
        "mock": True,
        "to": customer_email,
        "subject": f"Siparisiniz Kargoya Verildi - {order_number}",
        "tracking_number": tracking_number,
        "cargo_company": cargo_company,
    }
