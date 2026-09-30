/* @flow */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Linking,
} from 'react-native';
import {Button} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class Privacy extends Component {
  handleContactSupport = () => {
    // Implement support contact functionality
    Linking.openURL('tel:+989382740488');
  };

  renderPrivacyItem = (title, content) => (
    <View style={styles.privacyItem}>
      <View style={styles.privacyHeader}>
        <Icon name="privacy-tip" size={24} color="#4a8cff" />
        <Text style={styles.privacyTitle}>{title}</Text>
      </View>
      <Text style={styles.privacyContent}>{content}</Text>
    </View>
  );

  render() {
    return (
      <ImageBackground
        source={require('../assets/ajur_logo.png')}
        style={styles.background}
        blurRadius={2}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>حریم خصوصی کاربران آجر</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.card}>
              <Text style={styles.introText}>
                آجر حریم خصوصی کاربران خود را مهم و محترم در نظر می‌گیرد و متعهد
                به حفاظت از اطلاعات شخصی کاربران است. این سند سیاست‌های حریم
                خصوصی آجر را توضیح می‌دهد.
              </Text>
            </View>

            {this.renderPrivacyItem(
              'آجر چه اطلاعاتی را جمع‌آوری و استفاده می‌کند؟',
              'مختصات جغرافیایی، دسترسی به حافظه برای بارگزاری عکس‌های آگهی و شماره تماسی که هنگام ورود به ثبت آگهی وارد می‌کنید.',
            )}

            {this.renderPrivacyItem(
              'آجر چه استفاده‌ای از اطلاعات می‌کند؟',
              'آجر یک اپلیکیشن موقعیت‌محور در زمینه املاک است. اطلاعات موقعیت شما پردازش شده تا بتوانید به راحتی در نزدیکی خود یا روی نقشه نزدیک‌ترین آگهی‌ها را بیابید.',
            )}

            {this.renderPrivacyItem(
              'چه اطلاعاتی در اختیار دیگران قرار می‌گیرد؟',
              'قبل از ورود، آجر هیچ اطلاعاتی از جمله موقعیت جغرافیایی شما را در اختیار شخص ثالث قرار نمی‌دهد. بعد از ثبت‌نام، اطلاعات آگهی‌های منتشر شده و شماره تماس ثبت‌شده نمایش داده می‌شود.',
            )}

            {this.renderPrivacyItem(
              'اطلاعات در اختیار چه کسانی قرار می‌گیرد؟',
              'آجر ممکن است در راستای قوانین جمهوری اسلامی ایران اطلاعات را در اختیار مقامات قضایی قرار دهد. اطلاعات کاربران به هیچ عنوان در اختیار اشخاص حقیقی قرار نمی‌گیرد.',
            )}

            {this.renderPrivacyItem(
              'درخواست کاربر',
              'اگر نیاز به اطلاعات ورود خود یا آگهی‌هایتان دارید، می‌توانید از قسمت پشتیبانی آجر اقدام کنید. اطلاعات شما بعد از اثبات مالکیت در اختیارتان قرار خواهد گرفت.',
            )}

            <Button
              full
              rounded
              style={styles.contactButton}
              onPress={this.handleContactSupport}>
              <View style={styles.buttonContent}>
                <Icon name="support-agent" size={18} color="white" />
                <Text style={styles.buttonText}>تماس با پشتیبانی</Text>
              </View>
            </Button>

            <View style={styles.footer}>
              <ImageBackground
                style={styles.logo}
                source={require('../assets/ajur_logo.png')}
              />
              <Text style={styles.footerText}></Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'iransans',

    color: '#222',
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 3,
    width: 100,
    backgroundColor: '#4a8cff',
    borderRadius: 3,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  introText: {
    fontFamily: 'iransans',
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'right',
    color: '#555',
  },
  privacyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  privacyHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a8cff',
    marginRight: 10,
    textAlign: 'right',
    fontFamily: 'iransans',
  },
  privacyContent: {
    fontFamily: 'iransans',
    fontSize: 15,
    lineHeight: 26,
    textAlign: 'right',
    color: '#666',
  },
contactButton: {
  backgroundColor: '#4a8cff',
  marginTop: 20,
  marginBottom: 30,
  borderRadius: 8,
  height: 48, // Explicit height
  justifyContent: 'center', // Center vertically
},
buttonContent: {
  flexDirection: 'row-reverse', // RTL layout
  alignItems: 'center', // Center items vertically
  justifyContent: 'center', // Center items horizontally
},
buttonText: {
  color: 'white',
  fontFamily: 'IRAN Sans',
  fontSize: 16,
  marginRight: 8, // Space between icon and text
},
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 120,
    height: 120,
    opacity: 0.9,
  },
  footerText: {
    fontFamily: 'iransans',
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
});
