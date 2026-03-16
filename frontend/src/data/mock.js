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
    categoryName: "Zikirmatik",
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
    categoryName: "Zikirmatik",
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
    categoryName: "Zikirmatik",
    inStock: true
  },
  {
    id: 4,
    name: "Premium Altın Aksesuar",
    shortName: "Premium",
    description: "Lüks ve maneviyatın birleşimi. Her detayda özen, her sayışta huzur.",
    price: 1499,
    currency: "USD",
    image: "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png",
    images: [
      "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png"
    ],
    featured: false,
    category: "aksesuar",
    categoryName: "Aksesuar",
    inStock: true
  },
  {
    id: 5,
    name: "Elmas İşlemeli Aksesuar",
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
    categoryName: "Aksesuar",
    inStock: true
  },
  {
    id: 6,
    name: "Özel İsim Gravürlü Zikirmatik",
    shortName: "İsme Özel",
    description: "Size özel tasarlanmış, isim veya mesaj gravürü ile kişiselleştirilmiş zikirmatik.",
    price: 1599,
    currency: "USD",
    image: "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png",
    images: [
      "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ln7knnc7_zikrmatik%202.png"
    ],
    featured: false,
    category: "kisisellestirilmis",
    categoryName: "Kişiselleştirilmiş Aksesuar",
    inStock: true
  }
];

export const categories = [
  { id: "zikirmatik", name: "Zikirmatik", description: "Mücevher sanatıyla buluşan zikir" },
  { id: "aksesuar", name: "Aksesuar", description: "Zarif ve şık tasarımlar" },
  { id: "kisisellestirilmis", name: "Kişiselleştirilmiş Aksesuar", description: "Size özel tasarımlar" }
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
  title: "Nesilden nesile , Kalpten kalbe..",
  subtitle: "Dünyada ilk kez, ustalıkla mücevher standardında işlenen bu eser, insanlığın mirasını bir kalpten diğerine zarafetle taşır.",
  cta: "Koleksiyonu Keşfet",
  bannerImage: "https://customer-assets.emergentagent.com/job_web-clone-tool-12/artifacts/ikpvmjlh_banner.jpeg"
};

export const brandContent = {
  name: "Craponia Atelier",
  productLine: "Zikra Zikirmatik",
  tagline: "Mücevher ustasından kalplere.",
  description: "Bazı yolculuklar ellerle başlar… Bazıları ise kalple."
};
