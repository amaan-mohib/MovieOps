import React, {useState} from 'react';
import {
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
  Caption,
  Divider,
  List,
  Paragraph,
  Searchbar,
  Surface,
  Text,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import Img from './assets/undraw_web_search_eetr.svg';
import styles from './CustomStyles';

const API = 'https://www.omdbapi.com/?s=';
const API_ImDb = 'https://www.omdbapi.com/?i=';
const KEY = 'f365ed0';

const MoviesRoute = ({route, navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState({
    Genre: 'a',
    Ratings: [{}, {Value: '1'}],
    Response: 'False',
  });
  const [imdbID, setIID] = useState('');
  const [strAvail, setStreamAvail] = useState([]);
  const [show, setShow] = useState(false);
  const platforms = {
    netflix: {name: 'netflix', img: require('./assets/netflix.png')},
    amazonprimevideo: {
      name: 'amazonprimevideo',
      img: require('./assets/prime.png'),
    },
    hotstar: {name: 'hotstar', img: require('./assets/hs.png')},
    youtube: {name: 'youtube', img: require('./assets/youtube_40x40.png')},
  };
  const platforms2 = {
    voot: {name: 'Voot'},
    zee5: {name: 'Zee5'},
    sonyliv: {name: 'SonyLiv'},
    altbalaji: {name: 'AltBalaji'},
  };

  const LogoText = (props) => {
    return (
      <Paragraph
        style={{
          color: 'black',
          fontWeight: 'bold',
        }}>{`${props.name}`}</Paragraph>
    );
  };
  // useEffect(() => {
  //   console.log('sab taraf chal raha hai');
  // }, []);

  const searchFilm = (query) => {
    fetch(`${API}${query}&apikey=${KEY}`)
      .then((res) => res.json())
      .then((sResults) => {
        if (sResults.Response === 'True') {
          setResults(sResults.Search.splice(0, 5));
        }
      });
  };
  const titleDetails = (query) => {
    fetch(`${API_ImDb}${query}&apikey=${KEY}`)
      .then((res) => res.json())
      .then((sResults) => {
        if (sResults.Response === 'True') {
          console.log(sResults);
          setTitle(sResults);
        }
      });
  };
  const rt = (rating) => {
    rating = parseInt(rating, 10);
    if (rating < 60) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Rotten_Tomatoes_rotten.svg/200px-Rotten_Tomatoes_rotten.svg.png';
    } else if (rating >= 60 && rating < 70) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Rotten_Tomatoes.svg/200px-Rotten_Tomatoes.svg.png';
    } else if (rating >= 70) {
      return 'https://upload.wikimedia.org/wikipedia/en/thumb/b/b2/Certified_Fresh_2018.svg/240px-Certified_Fresh_2018.svg.png';
    }
  };
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    console.log(query);
    if (query && query.length >= 3) {
      searchFilm(query);

      setShow(true);
      console.log(results);
    }
  };

  const shareLink = async (name) => {
    await Share.share(
      {
        url: `https://www.imdb.com/title/${imdbID}/`,
        message: `${name}\nhttps://www.imdb.com/title/${imdbID}/`,
        title: `${name}`,
      },
      {dialogTitle: `${name}`},
    ).catch((err) => console.error(err));
  };

  function timeConvert(min) {
    let type = min.Type;
    if (type !== 'series') {
      min = min.Runtime;
      min = parseInt(min, 10);
      const hrs = Math.floor(min / 60);
      const mins = min % 60;
      return `${hrs}h ${mins}m`;
    } else return `${min.totalSeasons} season(s)`;
  }

  const stream = (id) => {
    fetch(`https://ott-details.p.rapidapi.com/gettitleDetails?imdbid=${id}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'e62c33e7dfmsh5c652d76c8fb5f9p13cb19jsn6b73aa75413c',
        'x-rapidapi-host': 'ott-details.p.rapidapi.com',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((avail) => {
        console.log(avail.streamingAvailability.country.IN);
        setStreamAvail(avail.streamingAvailability.country.IN);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const SearchList = (
    <Surface style={styles.list}>
      <List.Section>
        {results.map((result) => {
          return (
            <TouchableRipple
              key={`${result.imdbID}`}
              onPress={() => {
                Keyboard.dismiss();
                setSearchQuery(result.Title);
                setIID(result.imdbID);
                titleDetails(result.imdbID);
                setTimeout(() => {
                  stream(result.imdbID);
                }, 100);

                setShow(false);
              }}>
              <List.Item
                key={`${result.imdbID}`}
                title={`${result.Title} (${result.Year})`}
              />
            </TouchableRipple>
          );
        })}
      </List.Section>
    </Surface>
  );
  const titleLink = (link) => {
    Linking.openURL(link).catch((err) => console.error(err));
  };
  const Available = (
    <View style={{padding: 15}}>
      <View style={styles.stream}>
        {strAvail ? (
          strAvail.map((plt, i) => {
            let link = plt.url;
            plt = plt.platform;
            console.log(plt);
            return Object.keys(platforms).includes(plt) ? (
              <TouchableRipple
                key={i}
                style={styles.streamBut}
                rippleColor="rgba(0, 0, 0, .32)"
                onPress={() => {
                  titleLink(link);
                }}>
                <Image
                  accessibilityLabel={platforms[plt].name}
                  width={40}
                  source={platforms[plt].img}
                />
              </TouchableRipple>
            ) : null || Object.keys(platforms2).includes(plt) ? (
              <Button
                key={i}
                uppercase={false}
                style={{
                  borderRadius: 5,
                  backgroundColor: '#ebe9e6',
                }}
                onPress={() => {
                  titleLink(link);
                }}>
                <LogoText key={i} name={platforms2[plt].name} />
              </Button>
            ) : null;
          })
        ) : (
          <Paragraph>Not available in India for streaming 😢</Paragraph>
        )}
      </View>
    </View>
  );
  const TitleCard = (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View style={styles.top}>
        <Surface style={{borderRadius: 4, elevation: 4}}>
          <View style={styles.card}>
            <View style={{flexDirection: 'row'}}>
              <ImageBackground
                blurRadius={8}
                source={{
                  uri: `${title.Poster}`,
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTopLeftRadius: 4,
                  overflow: 'hidden',
                }}>
                <Image
                  style={styles.img}
                  source={{
                    uri: `${title.Poster}`,
                  }}
                />
              </ImageBackground>
              <View style={styles.cardContent}>
                <Title
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 10,
                  }}>{`${title.Title}`}</Title>
                <Paragraph>
                  {`${title.Year} • ${title.Genre.replace(
                    /, /g,
                    '/',
                  )} • ${timeConvert(title)} • `}
                  <Caption>{`${title.Rated}`}</Caption>
                </Paragraph>

                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Button
                    style={{marginTop: 20}}
                    labelStyle={{color: 'white'}}
                    icon="share-variant"
                    mode="outlined"
                    onPress={() => {
                      shareLink(title.Title);
                    }}>
                    Share
                  </Button>
                </View>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                  <Button
                    style={{marginTop: 10}}
                    labelStyle={{color: 'white'}}
                    icon="instagram"
                    mode="outlined"
                    onPress={() => {
                      navigation.navigate('Story', {
                        img: title.Poster,
                        title: title.Title,
                        artist: '',
                        link: `https://www.imdb.com/title/${imdbID}/`,
                      });
                    }}>
                    Stories
                  </Button>
                </View>
              </View>
            </View>
            <Divider />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.rating}>
                <Paragraph>{`${title.imdbRating}/10`}</Paragraph>
                <Image
                  style={{
                    width: 32,
                    height: 32,
                    resizeMode: 'contain',
                    margin: 5,
                    backgroundColor: '#f6c701',
                    borderRadius: 8,
                  }}
                  source={{
                    uri:
                      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/200px-IMDB_Logo_2016.svg.png',
                  }}
                />
              </View>

              {title.Ratings[1] ? (
                <>
                  <View style={styles.border} />
                  <View style={styles.rating}>
                    <Paragraph>{`${title.Ratings[1].Value}`}</Paragraph>
                    <Image
                      style={{
                        width: 32,
                        height: 32,
                        resizeMode: 'contain',
                        margin: 5,
                      }}
                      source={{
                        uri: `${rt(title.Ratings[1].Value)}`,
                      }}
                    />
                  </View>
                </>
              ) : null}
            </View>
            <Divider />
            {Available}
            <Divider />
            <View style={{padding: 15}}>
              <Paragraph
                style={{marginBottom: 10}}>{`${title.Plot}`}</Paragraph>
              <Paragraph>
                <Text style={{fontWeight: 'bold'}}>Released: </Text>
                {`${title.Released}`}
              </Paragraph>
              <Paragraph>
                <Text style={{fontWeight: 'bold'}}>Director: </Text>
                {`${title.Director}`}
              </Paragraph>
              <Paragraph>
                <Text style={{fontWeight: 'bold'}}>Cast: </Text>
                {`${title.Actors}`}
              </Paragraph>
              <Paragraph>
                <Text style={{fontWeight: 'bold'}}>Awards: </Text>
                {`${title.Awards}`}
              </Paragraph>
            </View>
          </View>
        </Surface>
      </View>
    </ScrollView>
  );

  const Landing = (
    <View
      style={{
        flex: 1,
        marginVertical: '50%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Img width={'50%'} height={200} />
      <Title>Search for movies to get OTT details</Title>
    </View>
  );

  return (
    <SafeAreaView>
      <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="handled">
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
        <View>
          {title.Response === 'True' ? TitleCard : show ? null : Landing}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoviesRoute;
