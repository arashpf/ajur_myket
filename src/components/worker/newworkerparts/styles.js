import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  // ==================== Progress ====================
  progress_wrapper: {
    flex: 1,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ==================== Modals ====================
  modal: {
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: height / 10,
    marginBottom: height / 10,
  },

  // ==================== Full Screen Category Modal ====================
  fullScreenModal: {
    margin: 0,
    justifyContent: 'center',
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // Category Modal Header
  categoryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    position: 'relative',
  },
  categoryModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'iransans',
    color: '#333',
    textAlign: 'center',
  },
  categoryModalCloseButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 2,
  },

  // Category Modal Divider
  categoryModalDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  categoryModalDividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#e8e8e8',
  },
  categoryModalDividerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a92b31',
    marginHorizontal: 12,
  },

  // Category Items
  categoryModalItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  categoryModalItemSelected: {
    backgroundColor: '#fef0f1',
  },
  categoryModalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  categoryModalItemText: {
    fontSize: 17,
    fontFamily: 'iransans',
    color: '#444',
    textAlign: 'right',
    flex: 1,
    marginRight: 12,
  },
  categoryModalItemTextSelected: {
    color: '#a92b31',
    fontWeight: 'bold',
  },
  categoryModalCheckmark: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryModalCheckmarkEmpty: {
    width: 30,
    height: 30,
  },
  categoryModalItemDivider: {
    height: 0.5,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },

  categoryLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLoadingText: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: 'iransans',
    color: '#666',
  },
  fullScreenCategoryList: {
    flex: 1,
  },
  fullScreenCategoryListContent: {
    paddingBottom: 30,
  },
  fullScreenModalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  fullScreenModalFooterText: {
    fontSize: 15,
    fontFamily: 'iransans',
    color: '#a92b31',
    fontWeight: '500',
    marginLeft: 8,
  },

  // ==================== Form Fields ====================
  predefined_Wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 5,
    margin: 10,
    borderWidth: .5,
    borderColor: 'gray',
    // borderColor: '#b9272e',
    borderRadius: 10,
    paddingTop: 5,
  },

  description: {
    fontSize: 18,
    fontFamily: 'iransans',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: 'gray',
    // borderColor: '#b9272e',
    borderRadius: 5,
    paddingTop: 5,
    marginTop:20
  },

  // در styles.js اضافه کنید
// در styles.js
// در styles.js - اصلاح descriptionInput
// در styles.js
descriptionInput: {
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#d0d0d0',
  borderRadius: 10,
  padding: 4,
  paddingTop: 8,
  paddingBottom: 8,
  paddingHorizontal: 14, // <-- فاصله از چپ و راست
  marginTop: 8,
  marginBottom: 8,
  marginHorizontal: 10,
  fontFamily: 'iransans',
  fontSize: 16,
  textAlignVertical: 'top',
  minHeight: 120,
},
descriptionInputFocused: {
  borderColor: '#a92b31',
  borderWidth: 2,
},

  checkboxsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#b9272e',
    padding: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: '#b9272e',
    borderRadius: 5,
    paddingTop: 5,
  },

  uncheckboxsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 5,
    margin: 10,
    borderWidth: .5,
    borderColor: 'gray',
    // borderColor: '#b9272e',
    borderRadius: 10,
    paddingTop: 8,
  },

  checkboxsChecked: {
    color: 'white',
  },

  checkbox: {
    width: 20,
    height: 20,
    marginTop: 10,
  },

  spinnerView: {
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },

  spinner: {
    marginBottom: 20,
  },

  // ==================== Normal Field Input - Divar Style ====================
  normalFieldContainer: {
    marginHorizontal: 10,
    marginVertical: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  normalFieldLabelWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  normalFieldLabel: {
    fontSize: 15,
    fontFamily: 'iransans',
    color: '#555',
    fontWeight: '500',
  },
  normalFieldUnit: {
    fontSize: 13,
    fontFamily: 'iransans',
    color: '#888',
    fontWeight: '400',
  },

  normalFieldInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#d0d0d0',
    paddingBottom: 6,
  },
  normalFieldInputWrapperFocused: {
    borderBottomColor: '#bc323b',
    borderBottomWidth: 2,
  },

  normalFieldInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'iransans',
    color: '#333',
    paddingVertical: 4,
    paddingHorizontal: 4,
    textAlign: 'right',
    minHeight: 30,
  },

  clearButton: {
    padding: 4,
    marginLeft: 4,
  },

  normalFieldHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#f0f0f0',
  },
  normalFieldHintText: {
    fontSize: 13,
    fontFamily: 'iransans',
    color: '#888',
    marginLeft: 6,
    flex: 1,
    textAlign: 'right',
  },

  // ==================== Image & Video ====================
  AddIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    verticalAlign: 'center',
    height: 100,
    width: 100,
    margin: 5,
  },

  imagedAddIcon: {
    padding: 15,
    margin: 5,
    borderColor: '#b92a31',
    borderStyle: 'dashed',
    borderWidth: 1,
    alignItems: 'center',
    textAlign: 'center',
    verticalAlign: 'center',
  },

  fullScreenImage: {
    width: '100%',
    height: '80%',
  },

  // ==================== Video Modal ====================
  videoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  videoModalContent: {
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    position: 'absolute', // ← اضافه کنید
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  videoModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 10,
  },
  smallButton: {
    flex: 1,
    marginHorizontal: 5,
  },


  // ==================== Video Preview Full Screen ====================
