import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
  RefreshControl,
} from 'react-native';
import { useMyket } from 'iab-myket-reactnative';
import axios from 'axios';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SingleUpgrade = ({ route, navigation }) => {
  const { worker_id } = route.params;

  // Myket RSA public key (from Myket developer panel)
  const RSA_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPDTWgtSt3k9QQWiC8BQ7UXR5rjhVxy/fq4qD9reJfYasj1WcRsovoBuOpFXgG1vYmegeb9ZcxERvK0jRDokmAJa+arv6yVBKaPYelBFdbhjjSQwf3/rt57myOnGnTx4KwepAekzb9c6Fqz6QBbC3t/OijGCC/ir20uCp01gtxJQIDAQAB';

  const myket = useMyket(RSA_KEY);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [worker, setWorker] = useState(null);
  const [prices, setPrices] = useState(null);
  const [error, setError] = useState(null);
  const [modalPlan, setModalPlan] = useState(null);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadUserToken();
  }, []);

  useEffect(() => {
    if (userToken) {
      loadData();
    }
  }, [worker_id, userToken]);

  const loadUserToken = async () => {
    try {
      const token = await AsyncStorage.getItem('id_token');
      if (token) {
        setUserToken(token);
      } else {
        Alert.alert('خطا', 'لطفاً وارد حساب کاربری خود شوید');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading token:', error);
    }
  };

  const loadData = async () => {
    try {
      const [workerRes, pricesRes] = await Promise.all([
        axios.get('https://api.ajur.app/api/upgrade-plans', {
          params: { worker_id },
          headers: { Authorization: `Bearer ${userToken}` }
        }),
        axios.get('https://api.ajur.app/api/subscription-prices', {
          params: { worker_id },
          headers: { Authorization: `Bearer ${userToken}` }
        }),
      ]);

      setWorker(workerRes.data.data);
      setPrices(pricesRes.data.data);
    } catch (err) {
      setError('خطا در بارگذاری اطلاعات');
      console.error('Load error:', err);
      if (err.response?.status === 401) {
        Alert.alert('خطا', 'نشست شما منقضی شده است. لطفاً مجدداً وارد شوید');
        navigation.replace('Login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // ---------------------------------------------------------------
  // Plans — SKUها دقیقاً مطابق پنل مایکت (و بازار — یکسان هستند)
  // ---------------------------------------------------------------
  const getUrgentPlans = () => {
    if (!prices?.urgent) return [];
    const plans = [
      {
        id: 'urgent_3',
        type: 'urgent',
        days: 3,
        price: prices.urgent.days_3,
        color: '#f57c00',
        label: 'فوری',
        desc: 'نمایش بالای آگهی‌های عادی',
        modalDesc: 'با انتخاب پلن فوری ۳ روزه، آگهی شما به مدت ۳ روز در بالای تمام آگهی‌های عادی نمایش داده می‌شود.',
        modalDesc2: 'متمایز شدن رنگ آگهی و ریبون فوری باعث می‌شود تا چند برابر آگهی عادی بازدید بگیرید.',
        sku: '3_day_urgent',
      },
      {
        id: 'urgent_7',
        type: 'urgent',
        days: 7,
        price: prices.urgent.days_7,
        color: '#f57c00',
        label: 'فوری',
        desc: 'افزایش بازدید برای ۷ روز',
        modalDesc: 'پلن فوری ۷ روزه به شما امکان می‌دهد آگهی‌تان را برای یک هفته متمایز در رنگ و با ریبون فوری نگه دارید.',
        modalDesc2: 'متمایز شدن رنگ آگهی و ریبون فوری باعث می‌شود تا چند برابر آگهی عادی بازدید بگیرید.',
        sku: '7_day_urgent',
      },
      {
        id: 'urgent_30',
        type: 'urgent',
        days: 30,
        price: prices.urgent.days_30,
        color: '#f57c00',
        label: 'فوری',
        desc: 'بیشترین نمایش برای ۳۰ روز',
        modalDesc: 'بهترین گزینه برای نمایش طولانی‌مدت. آگهی شما یک ماه کامل در بالای لیست فوری‌ها قرار می‌گیرد.',
        modalDesc2: 'متمایز شدن رنگ آگهی و ریبون فوری باعث می‌شود تا چند برابر آگهی عادی بازدید بگیرید.',
        sku: '30_day_urgent',
      },
    ];
    return plans.filter((p) => typeof p.price === 'number');
  };

  const getSpecialPlans = () => {
    if (!prices?.special) return [];
    const plans = [
      {
        id: 'special_3',
        type: 'special',
        days: 3,
        price: prices.special.days_3,
        color: '#8e24aa',
        label: 'ویژه',
        desc: 'نمایش در بالای لیست',
        modalDesc: 'آگهی ویژه ۳ روزه آگهی شما را با برچسب ویژه در بالاترین موقعیت لیست نمایش می‌دهد.',
        modalDesc2: 'در این پلن تعداد تماس‌های دریافتی تأثیری ندارد و فقط در صورت پایان مدت زمان خریداری‌شده آگهی به حالت عادی برمی‌گردد.',
        sku: '3_day_special',
      },
      {
        id: 'special_7',
        type: 'special',
        days: 7,
        price: prices.special.days_7,
        color: '#8e24aa',
        label: 'ویژه',
        desc: 'نمایش در بالای لیست',
        modalDesc: 'با پلن ویژه ۷ روزه، آگهی شما یک هفته در جایگاه ویژه قرار می‌گیرد.',
        modalDesc2: 'در این پلن تعداد تماس‌های دریافتی تأثیری ندارد و فقط در صورت پایان مدت زمان خریداری‌شده آگهی به حالت عادی برمی‌گردد.',
        sku: '7_day_special',
      },
      {
        id: 'special_30',
        type: 'special',
        days: 30,
        price: prices.special.days_30,
        color: '#8e24aa',
        label: 'ویژه',
        desc: 'نمایش در بالای لیست',
        modalDesc: 'پلن ویژه ۳۰ روزه کامل‌ترین گزینه برای نمایش ویژه است.',
        modalDesc2: 'در این پلن تعداد تماس‌های دریافتی تأثیری ندارد و فقط در صورت پایان مدت زمان خریداری‌شده آگهی به حالت عادی برمی‌گردد.',
        sku: '30_day_special',
      },
    ];
    return plans.filter((p) => typeof p.price === 'number');
  };

  const getCallPlans = () => {
    if (!prices?.calls) return [];
    const plans = [
      {
        id: 'calls_10',
        type: 'calls',
        calls: 10,
        price: prices.calls.pack_10,
        color: '#1565c0',
        label: 'تماسی',
        desc: '۱۰ تماس بیشتر',
        modalDesc: 'با این بسته ۱۰ تماس اضافه به حساب شما افزوده می‌شود.',
        modalDesc2: 'در این پلن شما فقط زمانی هزینه پرداخت می‌کنید که مشتری با شماره تماس متصل به آگهی شما تماس برقرار کند.',
        sku: '10_call_pack',
      },
      {
        id: 'calls_20',
        type: 'calls',
        calls: 20,
        price: prices.calls.pack_20,
        color: '#1565c0',
        label: 'تماسی',
        desc: '۲۰ تماس بیشتر',
        modalDesc: 'بسته ۲۰ تماسی برای آگهی‌هایی که بازدید متوسطی دارند ایده‌آل است.',
        modalDesc2: 'در این پلن شما فقط زمانی هزینه پرداخت می‌کنید که مشتری با شماره تماس متصل به آگهی شما تماس برقرار کند.',
        sku: '20_call_pack',
      },
      {
        id: 'calls_30',
        type: 'calls',
        calls: 30,
        price: prices.calls.pack_30,
        color: '#1565c0',
        label: 'تماسی',
        desc: '۳۰ تماس بیشتر',
        modalDesc: 'بهترین ارزش برای پرتقاضاترین آگهی‌ها. ۳۰ تماس اضافه با کمترین هزینه.',
        modalDesc2: 'در این پلن شما فقط زمانی هزینه پرداخت می‌کنید که مشتری با شماره تماس متصل به آگهی شما تماس برقرار کند.',
        sku: '30_call_pack',
      },
    ];
    return plans.filter((p) => typeof p.price === 'number');
  };

  const urgentPlans = getUrgentPlans();
  const specialPlans = getSpecialPlans();
  const callPlans = getCallPlans();

  const totalPrice = typeof selectedPlan?.price === 'number' ? selectedPlan.price : 0;

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // ---------------------------------------------------------------
  // Checkout — Myket
  // ---------------------------------------------------------------
  const handleCheckout = async () => {
    if (!selectedPlan || typeof selectedPlan.price !== 'number') {
      Alert.alert('خطا', 'لطفاً یک پلن معتبر انتخاب کنید.');
      return;
    }

    if (purchasing) return;
    setPurchasing(true);

    try {
      const productSku = selectedPlan.sku;

      // ---------------------------------------------------------------
      // مرحله ۱: خرید از مایکت
      // ---------------------------------------------------------------
      let purchaseResult;
      try {
        const purchasePromise = myket.purchaseProduct(productSku);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('PURCHASE_TIMEOUT')), 60000)
        );
        purchaseResult = await Promise.race([purchasePromise, timeoutPromise]);
        console.log('✅ Purchase successful:', purchaseResult);
      } catch (purchaseError) {
        const rawMsg = (purchaseError?.message || '').toString();
        const lower = rawMsg.toLowerCase();
        console.log('❌ Purchase stage error:', rawMsg);
        console.log('❌ Full purchaseError:', purchaseError);

        const isCancel =
          lower.includes('cancel') ||
          lower.includes('canceled') ||
          lower.includes('cancelled') ||
          lower.includes('user canceled') ||
          lower.includes('user cancelled');

        if (isCancel) {
          Alert.alert(
            'لغو خرید',
            'متاسفانه پرداخت انجام نشد.\nدر صورت نیاز می‌توانید دوباره تلاش کنید.'
          );
        } else if (lower.includes('timeout')) {
          Alert.alert(
            'زمان خرید به پایان رسید',
            'متاسفانه پرداخت انجام نشد.\nلطفاً دوباره تلاش کنید.'
          );
        } else {
          Alert.alert(
            'متاسفانه پرداخت انجام نشد',
            'در صورت تکرار مشکل با پشتیبانی تماس بگیرید.'
          );
        }

        setPurchasing(false);
        return;
      }

      // ---------------------------------------------------------------
      // مرحله ۲: مصرف محصول (برای مصرف‌شدنی‌ها)
      // ---------------------------------------------------------------
      try {
        await myket.consumePurchase(purchaseResult.purchaseToken);
        console.log('✅ Product consumed:', purchaseResult.purchaseToken);
      } catch (consumeError) {
        console.error('❌ Failed to consume product:', consumeError);
        try {
          await AsyncStorage.setItem(
            'pending_consume',
            JSON.stringify({
              token: purchaseResult.purchaseToken,
              sku: productSku,
              timestamp: Date.now(),
            })
          );
        } catch (e) {
          console.error('Failed to store pending consume:', e);
        }
      }

      // ---------------------------------------------------------------
      // مرحله ۳: ارسال به سرور
      // ---------------------------------------------------------------
      const payload = {
        worker_id,
        plan: {
          type: selectedPlan.type,
          plan_id: selectedPlan.id,
          days: selectedPlan.days,
          calls: selectedPlan.calls,
          price: selectedPlan.price,
        },
        total_price: totalPrice,
        purchase_token: purchaseResult.purchaseToken,
        order_id: purchaseResult.orderId,
        product_id: purchaseResult.productId,
        package_name: purchaseResult.packageName || 'com.ajur.app',
      };

      let res;
      try {
        res = await axios.post(
          'https://api.ajur.app/api/myket-post-upgrade',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
              'X-Request-ID': generateUUID(),
            },
          }
        );
      } catch (serverError) {
        console.error('❌ Server error:', serverError);
        console.error('❌ Server response:', serverError?.response?.data);

        try {
          await AsyncStorage.setItem(
            'pending_purchase',
            JSON.stringify({ payload, timestamp: Date.now() })
          );
        } catch (e) {
          console.error('Failed to store pending purchase:', e);
        }

        const status = serverError?.response?.status;
        if (status === 401) {
          Alert.alert(
            'نشست منقضی شده',
            'لطفاً مجدداً وارد حساب کاربری خود شوید.'
          );
          navigation.replace('Login');
        } else if (status === 409) {
          Alert.alert(
            'خرید تکراری',
            'این خرید قبلاً برای این آگهی ثبت شده است.'
          );
        } else if (status >= 500) {
          Alert.alert(
            'خطای سرور',
            'متاسفانه پرداخت انجام نشد.\nخرید شما ثبت شده و به‌زودی بررسی می‌شود.'
          );
        } else {
          Alert.alert(
            'متاسفانه پرداخت انجام نشد',
            'لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.'
          );
        }

        setPurchasing(false);
        return;
      }

      // ---------------------------------------------------------------
      // مرحله ۴: بررسی پاسخ سرور
      // ---------------------------------------------------------------
      if (res?.data?.success) {
        Alert.alert('موفق', 'خرید با موفقیت انجام شد', [
          { text: 'باشه', onPress: () => navigation.replace('Dashboard') },
        ]);
      } else {
        console.warn('⚠️ Server returned success=false:', res?.data);
        try {
          await AsyncStorage.setItem(
            'pending_purchase',
            JSON.stringify({ payload, timestamp: Date.now() })
          );
        } catch (e) {
          console.error('Failed to store pending purchase:', e);
        }

        Alert.alert(
          'متاسفانه پرداخت انجام نشد',
          'خرید شما ثبت شد اما تایید سرور انجام نشد.\nدر صورت کسر وجه، مبلغ به‌زودی بازگردانده می‌شود.'
        );
      }
    } catch (err) {
      console.error('❌ Unexpected error in handleCheckout:', err);
      Alert.alert(
        'متاسفانه پرداخت انجام نشد',
        'خطای غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید.'
      );
    } finally {
      setPurchasing(false);
    }
  };

  // ---------------------------------------------------------------
  // Active Plans Tab
  // ---------------------------------------------------------------
  const renderActivePlansTab = () => {
    const stats = worker?.upgrade_stats;

    if (!stats) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>این قسمت در حال بروز رسانی است</Text>
        </View>
      );
    }

    return (
      <View style={styles.activePlansContainer}>
        {stats.calls && (
          <View style={styles.planCardLarge}>
            <Text style={styles.planTitle}>پلن تماس</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>تماس‌های خریداری شده:</Text>
              <Text style={styles.statsValue}>{stats.calls.total}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>مصرف شده:</Text>
              <Text style={styles.statsValue}>{stats.calls.used}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>باقی مانده:</Text>
              <Text style={[styles.statsValue, styles.remainingValue]}>
                {stats.calls.total - stats.calls.used}
              </Text>
            </View>
          </View>
        )}

        {stats.special && (
          <View style={styles.planCardLarge}>
            <Text style={styles.planTitle}>پلن ویژه</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>شروع:</Text>
              <Text style={styles.statsValue}>{stats.special.start_date}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>پایان:</Text>
              <Text style={styles.statsValue}>{stats.special.end_date}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>روزهای باقی مانده:</Text>
              <Text style={[styles.statsValue, styles.remainingValue]}>
                {stats.special.remaining_days}
              </Text>
            </View>
          </View>
        )}

        {stats.urgent && (
          <View style={styles.planCardLarge}>
            <Text style={styles.planTitle}>پلن فوری</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>شروع:</Text>
              <Text style={styles.statsValue}>{stats.urgent.start_date}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>پایان:</Text>
              <Text style={styles.statsValue}>{stats.urgent.end_date}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>روزهای باقی مانده:</Text>
              <Text style={[styles.statsValue, styles.remainingValue]}>
                {stats.urgent.remaining_days}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const DiagonalRibbon = ({ label, color }) => (
    <View style={[styles.ribbon, { borderRightColor: color }]}>
      <Text style={styles.ribbonText}>{label}</Text>
    </View>
  );

  const PlanCard = ({ plan, isSelected, onPress }) => {
    const priceLabel =
      typeof plan.price === 'number'
        ? `${plan.price.toLocaleString()} تومان`
        : '—';

    return (
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && { borderColor: plan.color, borderWidth: 2, backgroundColor: '#f9f9f9' },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <DiagonalRibbon label={plan.label} color={plan.color} />
        <View style={styles.planContent}>
          <Text style={styles.planDays}>
            {plan.days ? `${plan.days} روز` : `${plan.calls} تماس`}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.planPrice}>{priceLabel}</Text>
          <Text style={styles.planDesc}>{plan.desc}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const SectionTitle = ({ title, onInfoPress, color }) => (
    <View style={styles.sectionHeader}>
      <TouchableOpacity style={styles.infoButton} onPress={onInfoPress}>
        <Text style={[styles.infoButtonText, { color: color }]}>توضیحات بیشتر</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderPurchasePlansTab = () => (
    <>
      <View style={styles.section}>
        <SectionTitle
          title="بسته‌های افزایش تماس"
          color="#1565c0"
          onInfoPress={() =>
            setModalPlan({
              label: 'بسته‌های افزایش تماس',
              color: '#1565c0',
              modalDesc: 'با خرید بسته تماس، تعداد تماس‌های دریافتی آگهی شما افزایش می‌یابد.',
              modalDesc2: 'هزینه هر تماس از کیف پول شما کسر می‌شود. این بسته‌ها تا ۶ ماه اعتبار دارند.',
            })
          }
        />
        <View style={styles.plansRow}>
          {callPlans.map((plan) => (
            <View key={plan.id} style={styles.planWrapper}>
              <PlanCard
                plan={plan}
                isSelected={selectedPlan?.id === plan.id}
                onPress={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionDivider} />

      <View style={styles.section}>
        <SectionTitle
          title="آگهی ویژه"
          color="#8e24aa"
          onInfoPress={() =>
            setModalPlan({
              label: 'آگهی ویژه',
              color: '#8e24aa',
              modalDesc: 'آگهی ویژه در بالای تمام آگهی‌های عادی و فوری نمایش داده می‌شود.',
              modalDesc2: 'این پلن باعث افزایش چشمگیر بازدید و تماس‌های شما می‌شود.',
            })
          }
        />
        <View style={styles.plansRow}>
          {specialPlans.map((plan) => (
            <View key={plan.id} style={styles.planWrapper}>
              <PlanCard
                plan={plan}
                isSelected={selectedPlan?.id === plan.id}
                onPress={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionDivider} />

      <View style={styles.section}>
        <SectionTitle
          title="آگهی فوری"
          color="#f57c00"
          onInfoPress={() =>
            setModalPlan({
              label: 'آگهی فوری',
              color: '#f57c00',
              modalDesc: 'آگهی فوری در بالای آگهی‌های عادی و با رنگ متمایز نمایش داده می‌شود.',
              modalDesc2: 'مناسب برای آگهی‌هایی که نیاز به دیده شدن سریع دارند.',
            })
          }
        />
        <View style={styles.plansRow}>
          {urgentPlans.map((plan) => (
            <View key={plan.id} style={styles.planWrapper}>
              <PlanCard
                plan={plan}
                isSelected={selectedPlan?.id === plan.id}
                onPress={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
              />
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.freePlanButton} onPress={() => setShowFreeModal(true)}>
        <Text style={styles.freePlanText}>ادامه رایگان بدون خرید اشتراک</Text>
      </TouchableOpacity>
    </>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryButtonText}>تلاش مجدد</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#f57c00']} />
        }
      >
        <View style={styles.header}>
          <FastImage source={{ uri: worker.thumb }} style={styles.workerImage} />
          <Text style={styles.pageTitle}>ارتقای آگهی</Text>
          <Text style={styles.workerName}>{worker.name}</Text>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 0 && styles.activeTab]}
            onPress={() => setActiveTab(0)}
          >
            <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>خرید پلن</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 1 && styles.activeTab]}
            onPress={() => setActiveTab(1)}
          >
            <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>پلن های فعال</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 0 ? renderPurchasePlansTab() : renderActivePlansTab()}

        <View style={{ height: 100 }} />
      </ScrollView>

      {activeTab === 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              (!selectedPlan || typeof selectedPlan.price !== 'number' || purchasing) &&
                styles.checkoutButtonDisabled,
            ]}
            onPress={handleCheckout}
            disabled={!selectedPlan || typeof selectedPlan.price !== 'number' || purchasing}
          >
            {purchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.checkoutButtonText}>
                {selectedPlan && typeof selectedPlan.price === 'number'
                  ? `تکمیل خرید • ${totalPrice.toLocaleString()} تومان`
                  : 'لطفاً یک پلن انتخاب کنید'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={!!modalPlan} transparent animationType="fade" onRequestClose={() => setModalPlan(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: modalPlan?.color }]}>{modalPlan?.label}</Text>
              <TouchableOpacity onPress={() => setModalPlan(null)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDesc}>{modalPlan?.modalDesc}</Text>
            <View style={styles.modalDivider} />
            <Text style={styles.modalDesc}>{modalPlan?.modalDesc2}</Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: modalPlan?.color }]}
              onPress={() => setModalPlan(null)}
            >
              <Text style={styles.modalButtonText}>متوجه شدم</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showFreeModal} transparent animationType="fade" onRequestClose={() => setShowFreeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ادامه رایگان</Text>
              <TouchableOpacity onPress={() => setShowFreeModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDesc}>
              تمام امکانات پایه آجر به صورت رایگان برای آگهی شما فعال می‌شود. هر
              زمان که نیاز داشتید می‌توانید از پنل خود برای ارتقاع این آگهی و جذب
              تماس و بازدید بیشتر اقدام کنید.
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#4caf50' }]}
              onPress={() => {
                setShowFreeModal(false);
                navigation.replace('Dashboard');
              }}
            >
              <Text style={styles.modalButtonText}>متوجه شدم</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f5' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  header: { alignItems: 'center', marginBottom: 24 },
  workerImage: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: '#f57c00', marginBottom: 12 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  workerName: { fontSize: 14, color: '#555' },
  tabsContainer: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, marginBottom: 20, padding: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#f57c00' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#666', fontFamily: 'iransans' },
  activeTabText: { color: '#fff' },
  activePlansContainer: { gap: 16 },
  planCardLarge: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },
  planTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 12, textAlign: 'right', fontFamily: 'iransans' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  statsLabel: { fontSize: 14, color: '#666', fontFamily: 'iransans' },
  statsValue: { fontSize: 14, fontWeight: '600', color: '#333', fontFamily: 'iransans' },
  remainingValue: { color: '#4caf50', fontWeight: 'bold' },
  emptyStateContainer: { padding: 40, alignItems: 'center' },
  emptyStateText: { fontSize: 15, color: '#999', fontFamily: 'iransans' },
  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#222' },
  infoButton: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  infoButtonText: { fontSize: 12, fontWeight: '500' },
  plansRow: { flexDirection: 'row', justifyContent: 'space-between' },
  planWrapper: { width: (width - 48) / 3 },
  planCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#ddd', minHeight: 170, overflow: 'hidden' },
  ribbon: { position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderRightWidth: 64, borderBottomWidth: 64, borderBottomColor: 'transparent', zIndex: 1 },
  ribbonText: { position: 'absolute', top: 6, right: -58, color: 'white', fontSize: 10, fontWeight: 'bold', transform: [{ rotate: '45deg' }] },
  planContent: { paddingTop: 24, paddingHorizontal: 8, paddingBottom: 8, flex: 1, justifyContent: 'space-between' },
  planDays: { fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  divider: { height: 1.5, backgroundColor: '#ccc', marginVertical: 8 },
  planPrice: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: '#f57c00' },
  planDesc: { fontSize: 11, color: '#666', textAlign: 'center' },
  sectionDivider: { height: 1.5, backgroundColor: '#ccc', marginVertical: 16 },
  freePlanButton: { alignItems: 'center', marginTop: 16, marginBottom: 8 },
  freePlanText: { fontSize: 13, color: '#666', textDecorationLine: 'underline' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  checkoutButton: { backgroundColor: '#4caf50', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  checkoutButtonDisabled: { backgroundColor: '#ccc' },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: width * 0.85, maxWidth: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalClose: { fontSize: 24, color: '#666' },
  modalDesc: { fontSize: 14, color: '#666', lineHeight: 24 },
  modalDivider: { height: 1.5, backgroundColor: '#ccc', marginVertical: 12 },
  modalButton: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { fontSize: 16, color: '#d32f2f', marginBottom: 16 },
  retryButton: { backgroundColor: '#f57c00', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default SingleUpgrade;