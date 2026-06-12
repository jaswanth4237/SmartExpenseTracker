import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';

const InputField = ({ label, value, onChange, confidence, testID }) => {
    const isLow = confidence === 'low';
    const finalTestID = isLow ? `${testID}-low-confidence` : testID;

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, isLow && styles.lowConfidence]}
                value={value.toString()}
                onChangeText={onChange}
                data-testid={finalTestID} // For automation
                testID={finalTestID} // Standard RN testID
            />
        </View>
    );
};

export default function ExpenseForm({ data, onSubmit }) {
    const [formData, setFormData] = useState(data);

    const handleSubmit = () => {
        onSubmit(formData);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Review Expense</Text>

            <InputField
                label="Merchant"
                value={formData.merchant}
                onChange={(text) => setFormData({ ...formData, merchant: text })}
                confidence={data.confidence.merchant}
                testID="merchant-input"
            />

            <InputField
                label="Date (YYYY-MM-DD)"
                value={formData.purchase_date}
                onChange={(text) => setFormData({ ...formData, purchase_date: text })}
                confidence={data.confidence.purchase_date}
                testID="date-input"
            />

            <InputField
                label="Total"
                value={formData.total}
                onChange={(text) => setFormData({ ...formData, total: parseFloat(text) || 0 })}
                confidence={data.confidence.total}
                testID="total-input"
            />

            <InputField
                label="Tax"
                value={formData.tax}
                onChange={(text) => setFormData({ ...formData, tax: parseFloat(text) || 0 })}
                confidence={data.confidence.tax}
                testID="tax-input"
            />

            <Text style={styles.subtitle}>Line Items</Text>
            {formData.line_items.map((item, index) => (
                <View
                    key={index}
                    style={styles.lineItem}
                    data-testid={`line-item-${index}`}
                    testID={`line-item-${index}`}
                >
                    <Text>{item.description}</Text>
                    <Text>${item.price.toFixed(2)}</Text>
                </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save Expense</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#1a1a1a' },
    subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    inputContainer: { marginBottom: 15 },
    label: { fontSize: 14, color: '#666', marginBottom: 5 },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16
    },
    lowConfidence: {
        borderColor: '#ffbf00', // Amber
        borderWidth: 2
    },
    lineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 50
    },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