videoModalFullContainer: {
  flex: 1,
  backgroundColor: 'black',
  justifyContent: 'center',
  alignItems: 'center',
},

videoModalFullPlayer: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
},

videoModalCloseButton: {
  position: 'absolute',
  top: 50,
  right: 20,
  zIndex: 20,
  backgroundColor: 'rgba(0,0,0,0.5)',
  padding: 10,
  borderRadius: 30,
  width: 48,
  height: 48,
  alignItems: 'center',
  justifyContent: 'center',
},

videoModalFullTitle: {
  position: 'absolute',
  top: 55,
  left: 0,
  right: 0,
  textAlign: 'center',
  color: 'white',
  fontSize: 17,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  zIndex: 20,
  backgroundColor: 'rgba(0,0,0,0.3)',
  paddingVertical: 8,
  paddingHorizontal: 16,
  alignSelf: 'center',
  borderRadius: 8,
},

videoModalFullHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingTop: 50,
  paddingBottom: 12,
  backgroundColor: 'rgba(0,0,0,0.4)',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
},

videoModalFullHeaderTitle: {
  fontSize: 17,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  color: 'white',
},
  // ==================== Video Trimmer Modal ====================
  trimmerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  trimmerModalContent: {
    width: '95%',
    maxHeight: '85%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  trimmerModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'iransans',
    color: '#333',
    marginBottom: 8,
  },
  trimmerModalSubtitle: {
    fontSize: 14,
    fontFamily: 'iransans',
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  trimmerModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 10,
  },
  trimmerCancelButton: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  trimmerConfirmButton: {
    flex: 1,
    backgroundColor: '#a92b31',
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  trimmerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  trimmerCloseButton: {
    padding: 4,
  },
  trimmerVideoPreview: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
    marginBottom: 16,
  },
  videoPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  videoPreviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'iransans',
    color: '#333',
  },

  // ==================== Image Thumbnail ====================
  imageThumbnail: {
    height: 100,
    width: 100,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  addButton: {
    height: 100,
    width: 100,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#b92a31',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 8,
  },
  mainImageBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    alignItems: 'center',
  },
  mainImageText: {
    color: 'white',
    fontSize: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 12,
  },

  // ==================== Category & Location Selector ====================
  categorySelector: {
    backgroundColor: 'white',
    height: 60,
    padding: 15,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    // borderColor: '#bc323b',
    borderRadius: 8,
    paddingTop: 5,
  },
  categorySelectorText: {
    fontFamily: 'iransans',
    fontSize: 15,
    flex: 1,
    textAlign: 'right',
  },
  categorySelectorPlaceholder: {
    color: '#999',
  },
  categorySelectorSelected: {
    color: '#333',
  },

  locationSelector: {
    backgroundColor: 'white',
    height: 60,
    padding: 15,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    // borderColor: '#4CAF50',
    borderRadius: 8,
    paddingTop: 5,
  },
  locationSelectorText: {
    fontFamily: 'iransans',
    fontSize: 16,
    flex: 1,
    textAlign: 'right',
    marginHorizontal: 10,
  },
  locationSelectorPlaceholder: {
    color: '#999',
  },
  locationSelectorSelected: {
    color: '#333',
  },

  // ==================== Header ====================
  headerContainer: {
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'iransans',
    color: '#333',
  },

  // ==================== Section ====================
  sectionTitle: {
    color: 'gray',
    margin: 20,
    fontFamily: 'iransans',
    fontSize: 18,
  },
  sectionSubtitle: {
    color: 'gray',
    marginHorizontal: 20,
    fontFamily: 'iransans',
    fontSize: 15,
    marginBottom: 10,
  },

  // ==================== Submit Button ====================
  submitButton: {
    margin: 20,
    height: 50,
    marginBottom: 80,
    backgroundColor: '#a92b31',
  },
  submitButtonText: {
    fontSize: 22,
    color: 'white',
  },

  // ==================== Address Modal ====================
  addressMainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  addressHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  addressCloseButton: {
    padding: 4,
  },
  addressLoadingContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  addressScrollContent: {
    flex: 1,
  },
  addressScrollContentContainer: {
    padding: 20,
  },
  addressInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  addressInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    textAlign: 'right',
    marginRight: 10,
    lineHeight: 20,
  },
  addressFormField: {
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'right',
    color: '#333',
  },
  addressSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  addressSelectionButtonError: {
    borderColor: '#D32F2F',
    borderWidth: 2,
  },
  addressSelectionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressSelectionButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    textAlign: 'right',
  },
  addressSelectionButtonPlaceholder: {
    color: '#999',
  },
  addressHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  addressHintText: {
    fontSize: 12,
    color: '#E65100',
    marginRight: 6,
    flex: 1,
    textAlign: 'right',
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    textAlign: 'right',
    fontSize: 14,
    backgroundColor: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#333',
  },
  addressInputError: {
    borderColor: '#D32F2F',
    borderWidth: 2,
  },
  addressErrorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
  addressButtonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  addressSubmitButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  addressSubmitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressSubmitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  addressBottomPadding: {
    height: 30,
  },

  // Address Modal - City & Neighborhood Selection
  addressModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.85,
    minHeight: height * 0.5,
  },
  addressModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addressModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addressModalSearchWrapper: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addressModalSearchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  addressModalSearchText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginHorizontal: 10,
    color: '#333',
  },
  addressModalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addressModalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressModalItemText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    textAlign: 'right',
    flex: 1,
  },
  addressModalEmptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressModalEmptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  addressModalWarningContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressModalWarningText: {
    marginTop: 10,
    fontSize: 14,
    color: '#FF9800',
    textAlign: 'center',
  },

  // ==================== Label & Required ====================
  label: {
    color: 'gray',
    margin: 20,
    fontFamily: 'iransans',
  },
  required: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ==================== Normal Modal (Legacy - kept for compatibility) ====================
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    alignItems: 'center',
  },
  valueButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  valueText: {
    fontSize: 18,
    color: '#555',
  },
  descriptionText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#777',
    fontSize: 17,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    width: '100%',
    fontSize: 18,
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  confirmHeaderButton: {
    backgroundColor: '#b92a31',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmHeaderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'iransans',
  },

  // ==================== Floating Label Input Styles ====================
