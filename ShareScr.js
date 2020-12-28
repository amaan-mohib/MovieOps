import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-community/clipboard';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Caption,
  Colors,
  Divider,
  IconButton,
  List,
  Snackbar,
  Surface,
  Text,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import Pattern from 'url-knife';

const base64Encoded =
  'Zjk4MjhjZGQ3NDQwNDVhMjk1OWIxNjI1ZTEyMTBmMjc6OTY1ODNjZmJlOGEwNDMxNmE2M2MyNDQ5OGQzNjc3YzI=';
const YT_API = 'AIzaSyAITKUA65RKZW07tQSnH0jNbHinRDP-mhU';
const validURls = [
  'youtu.be',
  'youtube.com',
  'open.spotify.com',
  'music.youtube.com',
];
const ShareScr = (props) => {
  const [results, setResults] = useState([]);
  const [items, setItems] = useState([]);
  const [type, setType] = useState('track');
  const [title, setTitle] = useState('');
  const [access_token, setToken] = useState('');
  const [visible, setVisible] = useState(false);
  const onToggleSnackBar = () => setVisible(true);
  const onDismissSnackBar = () => setVisible(false);
  const [loader, setLoader] = useState(
    <ActivityIndicator animating={true} color={Colors.white} />,
  );
  const [_null, setNull] = useState(null);
  const navigation = useNavigation();
  const [value, setValue] = useState('');
  const {getItem, setItem} = useAsyncStorage('@site_key');

  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };
  // useEffect(() => {

  // }, []);

  useFocusEffect(
    useCallback(() => {
      readItemFromStorage();
      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${base64Encoded}`,
        },
        body: 'grant_type=client_credentials',
      })
        .then((response) => {
          return response.json();
        })
        .then((token) => {
          setToken(token.access_token);
          token = token.access_token;
          console.log(token);
          setTimeout(() => {
            if (props.route.params.url) {
              const parsedUrl = props.route.params.url.match(
                /\bhttps?:\/\/\S+/gi,
              );
              console.log(parsedUrl[0]);
              let parsedParsedUrl = Pattern.UrlArea.parseUrl(parsedUrl[0]);
              //setUrl(parsedParsedUrl);
              console.log(parsedParsedUrl);
              if (validURls.includes(parsedParsedUrl.onlyDomain)) {
                if (parsedParsedUrl.onlyDomain == 'youtu.be')
                  searchVideoTitle(
                    parsedParsedUrl.onlyUri.replace('/', ''),
                    'videos',
                    token,
                  );
                else if (
                  parsedParsedUrl.onlyDomain == 'music.youtube.com' ||
                  'youtube.com'
                ) {
                  if (parsedParsedUrl.onlyParamsJsn.v)
                    searchVideoTitle(parsedParsedUrl.onlyParamsJsn.v, 'videos');
                  else if (parsedParsedUrl.onlyParamsJsn.list) {
                    setType('album');
                    searchVideoTitle(
                      parsedParsedUrl.onlyParamsJsn.list,
                      'playlists',
                      token,
                    );
                  }
                }
                if (parsedParsedUrl.onlyDomain == 'open.spotify.com') {
                  if (parsedParsedUrl.onlyUri.includes('/track')) {
                    searchSpotify(
                      parsedParsedUrl.onlyUri.replace('/track', '/tracks'),
                      token,
                    );
                  }
                  if (parsedParsedUrl.onlyUri.includes('/album')) {
                    setType('album');
                    searchSpotify(
                      parsedParsedUrl.onlyUri.replace('/album', '/albums'),
                      token,
                    );
                  }
                }
              } else {
                setTitle('Invalid URL');
                setResults(null);
                setItems(null);
                setNull(
                  <Text style={{textAlign: 'center'}}>
                    The chosen link is not a song!
                  </Text>,
                );
              }
            }
          }, 100);
        })
        .catch((err) => console.error(err));

      return () => {
        ReceiveSharingIntent.clearReceivedFiles();
        console.log('cleared');
      };
    }, []),
  );

  const searchMusic = (query, type, token) => {
    console.log(query);
    fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=${type}&market=IN&limit=10&offset=0`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        let name = type + 's';
        //console.log(res[name].items);
        if (res) setResults(res[name].items);
      })
      .catch((err) => {
        console.error(err);
        setLoader(
          <Text style={{textAlign: 'center'}}>
            The chosen video is not a song!
          </Text>,
        );
      });
  };
  let chars = [
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '[',
    ']',
    'official',
    'video',
    'youtube',
    'audio',
    '|',
    'lyric',
    'lyrics',
    'music',
    '{',
    '}',
    ',',
    ':',
    '- ',
    '+',
    "'",
  ];
  const searchVideoTitle = (id, searchType, token) => {
    fetch(
      `https://youtube.googleapis.com/youtube/v3/${searchType}?part=snippet&id=${id}&key=${YT_API}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        let title1 = res.items[0].snippet.title;
        setTitle(title1);
        for (let i = 0; i < chars.length; i++)
          title1 = title1.toLowerCase().replace(chars[i], '');
        title1 = title1.trim().replace(/ /g, '%20');
        console.log(title1);
        setItems(null);
        setTimeout(() => {
          searchMusic(
            title1,
            searchType == 'videos' ? 'track' : 'album',
            token,
          );
        }, 1000);
      })
      .catch((err) => console.error(err));
  };

  const searchSpotify = (id, token) => {
    fetch(`https://api.spotify.com/v1${id}?market=IN`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setResults(null);
        setTimeout(() => {
          console.log(res);
          setTitle(`${res.name} - ${res.artists[0].name}`);
          searchYt(`${res.name} ${res.artists[0].name}`, id);
        }, 500);
      })
      .catch((err) => console.error(err));
  };
  const searchYt = (query, videoType) => {
    videoType.includes('/albums') ? 'playlist' : 'video';
    fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${query}&type=${videoType}&regionCode=IN&key=${YT_API}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setItems(res.items);
        console.log(res.items);
      });
  };

  const shareLink = async (link, title) => {
    await Share.share(
      {
        url: `${link}`,
        message: `${title}\n${link}`,
        title: `${title}`,
      },
      {dialogTitle: `${title}`},
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor="#5d4037" barStyle="light-content" />
      <ScrollView>
        <View>
          <Title style={{margin: 15, marginTop: 15}}>
            {`${title} ${type == 'track' ? '' : ' (Album)'}`}
          </Title>
          <Divider style={{margin: 15}} />
          <Caption style={{margin: 15, textAlign: 'center'}}>
            {items ? 'On YouTube' : null}
            {results ? 'On Spotify' : null}
          </Caption>
        </View>
        <Surface style={{borderRadius: 4, margin: 15}}>
          <List.Section>
            {_null ? _null : null}
            {results
              ? results.length < 1
                ? loader
                : results.map((result) => {
                    return (
                      <TouchableRipple
                        key={`${result.id}`}
                        rippleColor="rgba(0, 0, 0, .32)"
                        onPress={() => {}}>
                        <View>
                          <List.Item
                            key={`${result.id}`}
                            title={`${result.name}`}
                            description={`${result.artists[0].name} ${
                              type === 'track' ? `• ${result.album.name}` : ''
                            }`}
                            descriptionNumberOfLines={2}
                            left={(props) => (
                              <View
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Image
                                  style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                  }}
                                  source={{
                                    uri: `${
                                      type === 'track'
                                        ? result.album.images[0].url
                                        : result.images[0].url
                                    }`,
                                  }}
                                />
                              </View>
                            )}
                          />
                          <View
                            style={{
                              flexDirection: 'row-reverse',
                              paddingHorizontal: 15,
                            }}>
                            <IconButton
                              icon="share"
                              onPress={() => {
                                shareLink(
                                  result.external_urls.spotify,
                                  result.name,
                                );
                              }}
                            />
                            <IconButton
                              icon="open-in-app"
                              onPress={() => {
                                Linking.openURL(result.external_urls.spotify);
                              }}
                            />
                            <IconButton
                              icon="download"
                              onPress={() => {
                                Linking.openURL(
                                  `${
                                    value
                                      ? value
                                      : 'https://musicpleer24.com/#!'
                                  }${result.name}+${result.artists[0].name}`,
                                );
                              }}
                            />
                            <IconButton
                              icon="instagram"
                              onPress={() => {
                                navigation.navigate('Story', {
                                  img: result.album.images[0].url,
                                  title: result.name,
                                  artist: result.artists[0].name,
                                  link: result.external_urls.spotify,
                                });
                              }}
                            />
                            <IconButton
                              icon="content-copy"
                              onPress={() => {
                                Clipboard.setString(
                                  result.external_urls.spotify,
                                );
                                onToggleSnackBar();
                              }}
                            />
                          </View>
                          <Divider />
                        </View>
                      </TouchableRipple>
                    );
                  })
              : null}
            {items
              ? items.length < 1
                ? loader
                : items.map((item) => {
                    return (
                      <TouchableRipple
                        key={`${item.etag}`}
                        rippleColor="rgba(0, 0, 0, .32)"
                        onPress={() => {}}>
                        <View>
                          <List.Item
                            title={`${item.snippet.title} • ${item.snippet.channelTitle}`}
                            description={item.snippet.description}
                            descriptionNumberOfLines={2}
                            titleNumberOfLines={2}
                            left={(props) => (
                              <View
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Image
                                  style={{
                                    width: 90,
                                    height: 67.5,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    resizeMode: 'contain',
                                  }}
                                  source={{
                                    uri: `${item.snippet.thumbnails.default.url}`,
                                  }}
                                />
                              </View>
                            )}
                          />
                          <View
                            style={{
                              flexDirection: 'row-reverse',
                              paddingHorizontal: 15,
                            }}>
                            <IconButton
                              icon="share"
                              onPress={() => {
                                let baseLink =
                                  type === 'album'
                                    ? 'https://music.youtube.com/playlist?list='
                                    : 'https://music.youtube.com/watch?v=';
                                let id =
                                  type === 'album'
                                    ? item.id.playlistId
                                    : item.id.videoId;
                                shareLink(
                                  `${baseLink}${id}`,
                                  item.snippet.title,
                                );
                              }}
                            />
                            <IconButton
                              icon="youtube"
                              onPress={() => {
                                let baseLink =
                                  type === 'album'
                                    ? 'https://youtube.com/playlist?list='
                                    : 'https://youtube.com/watch?v=';
                                let id =
                                  type === 'album'
                                    ? item.id.playlistId
                                    : item.id.videoId;
                                Linking.openURL(`${baseLink}${id}`);
                              }}
                            />
                            <IconButton
                              icon="play-circle-outline"
                              onPress={() => {
                                let baseLink =
                                  type === 'album'
                                    ? 'https://music.youtube.com/playlist?list='
                                    : 'https://music.youtube.com/watch?v=';
                                let id =
                                  type === 'album'
                                    ? item.id.playlistId
                                    : item.id.videoId;
                                Linking.openURL(`${baseLink}${id}`);
                              }}
                            />
                            <IconButton
                              icon="download"
                              onPress={() => {
                                let title = item.snippet.title;
                                for (let i = 0; i < chars.length; i++)
                                  title = title
                                    .toLowerCase()
                                    .replace(chars[i], '');
                                title = title.trim().replace(/ /g, '+');
                                Linking.openURL(
                                  `${
                                    value
                                      ? value
                                      : 'https://musicpleer24.com/#!'
                                  }${title}`,
                                );
                              }}
                            />
                          </View>
                          <Divider />
                        </View>
                      </TouchableRipple>
                    );
                  })
              : null}
          </List.Section>
        </Surface>
      </ScrollView>
      <Snackbar visible={visible} onDismiss={onDismissSnackBar} duration={2000}>
        Copied to clipboard
      </Snackbar>
    </SafeAreaView>
  );
};

export default ShareScr;
