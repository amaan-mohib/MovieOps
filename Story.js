import CameraRoll from '@react-native-community/cameraroll';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Image, PermissionsAndroid, Platform, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Paragraph, Title} from 'react-native-paper';
import Share from 'react-native-share';
import {captureRef} from 'react-native-view-shot';
import {getColorFromURL} from 'rn-dominant-color';
import styles from './CustomStyles';

export default function Story(props) {
  const [url, setUrl] = useState(
    'http://donapr.com/wp-content/uploads/2016/03/RRUe0Mo.png',
  );
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [link, setLink] = useState('');
  const [topColor, setTopColor] = useState('#000000');
  const [bottomColor, setBottomColor] = useState('#000000');
  const viewRef = useRef();
  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        '',
        'Your permission is required to save images to your device',
        [{text: 'OK', onPress: () => {}}],
        {cancelable: false},
      );
    } catch (err) {
      // handle error as you please
      console.log('err', err);
    }
  };
  // download image
  const downloadImage = async () => {
    try {
      // react-native-view-shot caputures component
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.9,
      });

      if (Platform.OS === 'android') {
        const granted = await getPermissionAndroid();
        if (!granted) {
          return;
        }
      }

      // cameraroll saves image
      const image = CameraRoll.save(uri, {type: 'photo'});
      if (image) {
        Alert.alert(
          'Saved',
          'Image saved successfully.',
          [{text: 'OK', onPress: () => {}}],
          {cancelable: true},
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const shareImage = async () => {
    try {
      // capture component
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });

      // share
      const shareResponse = await Share.open({
        url: uri,
        title: title,
      });
    } catch (error) {
      console.log('error', error);
    }
  };
  const shareStory = async () => {
    try {
      // capture component
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });

      // share
      const shareResponse = await Share.shareSingle({
        method: Share.InstagramStories.SHARE_BACKGROUND_IMAGE,
        backgroundImage: uri,
        social: Share.Social.INSTAGRAM_STORIES,
        backgroundTopColor: topColor,
        backgroundBottomColor: bottomColor,
        attributionURL: link,
      });
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    setUrl(props.route.params.img.replace('SX300.jpg', 'SX600.jpg'));
    setTitle(props.route.params.title);
    setArtist(props.route.params.artist);
    setLink(props.route.params.link);
    console.log(props.route.params.link);
    getColorFromURL(props.route.params.img).then((colors) => {
      setTopColor(colors.secondary);
      setBottomColor(colors.primary);
    });
  }, []);
  return (
    <View style={{flex: 1}}>
      <View collapsable={false} style={{flex: 1}} ref={viewRef}>
        <LinearGradient
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          colors={[topColor, bottomColor, '#000000']}>
          <Image
            style={link.includes('imdb') ? styles.posterShare : styles.artShare}
            source={{uri: url}}
          />
          <Title style={{fontWeight: 'bold'}}>{title}</Title>
          <Paragraph>{artist}</Paragraph>
        </LinearGradient>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          bottom: 0,
          padding: 15,
          position: 'absolute',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, .20)',
          justifyContent: 'space-around',
        }}>
        <Button
          icon="download"
          mode="contained"
          onPress={() => {
            downloadImage();
          }}>
          Save
        </Button>
        <Button
          icon="instagram"
          mode="contained"
          onPress={() => {
            shareStory();
          }}>
          Story
        </Button>
        <Button
          icon="share"
          mode="contained"
          onPress={() => {
            shareImage();
          }}>
          Share
        </Button>
      </View>
    </View>
  );
}