// ==================== Floating Label Input Styles ====================
// styles.js - Update floatingContainer to add space on the left

floatingContainer: {
  marginHorizontal: 10,
  marginVertical: 6,
  paddingHorizontal: 12,
  paddingVertical: 8,
  paddingLeft: 40,   // ← Change from paddingRight to paddingLeft
  borderRadius: 10,
  borderWidth: 1.5,
  borderColor: '#d0d0d0',
  backgroundColor: 'white',
  minHeight: 48,
  justifyContent: 'center',
  position: 'relative',
},

floatingClearButton: {
  position: 'absolute',
  left: 10,     // ← Change from 'right' to 'left'
  top: '50%',
  transform: [{ translateY: -11 }],
  zIndex: 10,
  padding: 4,
},

floatingContainerFocused: {
  borderColor: '#bc323b',
  borderWidth: 2,
  shadowColor: '#bc323b',
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
},

// Floating Label - با پس‌زمینه سفید برای پوشاندن border
floatingLabelWrapper: {
  position: 'absolute',
  right: 14,
  zIndex: 1,
  backgroundColor: 'white', // پس‌زمینه سفید برای پوشاندن border
  borderRadius: 4,
},
floatingLabel: {
  fontFamily: 'iransans',
  fontWeight: '600',
  textAlign: 'right',
  backgroundColor: 'white', // پس‌زمینه سفید برای خود متن
  paddingHorizontal: 4,
  paddingVertical: 2,
  borderRadius: 3,
  overflow: 'hidden',
},
floatingLabelUnit: {
  fontSize: 9,
  color: '#555',
  fontWeight: '400',
},

