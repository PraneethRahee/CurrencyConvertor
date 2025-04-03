import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

const CurrencyConverter = () => {
    const [currencies, setCurrencies] = useState([]);
    const [currencyDetails, setCurrencyDetails] = useState({});
    const [exchangeRate, setExchangeRate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [baseCurrency, setBaseCurrency] = useState("USD");
    const [targetCurrency, setTargetCurrency] = useState("INR");
    const [amount, setAmount] = useState("1");
    const [convertedAmount, setConvertedAmount] = useState("0");

    const API_KEY = "cur_live_dwrEebtTDIzXJ5yRSG9ItcKH1NczmGcSwKsFGXho";


    const fetchCurrencies = async () => {
        try {
            const response = await fetch(
                `https://api.currencyapi.com/v3/currencies?apikey=${API_KEY}`
            );
            const data = await response.json();

            if (data?.data) {
                const currencyList = Object.keys(data.data);
                setCurrencies(currencyList);
                const details = {};
                currencyList.forEach((currency) => {
                    details[currency] = data.data[currency].name;
                });
                setCurrencyDetails(details);
            }
        } catch (error) {
            console.error("Error fetching currencies:", error);
        }
    };

    const fetchExchangeRate = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${baseCurrency}`
            );
            const data = await response.json();
            const rate = data?.data?.[targetCurrency]?.value || "N/A";
            setExchangeRate(rate);
            setConvertedAmount(rate ? (parseFloat(amount) * rate).toFixed(2) : "N/A");
        } catch (error) {
            console.error("Error fetching exchange rate:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    useEffect(() => {
        if (baseCurrency && targetCurrency) {
            fetchExchangeRate();
        }
    }, [baseCurrency, targetCurrency, amount]);


    const swapCurrencies = () => {
        setBaseCurrency(targetCurrency);
        setTargetCurrency(baseCurrency);
        setAmount(convertedAmount);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Currency Converter</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="Enter amount"
                    placeholderTextColor="#777"
                />
                <View style={styles.verticalBar} />
                <Picker
                    selectedValue={baseCurrency}
                    onValueChange={(itemValue) => setBaseCurrency(itemValue)}
                    style={styles.picker}
                >
                    {currencies.map((currency) => (
                        <Picker.Item
                            key={currency}
                            label={`${currencyDetails[currency] || currency} (${currency})`}
                            value={currency}
                        />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity onPress={swapCurrencies} style={styles.swapButton}>
                <Text style={styles.swapText}>↓</Text>
                <Text style={styles.swapTextdown}>↓</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
                <Text style={styles.convertedText}>{convertedAmount}</Text>
                <View style={styles.verticalBar} />
                <Picker
                    selectedValue={targetCurrency}
                    onValueChange={(itemValue) => setTargetCurrency(itemValue)}
                    style={styles.picker}
                >
                    {currencies.map((currency) => (
                        <Picker.Item
                            key={currency}
                            label={`${currencyDetails[currency] || currency} (${currency})`}
                            value={currency}
                        />
                    ))}
                </Picker>
            </View>
            {loading && <ActivityIndicator size="large" color="#007AFF" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 10,
        width: "90%",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        flex: 1,
        fontSize: 18,
        padding: 10,
        color: "#333",
    },
    picker: {
        width: "50%",
        color: "#333",
    },
    swapButton: {
        display:"flex",
        flexDirection:"row",
        marginVertical: 10,
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 20,
    },
    swapText: {
        fontSize: 36,
        color: "#ffffff",
    },
    swapTextdown: {
        transform: [{ rotate: '180deg' }],
        fontSize: 36,
        color: "#ffffff",
    },
    convertedText: {
        flex: 1,
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    verticalBar: {
        width: 2,
        height: "100%",
        backgroundColor: "#777",
        marginHorizontal: 5,
    },
});

export default CurrencyConverter;
