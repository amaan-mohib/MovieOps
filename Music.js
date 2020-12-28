import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  Linking,
  SafeAreaView,
  ScrollView,
  Share,
  View,
} from 'react-native';
import {
  Button,
  Divider,
  IconButton,
  List,
  Paragraph,
  Searchbar,
  Surface,
  Title,
  ToggleButton,
  TouchableRipple,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Img from './assets/undraw_compose_music_ovo2.svg';
import styles from './CustomStyles';

export default function MusicRoute({route, navigation}) {
  const client_id = 'f9828cdd744045a2959b1625e1210f27';
  const client_secret = '96583cfbe8a04316a63c24498d3677c2';
  const base64Encoded =
    'Zjk4MjhjZGQ3NDQwNDVhMjk1OWIxNjI1ZTEyMTBmMjc6OTY1ODNjZmJlOGEwNDMxNmE2M2MyNDQ5OGQzNjc3YzI=';
  const YT_API = 'AIzaSyAITKUA65RKZW07tQSnH0jNbHinRDP-mhU';
  const initDetails = {
    album: {
      images: [
        {
          url:
            'https://i.scdn.co/image/ab67616d00004851b32b86b8e59732e65a68fbaa',
        },
      ],
      name: '',
    },
    id: '',
    name: '',
    artists: [{name: ''}],
    release_date: '20202',
    images: [
      {
        url: 'https://i.scdn.co/image/ab67616d00004851b32b86b8e59732e65a68fbaa',
      },
    ],
    external_urls: {spotify: ''},
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [access_token, setToken] = useState('');
  const [type, setType] = useState('track');
  const [results, setResults] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [songDetails, setDetails] = useState(initDetails);
  const [ytItems, setItems] = useState([]);
  const [show, setShow] = useState(false);
  const [searched, setSearched] = useState(false);
  const [value, setValue] = useState('');
  const {getItem, setItem} = useAsyncStorage('@site_key');

  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };

  useEffect(() => {
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
        console.log(token);
      })
      .catch((err) => console.error(err));
  }, []);

  useFocusEffect(
    useCallback(() => {
      readItemFromStorage();
    }, []),
  );

  const searchMusic = (query) => {
    fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=${type}&market=IN&limit=5&offset=0`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      },
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        let name = type + 's';
        //console.log(res[name].items);
        setResults(res[name].items);
      });
  };

  const searchTracks = (id) => {
    fetch(`https://api.spotify.com/v1/albums/${id}/tracks?market=IN`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + access_token,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        setTracks(res.items);
        //console.log(res.items);
      });
  };

  const searchYt = (query, videoType) => {
    videoType = type === 'album' ? 'playlist' : 'video';
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

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    console.log(query);
    if (query && query.length >= 3) {
      searchMusic(query);
      setShow(true);
      console.log(results);
    }
  };

  const SearchList = (
    <Surface style={styles.list}>
      <List.Section>
        {results.map((result) => {
          return (
            <TouchableRipple
              key={`${result.id}`}
              rippleColor="rgba(0, 0, 0, .32)"
              onPress={() => {
                Keyboard.dismiss();
                setSearchQuery(result.name);
                setDetails(result);
                console.log(result);
                setShow(false);
                setSearched(true);
                searchYt(`${result.name} ${result.artists[0].name}`);
                if (type === 'album') searchTracks(result.id);
              }}>
              <List.Item
                key={`${result.id}`}
                title={`${result.name}`}
                description={`${result.artists[0].name}`}
                left={(props) => (
                  <View>
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
            </TouchableRipple>
          );
        })}
      </List.Section>
    </Surface>
  );

  const YtList = () => {
    const [expanded, setExpanded] = useState(false);
    const _handlePress = () => {
      setExpanded(!expanded);
    };
    return (
      <View>
        <View style={styles.ytBanner}>
          <List.Accordion
            style={{paddingVertical: 15}}
            titleStyle={{color: 'white'}}
            title={`Youtube / YT Music ${
              type === 'album' ? ' (Not reliable for albums)' : ''
            }`}
            expanded={expanded}
            onPress={_handlePress}>
            {ytItems.map((item) => {
              return (
                <View key={item.etag}>
                  <Divider style={{backgroundColor: '#808080'}} />
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
                        shareLink(`${baseLink}${id}`, item.snippet.title);
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
                  </View>
                </View>
              );
            })}
          </List.Accordion>
        </View>
      </View>
    );
  };

  const Download = (
    <View style={styles.download}>
      <TouchableRipple
        rippleColor="rgba(0, 0, 0, .32)"
        onPress={() => {
          let url = `${value ? value : 'https://musicpleer24.com/#!'}${
            songDetails.name
          }+${songDetails.artists[0].name}`;
          Linking.canOpenURL(url)
            .then((res) => {
              if (res) {
                Linking.openURL(url);
              }
            })
            .catch((err) => {
              console.error(err);
              Alert.alert(
                'Invalid URL',
                'Check the downloading site from settings. The site must contain the search parameters and the protocol.',
                [{text: 'OK', onPress: () => {}}],
                {cancelable: true},
              );
            });
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}>
          <Icon name="file-download" size={28} />
          <Title style={{color: 'black', marginLeft: 10}}>Download (MP3)</Title>
        </View>
      </TouchableRipple>
    </View>
  );

  function TracksList(props) {
    const [expanded, setExpanded] = useState(false);
    const _handlePress = () => {
      setExpanded(!expanded);
    };
    function msToTime(duration) {
      let ms = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60);
      return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
    const explicit = <Icon name="explicit" color="#808080" size={15} />;

    return (
      <View style={styles.top}>
        <Surface style={{borderRadius: 4, elevation: 4}}>
          <List.Accordion
            id={props.id}
            titleStyle={{color: 'white'}}
            title="Tracks"
            left={(props) => <List.Icon icon="music-note" />}
            expanded={expanded}
            onPress={_handlePress}>
            {expanded ? <Divider /> : null}
            {tracks.map((track) => {
              return (
                <List.Item
                  key={track.id}
                  title={track.name}
                  description={`${msToTime(track.duration_ms)}`}
                  left={(props) => (
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: 15,
                      }}>
                      <Paragraph>{track.track_number}</Paragraph>
                      {track.explicit ? explicit : null}
                    </View>
                  )}
                />
              );
            })}
          </List.Accordion>
        </Surface>
      </View>
    );
  }

  const Landing = (
    <View
      style={{
        flex: 1,
        marginVertical: '50%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Img width={'50%'} height={200} />
      <Title>{`Search for ${
        type.charAt(0) === 'a' ? 'an' : 'a'
      } ${type} to get platform details`}</Title>
    </View>
  );
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
  const Platforms = (
    <View style={styles.top}>
      <View style={styles.banner}>
        <Image
          source={require('./assets/Spotify_Logo_RGB_White.png')}
          style={{
            width: 100,
            height: 30,
            resizeMode: 'contain',
          }}
        />
        <View style={{flexDirection: 'row'}}>
          <IconButton
            accessibilityLabel="Open in app"
            icon="open-in-app"
            onPress={() => {
              Linking.openURL(songDetails.external_urls.spotify);
            }}
          />
          <IconButton
            icon="share"
            onPress={() => {
              shareLink(songDetails.external_urls.spotify, songDetails.name);
            }}
          />
        </View>
      </View>
      {ytItems.length > 0 ? <YtList /> : null}
      {type === 'track' ? Download : null}
    </View>
  );

  const SongCard = () => {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={styles.top}>
          <Surface style={{borderRadius: 4, elevation: 4}}>
            <View style={styles.card}>
              <View style={{flexDirection: 'row'}}>
                <ImageBackground
                  blurRadius={8}
                  source={{
                    uri: `${
                      type === 'track'
                        ? songDetails.album.images[0].url
                        : songDetails.images[0].url
                    }`,
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottomLeftRadius: 4,
                    borderTopLeftRadius: 4,
                    overflow: 'hidden',
                  }}>
                  <Image
                    style={styles.art}
                    source={{
                      uri: `${
                        type === 'track'
                          ? songDetails.album.images[0].url
                          : songDetails.images[0].url
                      }`,
                    }}
                  />
                </ImageBackground>
                <View style={styles.cardContent}>
                  <Title
                    style={{
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}>{`${songDetails.name}`}</Title>
                  <Paragraph>
                    {`${songDetails.artists[0].name} • ${
                      type === 'track'
                        ? songDetails.album.name
                        : `${songDetails.release_date.slice(0, 4)} • ${
                            songDetails.total_tracks
                          } tracks`
                    }`}
                  </Paragraph>
                  {type === 'track' ? (
                    <Button
                      style={{marginTop: 10}}
                      labelStyle={{color: 'white'}}
                      icon="instagram"
                      mode="outlined"
                      onPress={() => {
                        navigation.navigate('Story', {
                          img: songDetails.album.images[0].url,
                          title: songDetails.name,
                          artist: songDetails.artists[0].name,
                          link: songDetails.external_urls.spotify,
                        });
                      }}>
                      Stories
                    </Button>
                  ) : null}
                </View>
              </View>
            </View>
          </Surface>
        </View>
        {type === 'album' ? <TracksList id={songDetails.id} /> : null}
        {Platforms}
      </ScrollView>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 15,
          }}>
          <ToggleButton.Row
            style={styles.butRow}
            value={type}
            onValueChange={(type) => {
              setSearched(false);
              setResults([]);
              setDetails(initDetails);
              setSearchQuery('');
              setType(type);
            }}>
            <ToggleButton
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                width: '50%',
              }}
              icon="music"
              value="track"
            />
            <ToggleButton
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                width: '50%',
              }}
              icon="album"
              value="album"
            />
          </ToggleButton.Row>
        </View>
        <Searchbar
          style={show ? styles.bar : styles.top}
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          selectionColor="#808080"
          clearButtonMode="while-editing"
          onSubmitEditing={() => setShow(false)}
          onBlur={() => setShow(false)}
        />
        {show ? SearchList : null}
        <View style={{flex: 1}}>{searched ? <SongCard /> : Landing}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