// TextInput Row
floatingInputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingTop: 2,
},
floatingInput: {
  flex: 1,
  fontSize: 15,             // ← کاهش از 16 به 15
  fontFamily: 'iransans',
  color: '#333',
  paddingVertical: 4,       // ← کاهش از 6 به 4
  paddingHorizontal: 4,
  textAlign: 'right',
  minHeight: 28,            // ← کاهش از 35 به 28
},



// Hint - نمایش عدد به حروف
// Hint - نمایش عدد به حروف با ارتفاع ثابت
floatingHint: {
  flexDirection: 'row',
  alignItems: 'center',
  height: 20, // ← ارتفاع ثابت
  marginTop: 1,
  paddingTop: 1,
  marginRight:20,
  // borderTopWidth: 0.3,
  // borderTopColor: '#f0f0f0',
  // opacity: 0, // ← پیش‌فرض مخفی
},
floatingHintVisible: {
  opacity: 1, // ← وقتی مقدار دارد نمایش داده شود
},
floatingHintText: {
  fontSize: 13,
  fontFamily: 'iransans',
  color: '#888',
  marginLeft: 6,
  flex: 1,
  textAlign: 'right',
},

// ==================== Step Indicator Styles ====================
// ==================== Step Indicator Styles (Divar Style - Text Version) ====================
// ==================== Step Indicator Styles ====================
stepContainer: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  backgroundColor: 'white',
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},
stepHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 4,
},
stepCloseButton: {
  padding: 4,
  marginLeft: -4,
},
stepTextTitle: {
  fontSize: 15,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  color: '#333',
  flex: 1,
  textAlign: 'right',
},
stepProgressWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 2,
},
stepProgressBar: {
  flex: 1,
  height: 3,
  backgroundColor: '#e8e8e8',
  borderRadius: 2,
  overflow: 'hidden',
  marginRight: 10,
},
stepProgressFill: {
  height: '100%',
  backgroundColor: '#a92b31',
  borderRadius: 2,
},
stepTextSubtitle: {
  fontSize: 11,
  fontFamily: 'iransans',
  color: '#999',
  minWidth: 90,
  textAlign: 'right',
},

