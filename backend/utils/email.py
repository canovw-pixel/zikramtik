import logging
import smtplib
import ssl
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "465"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
SMTP_FROM = os.environ.get("SMTP_FROM")


def _send_email(to_email: str, subject: str, html_body: str):
    """Send email via SMTP with SSL"""
    if not all([SMTP_HOST, SMTP_USER, SMTP_PASSWORD]):
        logger.warning("SMTP not configured, skipping email")
        return False

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Craponia Atelier <{SMTP_FROM}>"
    msg["To"] = to_email

    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context, timeout=15) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_FROM, to_email, msg.as_string())
        logger.info(f"Email sent to {to_email}: {subject}")
        return True
    except Exception as e:
        logger.error(f"Email send failed to {to_email}: {e}")
        return False


def _base_template(content: str) -> str:
    return f"""
    <div style="font-family: 'Source Serif 4', Georgia, serif; max-width: 600px; margin: 0 auto; background: #fff;">
      <div style="background: linear-gradient(135deg, #5a0a1a, #7a1a2e); padding: 30px; text-align: center;">
        <h1 style="color: #fff; margin: 0; font-size: 28px;">Zikra</h1>
        <p style="color: #e8b4b8; margin: 5px 0 0; font-size: 14px;">Craponia Atelier</p>
      </div>
      <div style="padding: 30px; color: #333; line-height: 1.7;">
        {content}
      </div>
      <div style="background: #f9f5f6; padding: 20px; text-align: center; font-size: 12px; color: #888;">
        <p>Craponia M\u00fccevherat ve Hediyelik E\u015fya</p>
        <p>Alemdar Mahallesi Hac\u0131 Tahsin Bey Sokak No:5/7 Fatih/\u0130stanbul</p>
        <p>+90 553 076 60 00 | info@zikramatik.com</p>
      </div>
    </div>
    """


async def send_order_confirmation(order: dict):
    """Send order confirmation email to customer"""
    customer_email = order.get("customer_email", "")
    if not customer_email:
        return {"sent": False, "reason": "no email"}

    customer_name = order.get("shipping_address", {}).get("full_name", "De\u011ferli M\u00fc\u015fterimiz")
    order_number = order.get("order_number", "")
    total = order.get("total_amount", 0)
    currency = order.get("currency", "TRY")

    products_html = ""
    for item in order.get("products", []):
        products_html += f"""
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">{item.get('name', '')}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">{item.get('quantity', 1)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">{item.get('price', 0):.2f} {currency}</td>
        </tr>
        """

    content = f"""
    <h2 style="color: #5a0a1a;">Sipari\u015finiz Al\u0131nd\u0131!</h2>
    <p>Say\u0131n {customer_name},</p>
    <p>Sipari\u015finiz ba\u015far\u0131yla olu\u015fturuldu. Sipari\u015f detaylar\u0131n\u0131z a\u015fa\u011f\u0131dad\u0131r:</p>

    <div style="background: #f9f5f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Sipari\u015f No:</strong> {order_number}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #5a0a1a; color: #fff;">
          <th style="padding: 10px; text-align: left;">\u00dcr\u00fcn</th>
          <th style="padding: 10px; text-align: center;">Adet</th>
          <th style="padding: 10px; text-align: right;">Fiyat</th>
        </tr>
      </thead>
      <tbody>
        {products_html}
      </tbody>
    </table>

    <div style="text-align: right; margin: 20px 0;">
      <p style="font-size: 18px; color: #5a0a1a;"><strong>Toplam: {total:.2f} {currency}</strong></p>
    </div>

    <p>Sipari\u015finiz haz\u0131rland\u0131\u011f\u0131nda kargo bilgileri e-posta ile taraf\u0131n\u0131za iletilecektir.</p>
    <p>Te\u015fekk\u00fcr ederiz!</p>
    """

    subject = f"Sipari\u015f Onay\u0131 - {order_number}"
    html = _base_template(content)
    sent = _send_email(customer_email, subject, html)

    return {"sent": sent, "to": customer_email, "subject": subject}


async def send_shipping_notification(order: dict, tracking_number: str, cargo_company: str):
    """Send shipping notification email to customer"""
    customer_email = order.get("customer_email", "")
    if not customer_email:
        return {"sent": False, "reason": "no email"}

    customer_name = order.get("shipping_address", {}).get("full_name", "De\u011ferli M\u00fc\u015fterimiz")
    order_number = order.get("order_number", "")

    content = f"""
    <h2 style="color: #5a0a1a;">Sipari\u015finiz Kargoya Verildi!</h2>
    <p>Say\u0131n {customer_name},</p>
    <p><strong>{order_number}</strong> numaral\u0131 sipari\u015finiz kargoya teslim edilmi\u015ftir.</p>

    <div style="background: #f9f5f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 5px 0;"><strong>Kargo Firmas\u0131:</strong> {cargo_company}</p>
      <p style="margin: 5px 0;"><strong>Takip Numaras\u0131:</strong> {tracking_number}</p>
    </div>

    <p>Sipari\u015finizi <a href="https://zikramatik.com/order-tracking" style="color: #5a0a1a; font-weight: bold;">buradan</a> takip edebilirsiniz.</p>

    <p>Bizi tercih etti\u011finiz i\u00e7in te\u015fekk\u00fcr ederiz!</p>
    """

    subject = f"Sipari\u015finiz Kargoya Verildi - {order_number}"
    html = _base_template(content)
    sent = _send_email(customer_email, subject, html)

    return {
        "sent": sent,
        "to": customer_email,
        "subject": subject,
        "tracking_number": tracking_number,
        "cargo_company": cargo_company,
    }
