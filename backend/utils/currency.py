import httpx
import logging
import time

logger = logging.getLogger(__name__)

# Cache exchange rates for 1 hour
_rates_cache = {
    "rates": {},
    "last_updated": 0,
}
CACHE_DURATION = 3600  # 1 hour in seconds


async def get_exchange_rates():
    """Fetch exchange rates from free API, cached for 1 hour"""
    now = time.time()
    if _rates_cache["rates"] and (now - _rates_cache["last_updated"]) < CACHE_DURATION:
        return _rates_cache["rates"]

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get("https://open.er-api.com/v6/latest/TRY")
            data = resp.json()

        if data.get("result") == "success":
            _rates_cache["rates"] = data.get("rates", {})
            _rates_cache["last_updated"] = now
            logger.info("Exchange rates updated successfully")
            return _rates_cache["rates"]
        else:
            logger.error(f"Exchange rate API error: {data}")
            return _rates_cache["rates"]
    except Exception as e:
        logger.error(f"Exchange rate fetch error: {e}")
        return _rates_cache["rates"]


async def convert_to_tl(amount: float, from_currency: str) -> float:
    """Convert any currency amount to TL using real-time exchange rates"""
    from_currency = from_currency.upper()

    if from_currency in ("TRY", "TL"):
        return amount

    rates = await get_exchange_rates()
    if not rates:
        logger.error("No exchange rates available, cannot convert")
        return amount

    # rates are based on 1 TRY = X other currency
    # So to convert FROM other currency TO TL: amount / rate
    rate = rates.get(from_currency)
    if not rate or rate == 0:
        logger.error(f"No rate found for {from_currency}")
        return amount

    tl_amount = amount / rate
    tl_amount = round(tl_amount, 2)
    logger.info(f"Converted {amount} {from_currency} -> {tl_amount} TL (rate: 1 TL = {rate} {from_currency})")
    return tl_amount