// ==================== Step Buttons ====================
nextStepButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#a92b31',
  marginHorizontal: 10,
  marginTop: 20,
  marginBottom: 10,
  paddingVertical: 14,
  borderRadius: 12,
  shadowColor: '#a92b31',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 5,
},
nextStepButtonText: {
  fontSize: 18,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  color: 'white',
  marginLeft: 10,
},
backStepButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  borderWidth: 1,
  borderColor: '#a92b31',
  marginHorizontal: 5,
  marginTop: 10,
  marginBottom: 20,
  paddingVertical: 12,
  borderRadius: 12,
  flex: 1,
},
backStepButtonText: {
  fontSize: 16,
  fontFamily: 'iransans',
  color: '#a92b31',
  marginRight: 10,
},

// ==================== Submit Button Fixed ====================
// ==================== Submit Button ====================
submitButtonWrapper: {
  paddingHorizontal: 20,
  paddingVertical: 12,
  paddingBottom: 16,
  backgroundColor: 'white',
  borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 5,
},
submitButton: {
  backgroundColor: '#a92b31',
  height: 54,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#a92b31',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 6,
},
submitButtonDisabled: {
  backgroundColor: '#cccccc',
  shadowOpacity: 0,
  elevation: 0,
},
submitButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
submitButtonIcon: {
  marginRight: 10,
},
submitButtonText: {
  fontSize: 18,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  color: 'white',
},


// ==================== Next Step Button (Fixed) ====================
nextStepButtonWrapper: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  paddingHorizontal: 20,
  paddingVertical: 12,
  paddingBottom: 16,
  borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 5,
  zIndex: 100,
},
nextStepButton: {
  backgroundColor: '#a92b31',
  height: 54,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#a92b31',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 6,
},
nextStepButtonDisabled: {
  backgroundColor: '#cccccc',
  shadowOpacity: 0,
  elevation: 0,
},
nextStepButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
nextStepButtonText: {
  fontSize: 18,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  color: 'white',
  marginRight: 8,
},


// ==================== Video Upload Progress ====================
videoUploadProgressContainer: {
  marginHorizontal: 10,
  marginVertical: 8,
  padding: 12,
  backgroundColor: 'white',
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#e0e0e0',
},
videoUploadProgressRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 6,
},
videoUploadProgressText: {
  fontSize: 14,
  fontFamily: 'iransans',
  color: '#333',
},
videoUploadCancelButton: {
  padding: 4,
},
videoUploadProgressBar: {
  height: 6,
  backgroundColor: '#e8e8e8',
  borderRadius: 3,
  overflow: 'hidden',
},
videoUploadProgressFill: {
  height: '100%',
  backgroundColor: '#a92b31',
  borderRadius: 3,
},
videoUploadProgressPercent: {
  fontSize: 12,
  fontFamily: 'iransans',
  color: '#666',
  textAlign: 'right',
  marginTop: 4,
},

// ==================== Step Indicator ====================
stepContainer: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  backgroundColor: 'white',
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},
stepHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 4,
},
stepCloseButton: {
  padding: 4,
  marginLeft: -4,
},
stepTextTitle: {
  fontSize: 15,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  color: '#333',
  textAlign: 'right',
},
stepProgressWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 2,
},
stepProgressBar: {
  flex: 1,
  height: 3,
  backgroundColor: '#e8e8e8',
  borderRadius: 2,
  overflow: 'hidden',
  marginRight: 10,
},
stepProgressFill: {
  height: '100%',
  backgroundColor: '#a92b31',
  borderRadius: 2,
},
stepTextSubtitle: {
  fontSize: 11,
  fontFamily: 'iransans',
  color: '#999',
  minWidth: 90,
  textAlign: 'right',
},

// ==================== Next Step Button ====================
nextStepButtonWrapper: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  paddingHorizontal: 20,
  paddingVertical: 12,
  paddingBottom: 16,
  borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 5,
  zIndex: 100,
},
nextStepButton: {
  backgroundColor: '#a92b31',
  height: 54,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#a92b31',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 6,
},
nextStepButtonDisabled: {
  backgroundColor: '#cccccc',
  shadowOpacity: 0,
  elevation: 0,
},
nextStepButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
nextStepButtonText: {
  fontSize: 18,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  color: 'white',
  marginRight: 8,
},

