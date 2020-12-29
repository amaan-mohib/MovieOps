import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
  top: {
    marginHorizontal: 15,
    marginTop: 15,
  },
  bar: {
    marginHorizontal: 15,
    marginTop: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  list: {
    marginHorizontal: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#808080',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  card: {padding: 0},
  cardContent: {
    padding: 20,
    justifyContent: 'center',
    width: 0,
    flexGrow: 1,
  },
  img: {
    width: 169.5,
    height: 250,
    borderTopLeftRadius: 4,
    resizeMode: 'cover',
  },
  art: {
    width: 160,
    height: 160,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    resizeMode: 'cover',
  },
  artShare: {
    width: 250,
    height: 250,
    borderRadius: 6,
    resizeMode: 'cover',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  posterShare: {
    width: 250,
    height: 370,
    resizeMode: 'contain',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  rating: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  border: {
    borderColor: '#808080',
    borderWidth: StyleSheet.hairlineWidth,
    height: '75%',
  },
  stream: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  streamBut: {
    padding: 5,
    borderRadius: 20,
  },
  butRow: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#808080',
    borderRadius: 4,
    marginHorizontal: 15,
  },
  banner: {
    flex: 1,
    borderRadius: 4,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1DB954',
  },
  ytBanner: {
    borderRadius: 4,
    elevation: 4,
    backgroundColor: '#FF0000',
    marginTop: 15,
  },
  download: {
    flex: 1,
    borderRadius: 4,
    elevation: 4,
    backgroundColor: '#e8eaed',
    marginVertical: 15,
  },
});

export default styles;
