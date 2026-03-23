import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { countries } from '../data/mock';
import { ArrowLeft, Heart, Award, Shield, Sparkles, Gem, Users } from 'lucide-react';

const Hakkimizda = () => {
  const selectedCountry = countries[1];

  return (
    <div className="min-h-screen bg-white" data-testid="about-page">
      <Header selectedCountry={selectedCountry} />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Hakk&#305;m&#305;zda
            </h1>
            <p className="text-lg text-burgundy-100">
              Craponia M&#252;cevherat ve Hediyelik E&#351;ya
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Link */}
          <Link to="/" className="inline-flex items-center text-burgundy-700 hover:text-burgundy-800 mb-8" data-testid="back-home-link">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya D&#246;n
          </Link>

          {/* Company Story */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
              Hikayemiz
            </h2>
            <div className="prose prose-lg text-gray-600 space-y-4">
              <p>
                Craponia Atelier olarak, m&#252;cevher sanat&#305;n&#305; manevi bir yolculukla birle&#351;tiriyoruz. 
                Zikra Zikirmatik koleksiyonumuz, modern tasar&#305;m&#305;n g&#252;zelli&#287;iyle zikirmatik kullan&#305;m&#305;n&#305;n 
                anlam&#305;n&#305; bir araya getiriyor.
              </p>
              <p>
                D&#252;nyada ilk kez, ustal&#305;kla m&#252;cevher standard&#305;nda i&#351;lenen bu eser, ruhunuzun 
                manevi miras&#305;n&#305; bir kalpten di&#287;erine zarafetle ta&#351;&#305;r. Her par&#231;am&#305;z, sadece bir 
                aksesuar de&#287;il; kalbinizi hat&#305;rlatan, niyetinizi tazeleten ve maneviyat&#305;n&#305;z&#305; 
                g&#252;&#231;lendiren bir yolda&#351;t&#305;r.
              </p>
              <p>
                &#304;stanbul'un tarihi dokusundan ilham alarak, geleneksel zanaatk&#226;rl&#305;&#287;&#305; modern 
                tasar&#305;m anlay&#305;&#351;&#305;yla harmanl&#305;yoruz. Her &#252;r&#252;n&#252;m&#252;z, titiz i&#351;&#231;ilik ve kaliteli 
                malzemeyle hayat buluyor.
              </p>
            </div>
          </section>

          {/* Mission */}
          <section className="mb-12 bg-burgundy-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Misyonumuz
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              &#304;nsanlar&#305;n manevi yolculuklar&#305;na e&#351;lik edecek, estetik ve anlaml&#305; &#252;r&#252;nler tasarlayarak, 
              her dokunu&#351;ta huzur ve &#351;uur ta&#351;&#305;yan bir d&#252;nya yaratmak. Amac&#305;m&#305;z, geleneksel 
              de&#287;erleri modern zarafetle bulu&#351;turmakt&#305;r.
            </p>
          </section>

          {/* Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Cinzel', serif" }}>
              De&#287;erlerimiz
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Heart, title: 'Kalple Tasar\u0131m', desc: 'Her par\u00e7a, manevi bir yolculu\u011fun ba\u015flang\u0131c\u0131 olarak \u00f6zenle tasarlanm\u0131\u015ft\u0131r.' },
                { icon: Award, title: 'M\u00fccevher Sanat\u0131', desc: 'Ustal\u0131k ve modern tasar\u0131m\u0131n m\u00fckemmel bile\u015fimi, her detayda g\u00f6r\u00fcl\u00fcr.' },
                { icon: Shield, title: 'Kaliteli Malzeme', desc: 'Sadece en kaliteli malzemelerle, uzun \u00f6m\u00fcrl\u00fc kullan\u0131m i\u00e7in \u00fcretilir.' },
                { icon: Sparkles, title: '\u00d6zel Ambalaj', desc: 'Her \u00fcr\u00fcn, l\u00fcks ambalaj\u0131yla kendinize veya sevdiklerinize hediye.' },
                { icon: Gem, title: 'El \u0130\u015f\u00e7ili\u011fi', desc: 'Geleneksel usta el i\u015f\u00e7ili\u011fini modern tekniklerle birle\u015ftiriyoruz.' },
                { icon: Users, title: 'M\u00fc\u015fteri Memnuniyeti', desc: 'M\u00fc\u015fterilerimizin memnuniyeti her zaman \u00f6nceli\u011fimizdir.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-burgundy-700" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Company Info */}
          <section className="bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
              Firma Bilgileri
            </h2>
            <div className="space-y-3 text-gray-600">
              <p><span className="font-semibold text-gray-900">Firma Ad&#305;:</span> Craponia M&#252;cevherat ve Hediyelik E&#351;ya</p>
              <p><span className="font-semibold text-gray-900">Adres:</span> Alemdar Mahallesi Hac&#305; Tahsin Bey Sokak Dr. Hac&#305; Tahsin Bey &#304;&#351; Han&#305; No:5/7 Fatih/&#304;stanbul</p>
              <p><span className="font-semibold text-gray-900">Telefon:</span> +90 553 076 60 00</p>
              <p><span className="font-semibold text-gray-900">E-posta:</span> info@zikramatik.com</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Hakkimizda;