// ==================== Submit Button ====================
submitButtonWrapper: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'white',
  paddingHorizontal: 20,
  paddingVertical: 12,
  paddingBottom: 16,
  borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 5,
  zIndex: 100,
},
submitButton: {
  backgroundColor: '#a92b31',
  height: 54,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#a92b31',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 6,
},
submitButtonDisabled: {
  backgroundColor: '#cccccc',
  shadowOpacity: 0,
  elevation: 0,
},
submitButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
submitButtonIcon: {
  marginRight: 10,
},
submitButtonText: {
  fontSize: 18,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  color: 'white',
},

// ==================== Video Thumbnail Styles ====================
videoThumbnailWrapper: {
  margin: 5,
  borderRadius: 8,
  overflow: 'hidden',
  position: 'relative',
},
videoThumbnail: {
  height: 100,
  width: 100,
  justifyContent: 'center',
  alignItems: 'center',
},
videoStatusOverlay: {
  flex: 1,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.3)',
  justifyContent: 'center',
  alignItems: 'center',
},
videoProgressText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: 'white',
  fontFamily: 'iransans',
},
addButtonText: {
  fontSize: 12,
  color: 'gray',
  fontFamily: 'iransans',
  marginTop: 4,
},

// ==================== Video Duration Badge ====================
videoDurationBadge: {
  position: 'absolute',
  top: 6,
  right: 6,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.7)',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 4,
},
videoDurationText: {
  fontSize: 11,
  color: 'white',
  fontFamily: 'iransans',
  marginLeft: 2,
},

// ==================== Video Options Modal ====================
videoModalInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 16,
  paddingHorizontal: 4,
  borderBottomWidth: 0.5,
  borderBottomColor: '#f0f0f0',
  marginBottom: 8,
},
videoModalInfoText: {
  fontSize: 15,
  fontFamily: 'iransans',
  color: '#333',
  marginLeft: 12,
},
videoModalInfoTextError: {
  color: '#ff6b6b',
},

// ==================== Retry Modal ====================
retryModalContainer: {
  backgroundColor: 'white',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: 20,
  paddingTop: 12,
  paddingBottom: 30,
},
retryModalGrabber: {
  width: 40,
  height: 4,
  backgroundColor: '#e0e0e0',
  borderRadius: 2,
  alignSelf: 'center',
  marginBottom: 16,
},
retryModalItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
  borderBottomWidth: 0.5,
  borderBottomColor: '#f0f0f0',
},
retryModalItemDanger: {
  borderBottomWidth: 0,
},
retryModalItemText: {
  fontSize: 16,
  fontFamily: 'iransans',
  color: '#333',
  marginLeft: 12,
},
retryModalItemDangerText: {
  fontSize: 16,
  fontFamily: 'iransans',
  color: '#ff6b6b',
  marginLeft: 12,
},
retryModalCancel: {
  marginTop: 12,
  paddingVertical: 14,
  alignItems: 'center',
  borderRadius: 12,
  backgroundColor: '#f5f5f5',
},
retryModalCancelText: {
  fontSize: 16,
  fontFamily: 'iransans',
  color: '#666',
  fontWeight: 'bold',
},

videoPlaceholder: {
  backgroundColor: '#a92b31',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  width: 100,
  height: 100,
},
videoPlaceholderText: {
  fontSize: 12,
  color: 'white',
  fontFamily: 'iransans',
  marginTop: 4,
},

// ==================== Video Preview Full Screen ====================
videoModalFullContainer: {
  flex: 1,
  backgroundColor: 'black',
  justifyContent: 'center',
  alignItems: 'center',
},

videoModalFullPlayer: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'black',
},

videoModalCloseButton: {
  position: 'absolute',
  top: 50,
  right: 20,
  zIndex: 20,
  backgroundColor: 'rgba(0,0,0,0.5)',
  padding: 10,
  borderRadius: 30,
  width: 48,
  height: 48,
  alignItems: 'center',
  justifyContent: 'center',
},

