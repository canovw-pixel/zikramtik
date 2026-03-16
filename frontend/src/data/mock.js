// Mock data for products and countries

export const products = [
  {
    id: 1,
    name: "Zikra Zikirmatik - Altın Kalp",
    shortName: "Altın Kalp",
    description: "Mücevher ustasından kalplere. Bazı yolculuklar ellerle başlar… Bazıları ise kalple.",
    price: 1299,
    currency: "USD",
    image: "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/r94trf83_zikrmatik%201.png",
    images: [
      "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/r94trf83_zikrmatik%201.png",
      "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png"
    ],
    featured: true,
    category: "zikirmatik",
    inStock: true
  },
  {
    id: 2,
    name: "Zikra Zikirmatik - Gümüş Hilal",
    shortName: "Gümüş Hilal",
    description: "Her dokunuşta hatırla, her sayışta yenile. Mücevher sanatının zikirle buluştuğu yer.",
    price: 999,
    currency: "USD",
    image: "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png",
    images: [
      "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png",
      "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/r94trf83_zikrmatik%201.png"
    ],
    featured: true,
    category: "zikirmatik",
    inStock: true
  },
  {
    id: 3,
    name: "Zikra Zikirmatik - Klasik",
    shortName: "Klasik",
    description: "Zamanın ötesinde bir tasarım. Sadelikte derinlik, incelikte güç.",
    price: 899,
    currency: "USD",
    image: "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/r94trf83_zikrmatik%201.png",
    images: [
      "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/r94trf83_zikrmatik%201.png"
    ],
    featured: false,
    category: "zikirmatik",
    inStock: true
  },
  {
    id: 4,
    name: "Zikra Zikirmatik - Premium",
    shortName: "Premium",
    description: "Lüks ve maneviyatın birleşimi. Her detayda özen, her sayışta huzur.",
    price: 1499,
    currency: "USD",
    image: "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png",
    images: [
      "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png"
    ],
    featured: false,
    category: "zikirmatik",
    inStock: true
  },
  {
    id: 5,
    name: "Zikra Zikirmatik - Elmas İşlemeli",
    shortName: "Elmas İşlemeli",
    description: "Işıltının manevi yolculukla buluştuğu an. Elmas detaylarla süslenmiş özel tasarım.",
    price: 2299,
    currency: "USD",
    image: "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/r94trf83_zikrmatik%201.png",
    images: [
      "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/r94trf83_zikrmatik%201.png"
    ],
    featured: false,
    category: "aksesuar",
    inStock: true
  },
  {
    id: 6,
    name: "Zikra Zikirmatik - Minimal",
    shortName: "Minimal",
    description: "Sadeliğin gücü. Günlük kullanım için zarif ve işlevsel.",
    price: 799,
    currency: "USD",
    image: "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png",
    images: [
      "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png"
    ],
    featured: false,
    category: "zikirmatik",
    inStock: true
  }
];

export const countries = [
  { code: "US", name: "United States", currency: "USD", symbol: "$", flag: "🇺🇸", lang: "en" },
  { code: "TR", name: "Türkiye", currency: "TRY", symbol: "₺", flag: "🇹🇷", lang: "tr" },
  { code: "DE", name: "Deutschland", currency: "EUR", symbol: "€", flag: "🇩🇪", lang: "de" },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£", flag: "🇬🇧", lang: "en" },
  { code: "FR", name: "France", currency: "EUR", symbol: "€", flag: "🇫🇷", lang: "fr" },
  { code: "SA", name: "Saudi Arabia", currency: "SAR", symbol: "﷼", flag: "🇸🇦", lang: "ar" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", symbol: "د.إ", flag: "🇦🇪", lang: "ar" },
  { code: "ES", name: "España", currency: "EUR", symbol: "€", flag: "🇪🇸", lang: "es" },
  { code: "IT", name: "Italia", currency: "EUR", symbol: "€", flag: "🇮🇹", lang: "it" },
  { code: "NL", name: "Nederland", currency: "EUR", symbol: "€", flag: "🇳🇱", lang: "nl" },
  { code: "BR", name: "Brasil", currency: "BRL", symbol: "R$", flag: "🇧🇷", lang: "pt" },
  { code: "JP", name: "日本", currency: "JPY", symbol: "¥", flag: "🇯🇵", lang: "ja" },
  { code: "CN", name: "中国", currency: "CNY", symbol: "¥", flag: "🇨🇳", lang: "zh" }
];

export const heroContent = {
  title: "Şimdi bu emanet seninle.",
  subtitle: "Her dokunuşunda niyetini tazele. Her sayışında kalbini hatırla. Çünkü zikir, sayıdan ibaret değildir; zikir, hatırlamaktır.",
  cta: "Koleksiyonu Keşfet"
};

export const brandContent = {
  name: "Craponia Atelier",
  productLine: "Zikra Zikirmatik",
  tagline: "Mücevher ustasından kalplere.",
  description: "Bazı yolculuklar ellerle başlar… Bazıları ise kalple."
};
