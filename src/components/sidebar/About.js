import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  I18nManager
} from 'react-native';

const About = () => {
  const [language, setLanguage] = useState('persian'); // 'persian', 'english', 'arabic', 'french', 'chinese'

  // Force RTL for right-to-left languages
  if (language === 'arabic' || language === 'persian') {
    I18nManager.forceRTL(false);
  } else {
    I18nManager.forceRTL(false);
  }

  // Translations
  const translations = {
    persian: {
      headerAbout: 'آجر از گروه نرم افزارهای آرمن',
      aboutText: 'آجر یک اپلیکیشن و فعال مجازی در زمینه خدمات املاک در سر تا سر ایران است. ما میکوشیم با فراهم کردن بستری مناسب، معاملات ملک در کشورمان را متحول کنیم و هر روز خدمات جدیدی به پلتفرم خود اضافه نماییم.',
      historyHeader: 'نحوه شکل گیری آجر',
      historyText: 'آجر در سال ۱۴۰۰ توسط آرش پیمانی فر ایده پردازی و اجرا شد، با همکاری، ایده پردازی و شراکت علی محمدی و علیرضا دهقان در سال ۱۴۰۲ توسعه آجر رشد چشم گیری را تجربه کرد، اولین معاملات ملکی آجر شکل گرفت و بیش از ۵۰۰ مشاور املاک حرفه ای شروع به همکاری با آجر کردند، در سال ۱۴۰۳ اپلیکیشن آجر در مارکت های رسمی منتشر شد و امکانات زیادی مثل تور مجازی، سیستم یکپارچه مشاورین، نقشه قدرت مند و تعاملی، تبلیغات اختصاصی برای مشاورین و امکانات دیگری توسعه داده شد.',
      teamNames: 'آرش پیمانی فر، علی محمدی و علیرضا دهقان',
      footerText: 'نسخه 12.0.0 - تمام حقوق محفوظ است © 1404'
    },
    english: {
      headerAbout: 'Ajur from Arman Software Group',
      aboutText: 'Ajur is a leading virtual application in real estate services across Iran. We strive to transform property transactions in our country by providing a suitable platform and adding new services to our platform every day.',
      historyHeader: 'How Ajur Was Formed',
      historyText: 'Ajur was conceived and implemented by Arsh Peymani in 2021. With the collaboration, ideation, and partnership of Ali Mohammadi and Alireza Dehghan in 2023, Ajur experienced significant growth. The first real estate transactions took place on Ajur, and over 500 professional real estate consultants began working with Ajur. In 2024, the Ajur app was officially released in markets with many features such as virtual tours, an integrated consultant system, a powerful interactive map, exclusive advertising for consultants, and other features developed.',
      teamNames: 'Arsh Peymani, Ali Mohammadi and Alireza Dehghan',
      footerText: 'Version 12.0.0 - All rights reserved © 2025'
    },
    arabic: {
      headerAbout: 'آجر من مجموعة أرمين للبرمجيات',
      aboutText: 'آجر هو تطبيق افتراضي رائد في خدمات العقارات في جميع أنحاء إيران. نحن نسعى جاهدين لتحويل المعاملات العقارية في بلدنا من خلال توفير منصة مناسبة وإضافة خدمات جديدة إلى منصتنا كل يوم.',
      historyHeader: 'كيف تم تشكيل آجر',
      historyText: 'تم تصور آجر وتنفيذه من قبل آرش بيماني في عام 2021. مع التعاون ووضع الأفكار والشراكة مع علي محمدي وعليرضا دهقان في عام 2023، شهد آجر نموًا كبيرًا. تمت أولى المعاملات العقارية على آجر، وبدأ أكثر من 500 مستشار عقاري محترف العمل مع آجر. في عام 2024، تم إطلاق تطبيق آجر رسميًا في الأسواق مع العديد من الميزات مثل الجولات الافتراضية، ونظام استشاري متكامل، وخريطة تفاعلية قوية، وإعلانات حصرية للمستشارين، وميزات أخرى تم تطويرها.',
      teamNames: 'آرش بيماني، علي محمدي وعليرضا دهقان',
      footerText: 'الإصدار 12.0.0 - جميع الحقوق محفوظة © 2025'
    },
    french: {
      headerAbout: 'Ajur du groupe Arman Software',
      aboutText: 'Ajur est une application virtuelle leader dans les services immobiliers à travers l\'Iran. Nous nous efforçons de transformer les transactions immobilières dans notre pays en fournissant une plateforme adaptée et en ajoutant de nouveaux services à notre plateforme chaque jour.',
      historyHeader: 'Comment Ajur a été créé',
      historyText: 'Ajur a été conçu et mis en œuvre par Arsh Peymani en 2021. Avec la collaboration, l\'idéation et le partenariat d\'Ali Mohammadi et Alireza Dehghan en 2023, Ajur a connu une croissance significative. Les premières transactions immobilières ont eu lieu sur Ajur, et plus de 500 consultants immobiliers professionnels ont commencé à travailler avec Ajur. En 2024, l\'application Ajur a été officiellement lancée sur les marchés avec de nombreuses fonctionnalités telles que des visites virtuelles, un système intégré de consultants, une carte interactive puissante, de la publicité exclusive pour les consultants et d\'autres fonctionnalités développées.',
      teamNames: 'Arsh Peymani, Ali Mohammadi et Alireza Dehghan',
      footerText: 'Version 12.0.0 - Tous droits réservés © 2025'
    },
    chinese: {
      headerAbout: 'Ajur 来自 Arman 软件集团',
      aboutText: 'Ajur 是伊朗领先的虚拟房地产服务应用程序。我们致力于通过提供合适的平台并每天向我们的平台添加新服务来改变我们国家的房地产交易。',
      historyHeader: 'Ajur 的形成方式',
      historyText: 'Ajur 由 Arsh Peymani 于 2021 年构思并实施。随着 Ali Mohammadi 和 Alireza Dehghan 在 2023 年的合作、构思和伙伴关系，Ajur 经历了显著增长。第一批房地产交易在 Ajur 上完成，超过 500 名专业房地产顾问开始与 Ajur 合作。2024 年，Ajur 应用程序正式发布，具有许多功能，如虚拟看房、集成顾问系统、强大的交互式地图、顾问专属广告以及其他开发的功能。',
      teamNames: 'Arsh Peymani, Ali Mohammadi 和 Alireza Dehghan',
      footerText: '版本 12.0.0 - 版权所有 © 2025'
    }
  };

  const t = translations[language];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Language Selector - Scrollable Horizontal Row */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.languageScrollContainer}
        contentContainerStyle={styles.languageContentContainer}
      >
        <TouchableOpacity 
          style={[styles.languageButton, language === 'persian' && styles.activeLanguage]}
          onPress={() => setLanguage('persian')}
        >
          <Text style={styles.languageText}>فارسی</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.languageButton, language === 'english' && styles.activeLanguage]}
          onPress={() => setLanguage('english')}
        >
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.languageButton, language === 'arabic' && styles.activeLanguage]}
          onPress={() => setLanguage('arabic')}
        >
          <Text style={styles.languageText}>العربية</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.languageButton, language === 'french' && styles.activeLanguage]}
          onPress={() => setLanguage('french')}
        >
          <Text style={styles.languageText}>Français</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.languageButton, language === 'chinese' && styles.activeLanguage]}
          onPress={() => setLanguage('chinese')}
        >
          <Text style={styles.languageText}>中文</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerAbout}>
          {t.headerAbout}
        </Text>
        <Text style={[styles.aboutText, {textAlign: language === 'english' || language === 'french' ? 'left' : 'right'}]}>
          {t.aboutText}
        </Text>
      </View>

      {/* History Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerAbout}>
          {t.historyHeader}
        </Text>
        <Text style={[styles.aboutText, {textAlign: language === 'english' || language === 'french' ? 'left' : 'right'}]}>
          {t.historyText}
        </Text>
      </View>

      {/* Partners Image Section */}
      <View style={styles.partnersContainer}>
        <Image 
          source={require('../assets/partners.jpg')} 
          style={styles.partnersImage}
        />
        <Text style={styles.teamNames}>
          {t.teamNames}
        </Text>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <ImageBackground
          style={styles.logo}
          source={require('../assets/ajur_logo.png')}
          resizeMode="contain"
        />
        <Text style={styles.footerText}>
          {t.footerText}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  languageScrollContainer: {
    maxHeight: 50,
    marginBottom: 15,
  },
  languageContentContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
  },
  activeLanguage: {
    backgroundColor: '#FF6D00',
  },
  languageText: {
    fontSize: 14,
    fontFamily: 'iransans',
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerAbout: {
    fontSize: 22,
    fontFamily: 'Av',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'iransans',
    color: '#555',
    lineHeight: 24,
  },
  partnersContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partnersImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  teamNames: {
    fontSize: 18,
    fontFamily: 'Av',
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logo: {
    width: 220,
    height: 120,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'iransans',
    color: '#888',
    textAlign: 'center',
  },
});

export default About;