import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  Alert,
  Dimensions 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';

const { width } = Dimensions.get('window');

const DynamicContactForm = ({ 
  visible, 
  onClose, 
  onSave, 
  isEditing, 
  initialData, 
  categories 
}) => {
  const [activeCategory, setActiveCategory] = useState(initialData?.category || 'خریداران');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    phone: '',
    description: '',
    category: 'خریداران',
    // فیلدهای خاص هر دسته‌بندی
    propertyType: '',
    budget: '',
    paymentMethod: 'نقد',
    cashDiscount: '',
    exchangeDetails: '',
    area: '',
    location: '',
    rooms: '',
    rentPrice: '',
    deposit: '',
    rentalPeriod: '',
    salary: '',
    workHours: '',
    expertise: '',
    ...initialData // اضافه کردن داده‌های اولیه اگر در حال ویرایش هستیم
  });

  // وقتی initialData تغییر کرد، formData را آپدیت کن
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        mobile: initialData.mobile || '',
        phone: initialData.phone || '',
        description: initialData.description || '',
        category: initialData.category || 'خریداران',
        propertyType: initialData.propertyType || '',
        budget: initialData.budget || '',
        paymentMethod: initialData.paymentMethod || 'نقد',
        cashDiscount: initialData.cashDiscount || '',
        exchangeDetails: initialData.exchangeDetails || '',
        area: initialData.area || '',
        location: initialData.location || '',
        rooms: initialData.rooms || '',
        rentPrice: initialData.rentPrice || '',
        deposit: initialData.deposit || '',
        rentalPeriod: initialData.rentalPeriod || '',
        salary: initialData.salary || '',
        workHours: initialData.workHours || '',
        expertise: initialData.expertise || '',
      });
      setActiveCategory(initialData.category || 'خریداران');
    }
  }, [initialData]);

  // تعریف فیلدهای هر دسته‌بندی
  const categoryFields = {
    'خریداران': [
      { key: 'propertyType', label: 'نوع ملک مورد نظر', type: 'select', options: ['آپارتمان', 'ویلا', 'زمین', 'تجاری'] },
      { key: 'area', label: 'متراژ مورد نظر (متر)', type: 'number' },
      { key: 'location', label: 'منطقه/محله مورد نظر', type: 'text' },
      { key: 'budget', label: 'بودجه (تومان)', type: 'number' },
      { key: 'paymentMethod', label: 'شرایط پرداخت', type: 'select', options: ['نقد', 'اقساط', 'تهاتر'] },
      { key: 'cashDiscount', label: 'تخفیف نقدی (%)', type: 'number', condition: formData.paymentMethod === 'نقد' },
      { key: 'exchangeDetails', label: 'جزئیات تهاتر', type: 'textarea', condition: formData.paymentMethod === 'تهاتر' },
      { key: 'rooms', label: 'تعداد خواب', type: 'number' },
    ],
    'فروشندگان': [
      { key: 'propertyType', label: 'نوع ملک', type: 'select', options: ['آپارتمان', 'ویلا', 'زمین', 'تجاری'] },
      { key: 'area', label: 'متراژ (متر)', type: 'number' },
      { key: 'location', label: 'آدرس ملک', type: 'text' },
      { key: 'budget', label: 'قیمت پیشنهادی (تومان)', type: 'number' },
      { key: 'paymentMethod', label: 'شرایط فروش', type: 'select', options: ['نقد', 'اقساط', 'تهاتر'] },
    ],
    'موجرین': [
      { key: 'propertyType', label: 'نوع ملک', type: 'select', options: ['آپارتمان', 'ویلا', 'تجاری'] },
      { key: 'area', label: 'متراژ (متر)', type: 'number' },
      { key: 'location', label: 'آدرس ملک', type: 'text' },
      { key: 'rentPrice', label: 'اجاره ماهانه (تومان)', type: 'number' },
      { key: 'deposit', label: 'ودیعه (تومان)', type: 'number' },
      { key: 'rentalPeriod', label: 'مدت اجاره', type: 'select', options: ['کوتاه مدت', 'بلند مدت'] },
    ],
    'مستاجرین': [
      { key: 'propertyType', label: 'نوع ملک مورد نظر', type: 'select', options: ['آپارتمان', 'ویلا', 'تجاری'] },
      { key: 'area', label: 'متراژ مورد نظر (متر)', type: 'number' },
      { key: 'location', label: 'منطقه مورد نظر', type: 'text' },
      { key: 'rentPrice', label: 'حداکثر اجاره (تومان)', type: 'number' },
      { key: 'deposit', label: 'حداکثر ودیعه (تومان)', type: 'number' },
      { key: 'rentalPeriod', label: 'مدت اجاره', type: 'select', options: ['کوتاه مدت', 'بلند مدت'] },
    ],
    'نگهبانان': [
      { key: 'expertise', label: 'تخصص‌ها', type: 'text' },
      { key: 'workHours', label: 'ساعات کاری', type: 'select', options: ['روزکاری', 'شبکاری', '۲۴ ساعته'] },
      { key: 'salary', label: 'حقوق درخواستی (تومان)', type: 'number' },
    ],
    'متفرقه': [
      { key: 'expertise', label: 'تخصص/نوع خدمات', type: 'text' },
    ]
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = () => {
    // اعتبارسنجی
    if (!formData.name.trim() && !formData.mobile.trim()) {
      Alert.alert('خطا', 'لطفا حداقل نام یا شماره موبایل را وارد کنید');
      return;
    }
    
    onSave({
      ...formData,
      category: activeCategory,
      date: new Date().toLocaleDateString('fa-IR'),
      time: new Date().toLocaleTimeString('fa-IR'),
      id: initialData?.id || Date.now().toString()
    });
  };

  const renderField = (field) => {
    // اگر فیلد شرطی باشد و شرط آن برقرار نباشد، نمایش داده نشود
    if (field.condition === false) return null;

    switch (field.type) {
      case 'text':
        return (
          <TextInput
            key={field.key}
            style={styles.textInput}
            value={formData[field.key]}
            onChangeText={(text) => handleInputChange(field.key, text)}
            placeholder={field.label}
            placeholderTextColor="#8d6e63"
          />
        );
      case 'number':
        return (
          <TextInput
            key={field.key}
            style={styles.textInput}
            value={formData[field.key]}
            onChangeText={(text) => handleInputChange(field.key, text.replace(/[^0-9]/g, ''))}
            placeholder={field.label}
            placeholderTextColor="#8d6e63"
            keyboardType="numeric"
          />
        );
      case 'textarea':
        return (
          <TextInput
            key={field.key}
            style={[styles.textInput, { height: 80 }]}
            value={formData[field.key]}
            onChangeText={(text) => handleInputChange(field.key, text)}
            placeholder={field.label}
            placeholderTextColor="#8d6e63"
            multiline
          />
        );
      case 'select':
        return (
          <View key={field.key} style={styles.selectContainer}>
            <Text style={styles.selectLabel}>{field.label}</Text>
            <View style={styles.selectOptions}>
              {field.options.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.selectOption,
                    formData[field.key] === option && styles.selectOptionActive
                  ]}
                  onPress={() => handleInputChange(field.key, option)}
                >
                  <Text style={[
                    styles.selectOptionText,
                    formData[field.key] === option && styles.selectOptionTextActive
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.addModalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.formTitle}>
              {isEditing ? "ویرایش مخاطب" : "افزودن مخاطب جدید"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* دسته‌بندی */}
            <View style={styles.categorySection}>
              <Text style={styles.sectionLabel}>دسته‌بندی</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {categories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      { backgroundColor: activeCategory === category.id ? category.color : '#f0e6d2' }
                    ]}
                    onPress={() => setActiveCategory(category.id)}
                  >
                    <Text style={[
                      styles.categoryText,
                      { color: activeCategory === category.id ? 'white' : '#5d4037' }
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* اطلاعات پایه */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>اطلاعات پایه</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="نام و نام خانوادگی"
                placeholderTextColor="#282625ff"
              />
              <TextInput
                style={styles.textInput}
                value={formData.mobile}
                onChangeText={(text) => handleInputChange('mobile', text.replace(/[^0-9]/g, ''))}
                placeholder="شماره موبایل *"
                placeholderTextColor="#8d6e63"
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.textInput}
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text.replace(/[^0-9]/g, ''))}
                placeholder="تلفن ثابت"
                placeholderTextColor="#8d6e63"
                keyboardType='phone-pad'
              />
            </View>

            {/* اطلاعات خاص دسته‌بندی */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>اطلاعات {activeCategory}</Text>
              {categoryFields[activeCategory]?.map(renderField)}
            </View>

            {/* توضیحات */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>توضیحات تکمیلی</Text>
              <TextInput
                style={[styles.textInput, { height: 80 }]}
                value={formData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="توضیحات اضافی"
                placeholderTextColor="#8d6e63"
                multiline
              />
            </View>
          </ScrollView>

          {/* دکمه‌های action */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.actionButtonText}>انصراف</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.addButton]} 
              onPress={handleSave}
            >
              <Text style={styles.actionButtonText}>
                {isEditing ? 'بروزرسانی' : 'افزودن'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DynamicContactForm;