videoModalFullTitle: {
  position: 'absolute',
  top: 55,
  left: 0,
  right: 0,
  textAlign: 'center',
  color: 'white',
  fontSize: 17,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  zIndex: 20,
  backgroundColor: 'rgba(0,0,0,0.3)',
  paddingVertical: 8,
  paddingHorizontal: 16,
  alignSelf: 'center',
  borderRadius: 8,
},

// styles.js - اضافه کردن در انتهای فایل

// ==================== Loading Screen ====================
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  paddingHorizontal: 20,
},

loadingText: {
  fontSize: 18,
  fontFamily: 'iransans',
  color: '#666',
  marginTop: 16,
},

loadingSubText: {
  fontSize: 14,
  fontFamily: 'iransans',
  color: '#999',
  marginTop: 8,
},

fullLoadingContainer: {
  flex: 1,
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
},


// ==================== Tick Field Selector ====================
tickFieldContainer: {
  marginHorizontal: 10,
  marginVertical: 6,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 10,
  borderWidth: 1.5,
  borderColor: '#d0d0d0',
  backgroundColor: 'white',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

tickFieldLabel: {
  fontSize: 15,
  fontFamily: 'iransans',
  color: '#333',
  fontWeight: '500',
  flex: 1,
  textAlign: 'right',
},

tickFieldOptions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

tickFieldOption: {
  paddingHorizontal: 16,
  paddingVertical: 6,
  margin:5,
  borderRadius: 8,
  borderWidth: 1.5,
  borderColor: '#d0d0d0',
  // backgroundColor: '#f5f5f5',
  minWidth: 60,
  alignItems: 'center',
},

tickFieldOptionSelected: {
  borderColor: '#a92b31',
  // backgroundColor: '#fef0f1',
},

tickFieldOptionText: {
  fontSize: 14,
  fontFamily: 'iransans',
  color: '#666',
},

tickFieldOptionTextSelected: {
  color: '#a92b31',
  fontWeight: 'bold',
},

// ==================== Extra Fields Toggle Button ====================
  // styles.js - Add these styles (put them in the appropriate section)

// ==================== Extra Fields Box (Divar Style) ====================
// styles.js - اضافه کنید یا جایگزین کنید

extraFieldsBox: {
  marginHorizontal: 10,
  marginVertical: 6,
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 10,
  borderWidth: 1.5,
  borderColor: '#e0e0e0',
  backgroundColor: 'white',
},

extraFieldsBoxContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

extraFieldsBoxTitle: {
  fontSize: 15,
  fontFamily: 'iransans',
  color: '#333',
  fontWeight: '500',
},

extraFieldsBoxLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},

extraFieldsBoxAction: {
  fontSize: 14,
  fontFamily: 'iransans',
  color: '#a92b31',
  fontWeight: '500',
},

extraFieldsBoxBadge: {
  backgroundColor: '#a92b31',
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 12,
},

extraFieldsBoxBadgeText: {
  fontSize: 12,
  fontFamily: 'iransans',
  color: 'white',
  fontWeight: '500',
},

// ==================== Extra Fields Modal ====================
extraFieldsModalContainer: {
  flex: 1,
  backgroundColor: 'white',
  marginTop: 40,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
},

extraFieldsModalHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},

extraFieldsModalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  fontFamily: 'iransans',
  color: '#333',
},

extraFieldsModalClose: {
  padding: 4,
},

extraFieldsModalContent: {
  flex: 1,
  paddingHorizontal: 4,
  paddingTop: 8,
},

extraFieldsModalFooter: {
  paddingHorizontal: 20,
  paddingVertical: 16,
  paddingBottom: 30,
  borderTopWidth: 1,
  borderTopColor: '#f0f0f0',
},

extraFieldsModalConfirm: {
  backgroundColor: '#a92b31',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
},

extraFieldsModalConfirmText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  fontFamily: 'iransans',
},

// ==================== Predefined Label ====================
predefinedLabel: {
  padding: 10,
  fontWeight: '600',
  textAlign: 'right',
  fontFamily: 'iransans',
  fontSize: 15,
  color: '#333',
},

