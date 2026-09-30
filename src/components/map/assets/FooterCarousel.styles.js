// import { StyleSheet } from 'react-native';

// export default StyleSheet.create({
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//     height: 250,
//   },

//   closeButton: {
//     position: 'absolute',
//     top: -10,
//     left: 20,
//     zIndex: 100,
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 24,
//     lineHeight: 30,
//     fontWeight: 'bold',
//   },

//   listContent: {
//     paddingHorizontal: 20, // Creates the peek effect
//     alignItems: 'center', // Ensures cards are vertically centered
//   },
//   cardContainer: {
//     paddingHorizontal: 10, // Space between cards
//     height: '100%',
//     justifyContent: 'center',
//   },
//   workerCard: {
//     width: '100%',
//     height: '90%', // Adjust as needed
//     borderRadius: 12, // Match your card style
//     overflow: 'hidden',
//   },
//   LoadingMoreCard: {
//     height: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     borderRadius: 12,
//   },
//   // ... your existing styles
// });

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 250,
    backgroundColor: '#fffff50',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },

  // Grip styles
  gripContainer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 3,
  },
  grip: {
    width: 10,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 100,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 'bold',
  },

  // Horizontal carousel styles
  listContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 10, // Make space for grip
  },
  cardContainer: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
  },
  workerCard: {
    width: '100%',
    height: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  LoadingMoreCard: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },

  // Expanded view styles
  verticalListContent: {
    paddingHorizontal: 20,
    paddingTop: 50, // Space for grip and close button
    paddingBottom: 30,
  },
  verticalCard: {
    width: '100%',
    marginBottom: 15,
  },
  
  // Expanded state footer
  expandedFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '80%', // Takes most of the screen
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 20,
  },
});