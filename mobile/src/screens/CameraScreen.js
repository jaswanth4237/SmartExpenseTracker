import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import Svg, { Rect, Defs, Mask } from 'react-native-svg';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Aspect ratio 1.585 (Credit Card)
const ASPECT_RATIO = 1.585;
const GUIDE_WIDTH = width * 0.8;
const GUIDE_HEIGHT = GUIDE_WIDTH * ASPECT_RATIO;

export default function CameraScreen({ onCapture }) {
    if (Platform.OS === 'web') {
        return (
            <View style={styles.center}>
                <Text style={{ fontSize: 20, marginBottom: 20 }}>Web Preview Mode</Text>
                <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                    Camera is best tested on native.{"\n"}
                    Click below to simulate a scan.
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onCapture('mock-uri')}
                >
                    <Text style={styles.buttonText}>Simulate Scan</Text>
                </TouchableOpacity>
            </View>
        );
    }
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const cameraRef = React.useRef(null);

    if (!permission) {
        return (
            <View style={styles.center}>
                <Text>Loading camera permissions...</Text>
            </View>
        );
    }
    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Camera permission is required.</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.buttonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            onCapture(photo.uri);
        }
    };

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} ref={cameraRef}>
                <View style={styles.overlay}>
                    <Svg height="100%" width="100%">
                        <Defs>
                            <Mask id="mask">
                                <Rect height="100%" width="100%" fill="#fff" />
                                <Rect
                                    x={(width - GUIDE_WIDTH) / 2}
                                    y={(height - GUIDE_HEIGHT) / 2}
                                    width={GUIDE_WIDTH}
                                    height={GUIDE_HEIGHT}
                                    fill="#000"
                                />
                            </Mask>
                        </Defs>
                        <Rect height="100%" width="100%" fill="rgba(0,0,0,0.5)" mask="url(#mask)" />
                        <Rect
                            x={(width - GUIDE_WIDTH) / 2}
                            y={(height - GUIDE_HEIGHT) / 2}
                            width={GUIDE_WIDTH}
                            height={GUIDE_HEIGHT}
                            stroke="white"
                            strokeWidth="2"
                            fill="transparent"
                        />
                    </Svg>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                            <View style={styles.captureInner} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'transparent' },
    buttonContainer: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center'
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 4,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    captureInner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    button: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30'
    }
});