// ==================== Required Star ====================
required: {
  color: 'red',
  fontSize: 16,
  fontWeight: 'bold',
},

// ==================== Tick Field Container ====================
tickFieldContainer: {
  marginHorizontal: 10,
  marginVertical: 6,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 10,
  borderWidth: 1.5,
  borderColor: '#d0d0d0',
  backgroundColor: 'white',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

tickFieldLabel: {
  fontSize: 15,
  fontFamily: 'iransans',
  color: '#333',
  fontWeight: '500',
  flex: 1,
  textAlign: 'right',
},

tickFieldOptions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},

tickFieldOption: {
  paddingHorizontal: 16,
  paddingVertical: 6,
  margin: 5,
  borderRadius: 8,
  borderWidth: 1.5,
  borderColor: '#d0d0d0',
  minWidth: 60,
  alignItems: 'center',
},

tickFieldOptionSelected: {
  borderColor: '#a92b31',
},

tickFieldOptionText: {
  fontSize: 14,
  fontFamily: 'iransans',
  color: '#666',
},

tickFieldOptionTextSelected: {
  color: '#a92b31',
  fontWeight: 'bold',
},

// ==================== Loading Container ====================
fullLoadingContainer: {
  flex: 1,
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
},

loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  paddingHorizontal: 20,
},

loadingText: {
  fontSize: 18,
  fontFamily: 'iransans',
  color: '#666',
  marginTop: 16,
},

loadingSubText: {
  fontSize: 14,
  fontFamily: 'iransans',
  color: '#999',
  marginTop: 8,
},

// ==================== Floating Container ====================
floatingContainer: {
  marginHorizontal: 10,
  marginVertical: 6,
  paddingHorizontal: 12,
  paddingVertical: 8,
  paddingLeft: 40,
  borderRadius: 10,
  borderWidth: 1.5,
  borderColor: '#d0d0d0',
  backgroundColor: 'white',
  minHeight: 48,
  justifyContent: 'center',
  position: 'relative',
},

floatingContainerFocused: {
  borderColor: '#bc323b',
  borderWidth: 2,
  shadowColor: '#bc323b',
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
},

floatingLabelWrapper: {
  position: 'absolute',
  right: 14,
  zIndex: 1,
  backgroundColor: 'white',
  borderRadius: 4,
},

floatingLabel: {
  fontFamily: 'iransans',
  fontWeight: '600',
  textAlign: 'right',
  backgroundColor: 'white',
  paddingHorizontal: 4,
  paddingVertical: 2,
  borderRadius: 3,
  overflow: 'hidden',
},

floatingLabelUnit: {
  fontSize: 9,
  color: '#555',
  fontWeight: '400',
},

floatingInputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingTop: 2,
},

floatingInput: {
  flex: 1,
  fontSize: 15,
  fontFamily: 'iransans',
  color: '#333',
  paddingVertical: 4,
  paddingHorizontal: 4,
  textAlign: 'right',
  minHeight: 28,
},

floatingClearButton: {
  position: 'absolute',
  left: 10,
  top: '50%',
  transform: [{ translateY: -11 }],
  zIndex: 10,
  padding: 4,
},

floatingHint: {
  flexDirection: 'row',
  alignItems: 'center',
  height: 20,
  marginTop: 1,
  paddingTop: 1,
  marginRight: 20,
},

floatingHintText: {
  fontSize: 13,
  fontFamily: 'iransans',
  color: '#888',
  marginLeft: 6,
  flex: 1,
  textAlign: 'right',
},

// styles.js - ADD THESE NEW STYLES at the end of the file

  // ==================== Image Status Overlay ====================
  imageStatusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageRetryButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    padding: 4,
  },

  // ==================== Video Progress Overlay ====================
  videoProgressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  videoProgressCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(169, 43, 49, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  videoProgressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'iransans',
  },

  videoRetryButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    padding: 4,
  },

});