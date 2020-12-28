import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, View} from 'react-native';
import {
  Button,
  Divider,
  IconButton,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';

const Settings = () => {
  const [edit, setEdit] = useState(true);
  const [value, setValue] = useState('');
  const {getItem, setItem} = useAsyncStorage('@site_key');

  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };

  const writeItemToStorage = async (newValue) => {
    await setItem(newValue);
    setValue(newValue);
  };

  useEffect(() => {
    readItemFromStorage();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
        keyboardShouldPersistTaps="handled">
        <View
          style={{
            flex: 1,
            padding: 15,
          }}>
          <View>
            <View
              style={{
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text>Dark Theme</Text>
              <Switch disabled={true} value={true} />
            </View>
            <Divider />
            <View
              style={{
                padding: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                selectionColor="#808080"
                mode="outlined"
                style={{flex: 1}}
                label="Song downloading site"
                value={value}
                placeholder="Song downloading site (with Uri Parameters)"
                disabled={edit}
                onChangeText={(text) => {
                  setValue(text);
                }}
              />
              {edit ? (
                <IconButton
                  icon="pencil"
                  onPress={() => {
                    setEdit(false);
                  }}
                />
              ) : (
                <Button
                  mode="contained"
                  style={{marginLeft: 15}}
                  onPress={() => {
                    if (value) {
                      if (value != readItemFromStorage())
                        writeItemToStorage(
                          value.startsWith('http')
                            ? '' + value.toLowerCase()
                            : 'https://' + value.toLowerCase(),
                        );
                      setEdit(true);
                    } else {
                      Alert.alert(
                        'Invalid URL',
                        'Make sure the entered URL is correct',
                        [{text: 'OK', onPress: () => {}}],
                        {cancelable: true},
                      );
                    }
                  }}>
                  Save
                </Button>
              )}
            </View>
            {edit ? null : (
              <Button
                style={{marginHorizontal: 15, marginBottom: 15}}
                labelStyle={{color: 'white'}}
                mode="outlined"
                onPress={() => {
                  if (value != readItemFromStorage()) readItemFromStorage();
                  setEdit(true);
                }}>
                Cancel
              </Button>
            )}
            {value != 'https://musicpleer24.com/#!' ? (
              <Button
                style={{marginHorizontal: 15, marginBottom: 15}}
                labelStyle={{color: 'white'}}
                mode="outlined"
                onPress={() => {
                  writeItemToStorage('https://musicpleer24.com/#!');
                }}>
                Reset
              </Button>
            ) : null}
            <Divider />
          </View>
        </View>
        <View style={{padding: 15}}>
          <Text style={{textAlign: 'center', color: '#808080'}}>MovieOps</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
