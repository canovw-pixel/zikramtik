import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { countries } from '../data/mock';
import { ArrowLeft } from 'lucide-react';

const GizlilikSozlesmesi = () => {
  const selectedCountry = countries[1];

  return (
    <div className="min-h-screen bg-white" data-testid="privacy-page">
      <Header selectedCountry={selectedCountry} />
      
      <main className="pt-24 pb-16">
        <div className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Gizlilik S{'\u00f6'}zle{'\u015f'}mesi
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/" className="inline-flex items-center text-burgundy-700 hover:text-burgundy-800 mb-8" data-testid="back-home-link">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya D{'\u00f6'}n
          </Link>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <p className="text-sm text-gray-500">Son g{'\u00fc'}ncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                1. Genel Bilgilendirme
              </h2>
              <p>
                Craponia M{'\u00fc'}cevherat ve Hediyelik E{'\u015f'}ya (&ldquo;{'\u015e'}irket&rdquo;, &ldquo;biz&rdquo;) olarak, zikramatik.com 
                web sitesi {'\u00fc'}zerinden toplanan ki{'\u015f'}isel verilerin korunmas{'\u0131'}na b{'\u00fc'}y{'\u00fc'}k {'\u00f6'}nem vermekteyiz. 
                Bu Gizlilik S{'\u00f6'}zle{'\u015f'}mesi, hangi verilerin topland{'\u0131'}{'\u011f'}{'\u0131'}n{'\u0131'}, nas{'\u0131'}l kullan{'\u0131'}ld{'\u0131'}{'\u011f'}{'\u0131'}n{'\u0131'} ve 
                korunma y{'\u00f6'}ntemlerini a{'\u00e7'}{'\u0131'}klamaktad{'\u0131'}r.
              </p>
              <p>
                6698 say{'\u0131'}l{'\u0131'} Ki{'\u015f'}isel Verilerin Korunmas{'\u0131'} Kanunu (KVKK) kapsam{'\u0131'}nda, ki{'\u015f'}isel 
                verileriniz a{'\u015f'}a{'\u011f'}{'\u0131'}da belirtilen {'\u015f'}artlar {'\u00e7'}er{'\u00e7'}evesinde i{'\u015f'}lenmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                2. Toplanan Veriler
              </h2>
              <p>Web sitemizi kulland{'\u0131'}{'\u011f'}{'\u0131'}n{'\u0131'}zda a{'\u015f'}a{'\u011f'}{'\u0131'}daki veriler toplanabilir:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-semibold">Kimlik Bilgileri:</span> Ad, soyad</li>
                <li><span className="font-semibold">{'\u0130'}leti{'\u015f'}im Bilgileri:</span> E-posta adresi, telefon numaras{'\u0131'}, teslimat adresi</li>
                <li><span className="font-semibold">Sipari{'\u015f'} Bilgileri:</span> Sipari{'\u015f'} ge{'\u00e7'}mi{'\u015f'}i, {'\u00f6'}deme bilgileri (kart bilgileri taraf{'\u0131'}m{'\u0131'}zca saklanmaz, iyzico taraf{'\u0131'}ndan g{'\u00fc'}venli {'\u015f'}ekilde i{'\u015f'}lenir)</li>
                <li><span className="font-semibold">Teknik Veriler:</span> IP adresi, taray{'\u0131'}c{'\u0131'} t{'\u00fc'}r{'\u00fc'}, cihaz bilgileri</li>
                <li><span className="font-semibold">Kullan{'\u0131'}m Verileri:</span> Sayfa g{'\u00f6'}r{'\u00fc'}nt{'\u00fc'}lenmeleri, sitede ge{'\u00e7'}irilen s{'\u00fc'}re</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                3. Verilerin Kullan{'\u0131'}m Ama{'\u00e7'}lar{'\u0131'}
              </h2>
              <p>Toplanan ki{'\u015f'}isel verileriniz a{'\u015f'}a{'\u011f'}{'\u0131'}daki ama{'\u00e7'}larla kullan{'\u0131'}lmaktad{'\u0131'}r:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sipari{'\u015f'}lerinizi i{'\u015f'}lemek ve teslim etmek</li>
                <li>{'\u00d6'}deme i{'\u015f'}lemlerini ger{'\u00e7'}ekle{'\u015f'}tirmek</li>
                <li>M{'\u00fc'}{'\u015f'}teri hizmetleri sa{'\u011f'}lamak</li>
                <li>Yasal y{'\u00fc'}k{'\u00fc'}ml{'\u00fc'}l{'\u00fc'}klerimizi yerine getirmek</li>
                <li>Web sitemizi iyile{'\u015f'}tirmek ve ki{'\u015f'}iselle{'\u015f'}tirilmi{'\u015f'} deneyim sunmak</li>
                <li>Kampanya ve bilgilendirme e-postalar{'\u0131'} g{'\u00f6'}ndermek (onayl{'\u0131'} ise)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                4. Verilerin Payla{'\u015f'}{'\u0131'}lmas{'\u0131'}
              </h2>
              <p>Ki{'\u015f'}isel verileriniz a{'\u015f'}a{'\u011f'}{'\u0131'}daki durumlar d{'\u0131'}{'\u015f'}{'\u0131'}nda {'\u00fc'}{'\u00e7'}{'\u00fc'}nc{'\u00fc'} taraflarla payla{'\u015f'}{'\u0131'}lmaz:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-semibold">{'\u00d6'}deme Hizmeti:</span> {'\u00d6'}deme i{'\u015f'}lemleri iyzico taraf{'\u0131'}ndan g{'\u00fc'}venli bir {'\u015f'}ekilde ger{'\u00e7'}ekle{'\u015f'}tirilir.</li>
                <li><span className="font-semibold">Kargo Firmalar{'\u0131'}:</span> Teslimat i{'\u015f'}lemleri i{'\u00e7'}in kargo firmas{'\u0131'} ile adres bilgileri payla{'\u015f'}{'\u0131'}l{'\u0131'}r.</li>
                <li><span className="font-semibold">Yasal Gereklilikler:</span> Yasal zorunluluk halinde yetkili kurumlarla payla{'\u015f'}{'\u0131'}labilir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                5. {'\u00c7'}erez (Cookie) Kullan{'\u0131'}m{'\u0131'}
              </h2>
              <p>
                Web sitemiz, kullan{'\u0131'}c{'\u0131'} deneyimini iyile{'\u015f'}tirmek i{'\u00e7'}in {'\u00e7'}erezler kullanmaktad{'\u0131'}r. 
                {'\u00c7'}erezler, taray{'\u0131'}c{'\u0131'}n{'\u0131'}za kaydedilen k{'\u00fc'}{'\u00e7'}{'\u00fc'}k metin dosyalar{'\u0131'}d{'\u0131'}r. Taray{'\u0131'}c{'\u0131'} 
                ayarlar{'\u0131'}n{'\u0131'}zdan {'\u00e7'}erezleri devre d{'\u0131'}{'\u015f'}{'\u0131'} b{'\u0131'}rakabilirsiniz; ancak bu durumda 
                baz{'\u0131'} site {'\u00f6'}zelliklerinden yararlanamayabilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                6. Veri G{'\u00fc'}venli{'\u011f'}i
              </h2>
              <p>
                Ki{'\u015f'}isel verilerinizin g{'\u00fc'}venli{'\u011f'}ini sa{'\u011f'}lamak i{'\u00e7'}in SSL sertifikas{'\u0131'} ve 
                {'\u015f'}ifreleme teknolojileri kullan{'\u0131'}lmaktad{'\u0131'}r. {'\u00d6'}deme bilgileriniz iyzico 
                altyap{'\u0131'}s{'\u0131'} {'\u00fc'}zerinden PCI DSS standartlar{'\u0131'}na uygun {'\u015f'}ekilde i{'\u015f'}lenmektedir. 
                Kart bilgileriniz taraf{'\u0131'}m{'\u0131'}zca kesinlikle saklanmaz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                7. Haklar{'\u0131'}n{'\u0131'}z (KVKK Madde 11)
              </h2>
              <p>6698 say{'\u0131'}l{'\u0131'} KVKK kapsam{'\u0131'}nda a{'\u015f'}a{'\u011f'}{'\u0131'}daki haklara sahipsiniz:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ki{'\u015f'}isel verilerinizin i{'\u015f'}lenip i{'\u015f'}lenmedi{'\u011f'}ini {'\u00f6'}{'\u011f'}renme</li>
                <li>{'\u0130'}{'\u015f'}lenmi{'\u015f'}se buna ili{'\u015f'}kin bilgi talep etme</li>
                <li>{'\u0130'}{'\u015f'}leme amac{'\u0131'}n{'\u0131'} ve bunlar{'\u0131'}n amac{'\u0131'}na uygun kullan{'\u0131'}l{'\u0131'}p kullan{'\u0131'}lmad{'\u0131'}{'\u011f'}{'\u0131'}n{'\u0131'} {'\u00f6'}{'\u011f'}renme</li>
                <li>Yurt i{'\u00e7'}inde veya yurt d{'\u0131'}{'\u015f'}{'\u0131'}nda aktar{'\u0131'}l{'\u0131'}p aktar{'\u0131'}lmad{'\u0131'}{'\u011f'}{'\u0131'}n{'\u0131'} {'\u00f6'}{'\u011f'}renme</li>
                <li>Eksik veya yanl{'\u0131'}{'\u015f'} i{'\u015f'}lenmi{'\u015f'}se d{'\u00fc'}zeltilmesini isteme</li>
                <li>KVKK&apos;nin 7. maddesindeki {'\u015f'}artlar {'\u00e7'}er{'\u00e7'}evesinde silinmesini/yok edilmesini isteme</li>
                <li>{'\u0130'}{'\u015f'}lenen verilerin m{'\u00fc'}nhas{'\u0131'}ran otomatik sistemler vas{'\u0131'}tas{'\u0131'}yla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya {'\u00e7'}{'\u0131'}kmas{'\u0131'} halinde itiraz etme</li>
              </ul>
            </section>

            <section className="bg-burgundy-50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Cinzel', serif" }}>
                8. {'\u0130'}leti{'\u015f'}im
              </h2>
              <p className="mt-2">
                Gizlilik s{'\u00f6'}zle{'\u015f'}memiz hakk{'\u0131'}nda sorular{'\u0131'}n{'\u0131'}z veya KVKK kapsam{'\u0131'}ndaki 
                talepleriniz i{'\u00e7'}in bize ula{'\u015f'}abilirsiniz:
              </p>
              <div className="mt-4 space-y-2">
                <p><span className="font-semibold">Veri Sorumlusu:</span> Craponia M{'\u00fc'}cevherat ve Hediyelik E{'\u015f'}ya</p>
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

export default GizlilikSozlesmesi;
