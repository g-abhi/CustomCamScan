import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert, ImageBackground} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as Linking from 'expo-linking';
import {Camera} from 'expo-camera';

let camera = Camera;

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const [startCamera, setStartCamera] = React.useState(true)
  const [previewVisible, setPreviewVisible] = React.useState(true)
  const [capturedImage, setCapturedImage] = React.useState(null)
  const [flashMode, setFlashMode] = React.useState('off')

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    var isURL = (data.startsWith("https://") ||
                  data.startsWith("http://") || 
                  data.startsWith("mailto:")  || 
                  data.startsWith("sms:") ||
                  data.startsWith("tel:")) ? true : false
    var okOption = { text: "OK", onPress: () => setScanned(false)}
    var visitOption = {
      text: "GO",
      onPress: () => _visitBarcodeURL(data),
      style: "cancel"
    }
    var listOptions = isURL ? [visitOption, okOption] : [okOption]
    Alert.alert(
      "Barcode Scanned",
      `TYPE:\n ${type}\n\nDATA:\n ${data}`,
      listOptions
    );
  };

  const _visitBarcodeURL = (url) => {
    setScanned(false)
    _handleOpenWithLinking(url)
  }

  const _handleOpenWithLinking = (url) => {
    Linking.openURL(url);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const __startCamera = async () => {
    const {status} = await Camera.requestPermissionsAsync()
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      Alert.alert('Access denied')
    }
  }
  const __takePicture = async () => {
    const photo = await camera.takePictureAsync()
    setPreviewVisible(true)
    setCapturedImage(photo)
  }

  const __handleLongPress = async () => {
    var prevFlashMode = flashMode
    setFlashMode('on')
    __takePicture()
    setFlashMode(prevFlashMode)
  }

  const __savePhoto = async () => {
    MediaLibrary.saveToLibraryAsync(capturedImage.uri)
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }

  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }
  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      
        <View
          style={{
            flex: 1,
            width: '100%'
          }}>

          {previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
          ) : (
            <Camera
              type={cameraType}
              flashMode={flashMode}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{flex: 1}}
              ref={(r) => {
                camera = r
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <TouchableOpacity
                    onPress={__handleFlashMode}
                    style={{
                      borderRadius: 35/2,
                      height: 35,
                      width: 35,
                    }}
                  >
                    {flashMode === 'on' ? <Ionicons name="flash-sharp" size={30} color="yellow" /> : <Ionicons name="flash-off-sharp" size={30} color="black" />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={__switchCamera}
                    style={{
                      marginTop: 20,
                      borderRadius: 35/2,
                      height: 35,
                      width: 35,
                    }}
                  >
                    <Ionicons name="camera-reverse" size={30} color={cameraType === 'front' ? 'white' : 'black'} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={__takePicture}
                      onLongPress={__handleLongPress}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
              </View>
            </Camera>
          )}
        </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

const CameraPreview = ({photo, retakePicture, savePhoto}) => {
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 43,
                height: 43,
                borderRadius: 50,
                padding: 2,
                alignItems: 'center',
              }}
            >
              <MaterialCommunityIcons name="camera-retake-outline" size={36} color="red"/>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                padding: 2,
                alignItems: 'center',
              }}
            >
              <FontAwesome5 name="check-circle" size={36} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}