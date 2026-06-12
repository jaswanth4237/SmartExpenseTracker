import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Alert, Text } from 'react-native';
import { Platform } from 'react-native';
import CameraScreen from './src/screens/CameraScreen';
import ExpenseForm from './src/screens/ExpenseForm';
import { parseReceipt } from './src/utils/parser';

// Use a mock for web
let TextRecognition = null;
// In a real app we might use Platform-specific files (.web.js)
if (Platform.OS !== 'web') {
    try {
        TextRecognition = require('@react-native-ml-kit/text-recognition').default;
    } catch (e) {
        console.warn('ML Kit not found');
    }
}

const BACKEND_URL = 'http://10.246.19.245:8000'; // Updated for device testing

export default function App() {
    const [step, setStep] = useState('camera');
    const [scannedData, setScannedData] = useState(null);

    const processImage = async (imageUri) => {
        try {
            if (Platform.OS === 'web') {
                Alert.alert('Info', 'OCR is only supported on native devices. Using mock data.');
                // Mock data for web testing
                const mockText = "WALMART\nDATE: 06/10/2026\nTOTAL 7.99\nTAX 0.00";
                setScannedData(parseReceipt(mockText));
                setStep('review');
                return;
            }
            // Perform On-Device OCR
            const result = await TextRecognition.recognize(imageUri);

            // Sort blocks by top-to-bottom position
            const sortedBlocks = result.blocks.sort((a, b) => a.frame.top - b.frame.top);
            const rawText = sortedBlocks.map(block => block.text).join('\n');

            // Parse using our heuristic engine
            const parsed = parseReceipt(rawText);
            setScannedData(parsed);
            setStep('review');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to process receipt');
        }
    };

    const saveExpense = async (data) => {
        try {
            const response = await fetch(`${BACKEND_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                Alert.alert('Success', 'Expense saved successfully');
                setStep('camera');
            } else {
                throw new Error('Failed to save to backend');
            }
        } catch (error) {
            Alert.alert('Error', 'Cloud sync failed, but data processed on-device.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ padding: 10, backgroundColor: '#eee' }}>
                <Text style={{ fontWeight: 'bold' }}>Smart Expense Tracker (Web Mode)</Text>
            </View>
            {step === 'camera' ? (
                <CameraScreen onCapture={processImage} />
            ) : (
                <ExpenseForm data={scannedData} onSubmit={saveExpense} />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' }
});
