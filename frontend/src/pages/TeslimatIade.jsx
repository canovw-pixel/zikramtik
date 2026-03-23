import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { countries } from '../data/mock';
import { ArrowLeft } from 'lucide-react';

const TeslimatIade = () => {
  const selectedCountry = countries[1];

  return (
    <div className="min-h-screen bg-white" data-testid="delivery-return-page">
      <Header selectedCountry={selectedCountry} />
      
      <main className="pt-24 pb-16">
        <div className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Teslimat ve {'\u0130'}ade {'\u015e'}artlar{'\u0131'}
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
                1. Teslimat Ko{'\u015f'}ullar{'\u0131'}
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">1.1 Teslimat S{'\u00fc'}resi</h3>
              <p>
                Sipari{'\u015f'}leriniz, {'\u00f6'}deme onay{'\u0131'}ndan sonra 1-3 i{'\u015f'} g{'\u00fc'}n{'\u00fc'} i{'\u00e7'}inde kargoya teslim edilir. 
                Yurti{'\u00e7'}i teslimatlar ortalama 2-4 i{'\u015f'} g{'\u00fc'}n{'\u00fc'}, yurtd{'\u0131'}{'\u015f'}{'\u0131'} teslimatlar ise 5-15 i{'\u015f'} g{'\u00fc'}n{'\u00fc'} 
                i{'\u00e7'}inde tamamlan{'\u0131'}r. Teslimat s{'\u00fc'}releri, kargo firmas{'\u0131'}n{'\u0131'}n yo{'\u011f'}unlu{'\u011f'}una ve hedefe g{'\u00f6'}re 
                de{'\u011f'}i{'\u015f'}iklik g{'\u00f6'}sterebilir.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-4">1.2 Kargo {'\u00dc'}cretleri</h3>
              <p>
                T{'\u00fc'}rkiye i{'\u00e7'}indeki sipari{'\u015f'}lerde kargo {'\u00fc'}creti sipari{'\u015f'} tutar{'\u0131'}na dahildir. 
                Yurtd{'\u0131'}{'\u015f'}{'\u0131'} sipari{'\u015f'}lerde kargo {'\u00fc'}creti, hedef {'\u00fc'}lkeye ve paketin a{'\u011f'}{'\u0131'}rl{'\u0131'}{'\u011f'}{'\u0131'}na g{'\u00f6'}re 
                hesaplan{'\u0131'}r ve {'\u00f6'}deme s{'\u0131'}ras{'\u0131'}nda g{'\u00f6'}sterilir.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-4">1.3 Kargo Takibi</h3>
              <p>
                Sipari{'\u015f'}leriniz kargoya verildi{'\u011f'}inde, e-posta adresinize kargo takip numaras{'\u0131'} 
                g{'\u00f6'}nderilir. Web sitemizin &ldquo;Sipari{'\u015f'} Takibi&rdquo; b{'\u00f6'}l{'\u00fc'}m{'\u00fc'}nden sipari{'\u015f'}lerinizi 
                takip edebilirsiniz.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-4">1.4 Teslimat Adresi</h3>
              <p>
                Teslimat, sipari{'\u015f'} s{'\u0131'}ras{'\u0131'}nda belirtilen adrese yap{'\u0131'}l{'\u0131'}r. Adres bilgilerinizin 
                do{'\u011f'}ru ve eksiksiz oldu{'\u011f'}undan emin olunuz. Hatal{'\u0131'} adres bilgisi sebebiyle 
                ya{'\u015f'}anacak gecikmelerden firmam{'\u0131'}z sorumlu tutulamaz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                2. {'\u0130'}ade ve De{'\u011f'}i{'\u015f'}im Ko{'\u015f'}ullar{'\u0131'}
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">2.1 {'\u0130'}ade S{'\u00fc'}resi</h3>
              <p>
                {'\u00dc'}r{'\u00fc'}nlerimizi teslim ald{'\u0131'}{'\u011f'}{'\u0131'}n{'\u0131'}z tarihten itibaren 14 g{'\u00fc'}n i{'\u00e7'}inde iade edebilirsiniz. 
                6502 say{'\u0131'}l{'\u0131'} T{'\u00fc'}keticinin Korunmas{'\u0131'} Hakk{'\u0131'}nda Kanun kapsam{'\u0131'}nda cayma hakk{'\u0131'}n{'\u0131'}z 
                bulunmaktad{'\u0131'}r.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mt-4">2.2 {'\u0130'}ade {'\u015e'}artlar{'\u0131'}</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>{'\u00dc'}r{'\u00fc'}n, orijinal ambalaj{'\u0131'}nda ve kullan{'\u0131'}lmam{'\u0131'}{'\u015f'} olarak iade edilmelidir.</li>
                <li>{'\u00dc'}r{'\u00fc'}n etiketi ve aksesuarlar{'\u0131'} eksiksiz olarak iade paketine dahil edilmelidir.</li>
                <li>Ki{'\u015f'}iselle{'\u015f'}tirilmi{'\u015f'} {'\u00fc'}r{'\u00fc'}nler ({'\u00f6'}zel grav{'\u00fc'}r vb.) iade kapsam{'\u0131'} d{'\u0131'}{'\u015f'}{'\u0131'}ndad{'\u0131'}r.</li>
                <li>{'\u00dc'}r{'\u00fc'}n{'\u00fc'}n hasarl{'\u0131'} veya kusurlu teslim edilmesi halinde, t{'\u00fc'}m kargo masraflar{'\u0131'} firmam{'\u0131'}z taraf{'\u0131'}ndan kar{'\u015f'}{'\u0131'}lan{'\u0131'}r.</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mt-4">2.3 {'\u0130'}ade S{'\u00fc'}reci</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>info@zikramatik.com adresine iade talebinizi iletin.</li>
                <li>{'\u0130'}ade onay{'\u0131'}n{'\u0131'}z ve kargo bilgileri taraf{'\u0131'}n{'\u0131'}za e-posta ile iletilecektir.</li>
                <li>{'\u00dc'}r{'\u00fc'}n{'\u00fc'} belirtilen adrese g{'\u00f6'}nderin.</li>
                <li>{'\u00dc'}r{'\u00fc'}n firmam{'\u0131'}za ula{'\u015f'}t{'\u0131'}ktan sonra 3 i{'\u015f'} g{'\u00fc'}n{'\u00fc'} i{'\u00e7'}inde kontrol{'\u00fc'} yap{'\u0131'}l{'\u0131'}r.</li>
                <li>{'\u0130'}ade tutar{'\u0131'}, {'\u00f6'}deme yapt{'\u0131'}{'\u011f'}{'\u0131'}n{'\u0131'}z y{'\u00f6'}ntemle 5-10 i{'\u015f'} g{'\u00fc'}n{'\u00fc'} i{'\u00e7'}inde hesab{'\u0131'}n{'\u0131'}za yatacakt{'\u0131'}r.</li>
              </ol>

              <h3 className="text-xl font-semibold text-gray-800 mt-4">2.4 De{'\u011f'}i{'\u015f'}im</h3>
              <p>
                De{'\u011f'}i{'\u015f'}im talebinde bulunmak i{'\u00e7'}in info@zikramatik.com adresinden bizimle 
                ileti{'\u015f'}ime ge{'\u00e7'}ebilirsiniz. De{'\u011f'}i{'\u015f'}im i{'\u015f'}lemleri, {'\u00fc'}r{'\u00fc'}n{'\u00fc'}n firmam{'\u0131'}za ula{'\u015f'}mas{'\u0131'}ndan 
                itibaren 3-5 i{'\u015f'} g{'\u00fc'}n{'\u00fc'} i{'\u00e7'}inde tamamlan{'\u0131'}r.
              </p>
            </section>

            <section className="bg-burgundy-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                {'\u0130'}leti{'\u015f'}im
              </h2>
              <p className="mt-2">
                Teslimat ve iade i{'\u015f'}lemleriniz hakk{'\u0131'}nda sorular{'\u0131'}n{'\u0131'}z i{'\u00e7'}in bize ula{'\u015f'}abilirsiniz:
              </p>
              <div className="mt-4 space-y-2">
                <p><span className="font-semibold">Firma:</span> Craponia M{'\u00fc'}cevherat ve Hediyelik E{'\u015f'}ya</p>
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

export default TeslimatIade;
