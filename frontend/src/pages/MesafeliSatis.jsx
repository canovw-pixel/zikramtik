import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { countries } from '../data/mock';
import { ArrowLeft } from 'lucide-react';

const MesafeliSatis = () => {
  const selectedCountry = countries[1];

  return (
    <div className="min-h-screen bg-white" data-testid="distance-sales-page">
      <Header selectedCountry={selectedCountry} />
      
      <main className="pt-24 pb-16">
        <div className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Mesafeli Sat{'\u0131'}{'\u015f'} S{'\u00f6'}zle{'\u015f'}mesi
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/" className="inline-flex items-center text-burgundy-700 hover:text-burgundy-800 mb-8" data-testid="back-home-link">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya D{'\u00f6'}n
          </Link>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Madde 1 - Taraflar
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">1.1 Sat{'\u0131'}c{'\u0131'} Bilgileri</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p><span className="font-semibold">Unvan:</span> Craponia M{'\u00fc'}cevherat ve Hediyelik E{'\u015f'}ya</p>
                <p><span className="font-semibold">Adres:</span> Alemdar Mahallesi Hac{'\u0131'} Tahsin Bey Sokak Dr. Hac{'\u0131'} Tahsin Bey {'\u0130'}{'\u015f'} Han{'\u0131'} No:5/7 Fatih/{'\u0130'}stanbul</p>
                <p><span className="font-semibold">Telefon:</span> +90 553 076 60 00</p>
                <p><span className="font-semibold">E-posta:</span> info@zikramatik.com</p>
                <p><span className="font-semibold">Web Sitesi:</span> www.zikramatik.com</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mt-4">1.2 Al{'\u0131'}c{'\u0131'} Bilgileri</h3>
              <p>
                Al{'\u0131'}c{'\u0131'}n{'\u0131'}n ad-soyad, adres, telefon ve e-posta bilgileri sipari{'\u015f'} s{'\u0131'}ras{'\u0131'}nda 
                al{'\u0131'}nan bilgilerdir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Madde 2 - S{'\u00f6'}zle{'\u015f'}menin Konusu
              </h2>
              <p>
                {'\u0130'}{'\u015f'}bu s{'\u00f6'}zle{'\u015f'}menin konusu, ALICI&apos;n{'\u0131'}n SATICI&apos;ya ait zikramatik.com internet 
                sitesinden elektronik ortamda sipari{'\u015f'} verdi{'\u011f'}i a{'\u015f'}a{'\u011f'}{'\u0131'}da nitelikleri ve sat{'\u0131'}{'\u015f'} 
                fiyat{'\u0131'} belirtilen {'\u00fc'}r{'\u00fc'}n{'\u00fc'}n sat{'\u0131'}{'\u015f'}{'\u0131'} ve teslimi ile ilgili olarak 6502 say{'\u0131'}l{'\u0131'} 
                T{'\u00fc'}keticinin Korunmas{'\u0131'} Hakk{'\u0131'}nda Kanun ve Mesafeli S{'\u00f6'}zle{'\u015f'}meler Y{'\u00f6'}netmeli{'\u011f'}i 
                h{'\u00fc'}k{'\u00fc'}mleri gere{'\u011f'}i taraflar{'\u0131'}n hak ve y{'\u00fc'}k{'\u00fc'}ml{'\u00fc'}l{'\u00fc'}klerin belirlenmesidir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Madde 3 - S{'\u00f6'}zle{'\u015f'}me Konusu {'\u00dc'}r{'\u00fc'}n Bilgileri
              </h2>
              <p>
                {'\u00dc'}r{'\u00fc'}n{'\u00fc'}n cinsi, miktar{'\u0131'}, marka/modeli, rengi, adedi ve sat{'\u0131'}{'\u015f'} bedeli sipari{'\u015f'} 
                onay sayfas{'\u0131'}nda ve faturada belirtilmi{'\u015f'}tir. {'\u00dc'}r{'\u00fc'}n/{'\u00dc'}r{'\u00fc'}nler; Craponia Atelier 
                markal{'\u0131'} Zikra Zikirmatik ve aksesuar {'\u00fc'}r{'\u00fc'}nleridir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Madde 4 - Genel H{'\u00fc'}k{'\u00fc'}mler
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  ALICI, SATICI&apos;ya ait internet sitesinde s{'\u00f6'}zle{'\u015f'}me konusu {'\u00fc'}r{'\u00fc'}n{'\u00fc'}n temel 
                  nitelikleri, sat{'\u0131'}{'\u015f'} fiyat{'\u0131'} ve {'\u00f6'}deme {'\u015f'}ekli ile teslimata ili{'\u015f'}kin {'\u00f6'}n bilgileri 
                  okuyup bilgi sahibi oldu{'\u011f'}unu ve elektronik ortamda gerekli teyidi verdiklerini 
                  kabul ve beyan eder.
                </li>
                <li>
                  S{'\u00f6'}zle{'\u015f'}me konusu {'\u00fc'}r{'\u00fc'}n, yasal 30 g{'\u00fc'}nl{'\u00fc'}k s{'\u00fc'}reyi a{'\u015f'}mamak ko{'\u015f'}ulu ile her bir 
                  {'\u00fc'}r{'\u00fc'}n i{'\u00e7'}in ALICI&apos;n{'\u0131'}n yerle{'\u015f'}imine olan uzakl{'\u0131'}{'\u011f'}a ba{'\u011f'}l{'\u0131'} olarak internet sitesinde 
                  {'\u00f6'}n bilgiler i{'\u00e7'}inde a{'\u00e7'}{'\u0131'}klanan s{'\u00fc'}rede ALICI veya g{'\u00f6'}sterdi{'\u011f'}i adresteki ki{'\u015f'}iye/kurulu{'\u015f'}a teslim edilir.
                </li>
                <li>
                  S{'\u00f6'}zle{'\u015f'}me konusu {'\u00fc'}r{'\u00fc'}n, ALICI&apos;dan ba{'\u015f'}ka bir ki{'\u015f'}i/kurulu{'\u015f'}a teslim edilecek ise, 
                  teslim edilecek ki{'\u015f'}i/kurulu{'\u015f'}un teslimat{'\u0131'} kabul etmemesinden SATICI sorumlu 
                  tutulamaz.
                </li>
                <li>
                  SATICI, s{'\u00f6'}zle{'\u015f'}me konusu {'\u00fc'}r{'\u00fc'}n{'\u00fc'}n sa{'\u011f'}lam, eksiksiz, sipari{'\u015f'} edilen niteliklere 
                  uygun ve varsa garanti belgeleri ve kullan{'\u0131'}m k{'\u0131'}lavuzlar{'\u0131'} ile teslim 
                  edilmesinden sorumludur.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Madde 5 - Teslimat Ko{'\u015f'}ullar{'\u0131'}
              </h2>
              <p>
                Teslimat, anla{'\u015f'}mal{'\u0131'} kargo {'\u015f'}irketi arac{'\u0131'}l{'\u0131'}{'\u011f'}{'\u0131'} ile ALICI&apos;n{'\u0131'}n sipari{'\u015f'} formunda 
                belirtti{'\u011f'}i adresine yap{'\u0131'}l{'\u0131'}r. Teslimat s{'\u00fc'}releri yurt i{'\u00e7'}inde 2-4 i{'\u015f'} g{'\u00fc'}n{'\u00fc'}, 
                yurt d{'\u0131'}{'\u015f'}{'\u0131'}nda 5-15 i{'\u015f'} g{'\u00fc'}n{'\u00fc'}d{'\u00fc'}r.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Madde 6 - {'\u00d6'}deme {'\u015e'}ekli
              </h2>
              <p>
                {'\u00d6'}deme, iyzico g{'\u00fc'}venli {'\u00f6'}deme altyap{'\u0131'}s{'\u0131'} {'\u00fc'}zerinden kredi kart{'\u0131'}/banka kart{'\u0131'} 
                ile yap{'\u0131'}lmaktad{'\u0131'}r. {'\u00d6'}deme i{'\u015f'}lemi s{'\u0131'}ras{'\u0131'}nda kart bilgileriniz {'\u015f'}ifrelenmi{'\u015f'} 
                olarak iletilir ve firmam{'\u0131'}z taraf{'\u0131'}ndan saklanmaz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Madde 7 - Cayma Hakk{'\u0131'}
              </h2>
              <p>
                ALICI, s{'\u00f6'}zle{'\u015f'}me konusu {'\u00fc'}r{'\u00fc'}n{'\u00fc'}n kendisine veya g{'\u00f6'}sterdi{'\u011f'}i adresteki ki{'\u015f'}iye/kurulu{'\u015f'}a 
                tesliminden itibaren 14 (on d{'\u00f6'}rt) g{'\u00fc'}n i{'\u00e7'}inde cayma hakk{'\u0131'}n{'\u0131'} kullanabilir. 
                Cayma hakk{'\u0131'}n{'\u0131'}n kullan{'\u0131'}m{'\u0131'}nda:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>info@zikramatik.com adresine cayma bildirimi yap{'\u0131'}lmal{'\u0131'}d{'\u0131'}r.</li>
                <li>{'\u00dc'}r{'\u00fc'}n, orijinal ambalaj{'\u0131'}nda, kullan{'\u0131'}lmam{'\u0131'}{'\u015f'} ve hasars{'\u0131'}z olarak iade edilmelidir.</li>
                <li>{'\u0130'}ade kargo masraf{'\u0131'} ALICI&apos;ya aittir (kusurlu {'\u00fc'}r{'\u00fc'}n hari{'\u00e7'}).</li>
                <li>Cayma hakk{'\u0131'} bildiriminin SATICI&apos;ya ula{'\u015f'}mas{'\u0131'}ndan itibaren 14 g{'\u00fc'}n i{'\u00e7'}inde {'\u00fc'}r{'\u00fc'}n bedeli ALICI&apos;ya iade edilir.</li>
                <li>Ki{'\u015f'}iselle{'\u015f'}tirilmi{'\u015f'} {'\u00fc'}r{'\u00fc'}nlerde ({'\u00f6'}zel grav{'\u00fc'}r, isim yaz{'\u0131'}lm{'\u0131'}{'\u015f'} {'\u00fc'}r{'\u00fc'}nler) cayma hakk{'\u0131'} kullan{'\u0131'}lamaz.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Madde 8 - Cayma Hakk{'\u0131'} Kullan{'\u0131'}lamayacak {'\u00dc'}r{'\u00fc'}nler
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>ALICI&apos;n{'\u0131'}n istekleri veya a{'\u00e7'}{'\u0131'}k{'\u00e7'}a ki{'\u015f'}isel ihtiya{'\u00e7'}lar{'\u0131'} do{'\u011f'}rultusunda haz{'\u0131'}rlanan {'\u00fc'}r{'\u00fc'}nler (isim grav{'\u00fc'}r{'\u00fc'} vb.)</li>
                <li>Ambalaj{'\u0131'} a{'\u00e7'}{'\u0131'}lm{'\u0131'}{'\u015f'}, denendi{'\u011f'}ine dair iz ta{'\u015f'}{'\u0131'}yan {'\u00fc'}r{'\u00fc'}nler</li>
                <li>Niteli{'\u011f'}i itibar{'\u0131'}yla iade edilemeyecek {'\u00fc'}r{'\u00fc'}nler</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Madde 9 - Temerr{'\u00fc'}t Hali ve Hukuki Sonu{'\u00e7'}lar{'\u0131'}
              </h2>
              <p>
                ALICI&apos;n{'\u0131'}n kredi kart{'\u0131'} ile yap{'\u0131'}lan i{'\u015f'}lemlerde temerr{'\u00fc'}de d{'\u00fc'}{'\u015f'}mesi halinde, 
                kart sahibi banka ile aras{'\u0131'}ndaki kredi kart{'\u0131'} s{'\u00f6'}zle{'\u015f'}mesi {'\u00e7'}er{'\u00e7'}evesinde faiz 
                {'\u00f6'}deyece{'\u011f'}ini ve bankaya kar{'\u015f'}{'\u0131'} sorumlu olaca{'\u011f'}{'\u0131'}n{'\u0131'} kabul ve beyan eder.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                Madde 10 - Yetkili Mahkeme
              </h2>
              <p>
                {'\u0130'}{'\u015f'}bu s{'\u00f6'}zle{'\u015f'}meden do{'\u011f'}acak uyu{'\u015f'}mazl{'\u0131'}klarda T{'\u00fc'}ketici Hakem Heyetleri ve 
                T{'\u00fc'}ketici Mahkemeleri yetkilidir. Ba{'\u015f'}vurular, Ticaret Bakanl{'\u0131'}{'\u011f'}{'\u0131'} taraf{'\u0131'}ndan 
                ilan edilen de{'\u011f'}ere kadar {'\u0130'}l/{'\u0130'}l{'\u00e7'}e T{'\u00fc'}ketici Hakem Heyetlerine, bu de{'\u011f'}erin 
                {'\u00fc'}st{'\u00fc'}ndeki uyu{'\u015f'}mazl{'\u0131'}klar i{'\u00e7'}in T{'\u00fc'}ketici Mahkemelerine yap{'\u0131'}l{'\u0131'}r.
              </p>
            </section>

            <section className="bg-burgundy-50 rounded-xl p-6">
              <p className="font-semibold text-gray-900">
                ALICI, i{'\u015f'}bu s{'\u00f6'}zle{'\u015f'}menin t{'\u00fc'}m ko{'\u015f'}ullar{'\u0131'}n{'\u0131'} okumu{'\u015f'}, anlam{'\u0131'}{'\u015f'} ve kabul etmi{'\u015f'}tir. 
                Sipari{'\u015f'} onaylama i{'\u015f'}lemine devam ederek bu s{'\u00f6'}zle{'\u015f'}meyi elektronik ortamda 
                onaylam{'\u0131'}{'\u015f'} say{'\u0131'}l{'\u0131'}r.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p><span className="font-semibold">Sat{'\u0131'}c{'\u0131'}:</span> Craponia M{'\u00fc'}cevherat ve Hediyelik E{'\u015f'}ya</p>
                <p><span className="font-semibold">Adres:</span> Alemdar Mahallesi Hac{'\u0131'} Tahsin Bey Sokak Dr. Hac{'\u0131'} Tahsin Bey {'\u0130'}{'\u015f'} Han{'\u0131'} No:5/7 Fatih/{'\u0130'}stanbul</p>
                <p><span className="font-semibold">Telefon:</span> +90 553 076 60 00</p>
                <p><span className="font-semibold">E-posta:</span> info@zikramatik.com</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MesafeliSatis;
