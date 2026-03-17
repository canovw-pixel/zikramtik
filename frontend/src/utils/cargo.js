const CARGO_TRACKING_URLS = {
  'Yurtici Kargo': (trackingNo) => `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${trackingNo}`,
  'Aras Kargo': (trackingNo) => `https://www.araskargo.com.tr/taki.aspx?code=${trackingNo}`,
  'MNG Kargo': (trackingNo) => `https://www.mngkargo.com.tr/gonderi-takip?code=${trackingNo}`,
  'PTT Kargo': (trackingNo) => `https://gonderitakip.ptt.gov.tr/Track/Verify?q=${trackingNo}`,
  'Surat Kargo': (trackingNo) => `https://suratkargo.com.tr/gonderi-takibi?q=${trackingNo}`,
  'UPS': (trackingNo) => `https://www.ups.com/track?tracknum=${trackingNo}`,
  'DHL': (trackingNo) => `https://www.dhl.com/tr-tr/home/tracking.html?tracking-id=${trackingNo}`,
  'FedEx': (trackingNo) => `https://www.fedex.com/fedextrack/?trknbr=${trackingNo}`,
};

export const getCargoTrackingUrl = (cargoCompany, trackingNumber) => {
  const urlBuilder = CARGO_TRACKING_URLS[cargoCompany];
  if (urlBuilder && trackingNumber) {
    return urlBuilder(trackingNumber);
  }
  return null;
};

export const CARGO_COMPANIES = [
  'Yurtici Kargo',
  'Aras Kargo',
  'MNG Kargo',
  'PTT Kargo',
  'Surat Kargo',
  'UPS',
  'DHL',
  'FedEx',
  'Diger',
];
