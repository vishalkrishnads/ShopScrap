/* eslint-disable no-shadow */
/* eslint-disable curly */
import * as React from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, StatusBar, TextInput, FlatList, Linking, Modal, Keyboard, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openDatabase } from 'react-native-sqlite-storage';
import FastImage from 'react-native-fast-image';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import RadioButtonRN from 'radio-buttons-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import styles from '../assets/styles';

var db = openDatabase({ name: 'shopscrap-history.db' });
const Search = () => {
    var query = '';
    let [loading, set_loading] = React.useState(false);
    let [filter_prompt, set_prompt] = React.useState(false);
    let [lowtohigh, change_price_filter] = React.useState(true);
    let [relevant, change_relevancy] = React.useState(true);
    let [isfocused, set_focus] = React.useState(false);
    let [reminder, set_reminder] = React.useState(false);
    let [input, set_input] = React.useState('');
    let [display, set_display] = React.useState([]);
    let [history, set_history] = React.useState([]);
    let [message, set_message] = React.useState('Search for anything to see the prices compared');
    const relevancy = [
        { label: 'Most relevant', value: true },
        { label: 'Everything', value: false },
    ];
    const price = [
        { label: 'Low to High', value: true },
        { label: 'High to Low', value: false },
    ];
    const field = React.useRef();
    React.useEffect(() => {
        (async function readkeys() {
            try {
                const value = await AsyncStorage.getItem('@relevancy');
                if (value !== null) {
                    change_relevancy(JSON.parse(value));
                } else {
                    await AsyncStorage.setItem('@relevancy', JSON.stringify(true));
                }
            } catch { }
            try {
                const value = await AsyncStorage.getItem('@price');
                if (value !== null) {
                    change_price_filter(JSON.parse(value));
                } else {
                    await AsyncStorage.setItem('@price', JSON.stringify(true));
                }
            } catch { }
        })();
    }, []);
    const sortByPrice = (price) => {
        return function (a, b) {
            if (a[price] > b[price])
                return lowtohigh ? 1 : -1;
            else if (a[price] < b[price])
                return lowtohigh ? -1 : 1;
            return 0;
        };
    };
    const get_relevant = (array, problem) => {
        var average = 0;
        for (const each of array) {
            average = average + each.price;
        }
        average = average / array.length;
        var relevant = [];
        for (const each of array) {
            if (problem) {
                if (average > 500) {
                    if ((each.price + 250) < (average - 250)) { relevant.push(each); }
                } else {
                    if ((each.price + 50) < (average - 50)) { relevant.push(each); }
                }
            } else {
                if (average > 500) {
                    if ((each.price + 250) > (average - 250)) { relevant.push(each); }
                } else {
                    if ((each.price + 50) > (average - 50)) { relevant.push(each); }
                }
            }
        }
        return relevant;
    };

    const verify = (temp, avg) => {
        var array = temp.slice(0, 4);
        var average = 0;
        for (const each of array) {
            average = average + each.price;
        }
        average = average / array.length;
        if ((avg / 3) > average) {
            return false;
        } else { return true; }

    };

    const sort = async (problem) => {
        var temp = [];
        var results = [];
        var average = 0;
        const value = JSON.parse(await AsyncStorage.getItem('@results'));
        if (value !== null) {
            results = value.results;
            average = value.average;
        }
        for (const each of results) {
            for (const product of relevant ? get_relevant(each.results, problem) : each.results) {
                temp.push(product);
            }
        }
        if (relevant) {
            temp = get_relevant(temp, problem);
            var more_relevant = [];
            var less_relevant = [];
            for (const each of temp) {
                if (each.title.replace(/[^\w]/g, '').toLowerCase().includes(query.replace(/[^\w]/g, '').toLowerCase())) {
                    more_relevant.push(each);
                } else {
                    less_relevant.push(each);
                }
            }
            more_relevant.sort(sortByPrice('price'));
            less_relevant.sort(sortByPrice('price'));
            temp = more_relevant.concat(less_relevant);
        }
        else temp.sort(sortByPrice('price'));
        var id = 1;
        for (const each of temp) {
            each.id = id.toString();
            id++;
        }
        if (problem) { return temp; }
        else {
            if (await verify(temp, average)) { return temp; }
            else { return await sort(true); }
        }
    };
    const search = async () => {
        Keyboard.dismiss();
        set_message('Searching');
        fetch('http://127.0.0.1:3000/?url=' + JSON.stringify({ 'query': query }))
            .then((response) => response.json())
            .then(async (json) => {
                console.log('Fetching from server');
                await AsyncStorage.setItem('@results', JSON.stringify(json));
                set_display(await sort(false));
                db.transaction(function (tx) {
                    tx.executeSql(
                        'SELECT * FROM history where query = ?',
                        [query],
                        (tx, results) => {
                            if (results.rows.length <= 0) {
                                tx.executeSql(
                                    'INSERT INTO history (query) VALUES (?)',
                                    [query],
                                    async () => {
                                        set_message('');
                                        if (await AsyncStorage.getItem('@reminder') !== null) {
                                        } else {
                                            set_reminder(true);
                                            await AsyncStorage.setItem('@reminder', JSON.stringify(true));
                                        }
                                    },
                                    (error) => console.log(error)
                                );
                            } else { set_message(''); }
                        },
                        () => { }
                    );
                });
            });
    };
    const renderHistory = ({ item }) => {
        return (
            <TouchableOpacity style={styles.history_root} onPress={() => {
                query = item.query;
                set_input(item.query);
                search();
                set_focus(false);
            }}>
                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcon name="history" color="black" style={styles.history_icon} />
                </View>
                <View style={{ flex: 8, justifyContent: 'center' }}>
                    <Text style={styles.history_text}>{item.query}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    const renderItem = ({ item }) => {
        return (
            <View style={styles.search_result_root}>
                <View style={{ flex: 0.5 }} />
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 0.5 }} />
                    <FastImage
                        style={styles.search_image}
                        source={{
                            uri: item.image,
                            priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <View style={{ flex: 0.5 }} />
                </View>
                <View style={{ flex: 4, marginLeft: 5 }}>
                    <View style={{ flex: 0.5 }} />
                    <View style={{ flex: 4, justifyContent: 'center' }}>
                        <Text style={styles.search_result_title}>{item.title}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 5 }}>
                                <Text style={[styles.search_result_price, { color: global.accent }]}>AED {item.price}</Text>
                            </View>
                            <View style={{ flex: 3 }}>
                                <TouchableOpacity style={[styles.search_results_button, { backgroundColor: global.accent }]} onPress={() => Linking.openURL(item.url)}>
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Go to shop</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 0.5 }} />
                </View>
                <View style={{ flex: 0.5 }} />
            </View>
        );
    };
    return (
        <SafeAreaView style={styles.search_root}>
            <StatusBar
                animated={true}
                translucent={false}
                backgroundColor="black" />
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={filter_prompt}
            >
                <View style={styles.modal}>
                    <View style={styles.filter_prompt}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 2.5, flexDirection: 'row' }}>
                                <View style={{ flex: 1.5 }} />
                                <Text style={styles.filter_heading}>Filter</Text>
                                <View style={{ flex: 7 }} />
                            </View>
                            <View style={{ flex: 4, justifyContent: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 1.5 }} />
                                    <Text style={styles.filter_type_heading}>Show: </Text>
                                    <View style={{ flex: 7 }} />
                                </View>
                                <View style={{ flex: 4, flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }} />
                                    <View style={{ flex: 4 }}>
                                        <RadioButtonRN
                                            data={relevancy}
                                            selectedBtn={async (data) => {
                                                change_relevancy(data.value);
                                                await AsyncStorage.setItem('@relevancy', JSON.stringify(data.value));
                                            }}
                                            box={false}
                                            activeColor={global.accent}
                                            initial={relevant ? 1 : 2}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} />
                                </View>
                            </View>
                            <View style={{ flex: 4, justifyContent: 'center' }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{ flex: 2 }} />
                                    <Text style={styles.filter_type_heading}>Sort by price: </Text>
                                    <View style={{ flex: 7 }} />
                                </View>
                                <View style={{ flex: 3, flexDirection: 'row' }}>
                                    <View style={{ flex: 1 }} />
                                    <View style={{ flex: 4 }}>
                                        <RadioButtonRN
                                            data={price}
                                            selectedBtn={async (data) => {
                                                change_price_filter(data.value);
                                                await AsyncStorage.setItem('@price', JSON.stringify(data.value));
                                            }}
                                            box={false}
                                            activeColor={global.accent}
                                            initial={lowtohigh ? 1 : 2}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }} />
                                </View>
                            </View>
                            <View style={{ flex: 1.8, alignItems: 'flex-start', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                <TouchableWithoutFeedback onPress={async () => { set_display(await sort(false)); set_prompt(false); }}><Text style={styles.filter_buttons}>OK</Text></TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={{ flex: isfocused ? 1.5 : 1, backgroundColor: global.accent }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 0.5 }} />
                    <TouchableOpacity
                        style={styles.search_field_root}
                        onPress={() => { field.current.focus(); }}
                    >
                        <View style={{ flex: 1.5 }}>
                            <View style={{ flex: 3 }} />
                            <View style={{ flex: 7, alignItems: 'center' }}>
                                <EvilIcon name="search" color={'gray'} style={styles.search_icon} />
                            </View>
                            <View style={{ flex: 3 }} />
                        </View>
                        <View style={{ flex: 10 }}>
                            <TextInput
                                ref={field}
                                placeholder={'Search for anything'}
                                value={input}
                                onChangeText={input => {
                                    set_input(input);
                                    set_history([]);
                                    set_loading(true);
                                    db.transaction((tx) => {
                                        tx.executeSql(
                                            `SELECT * FROM history where query LIKE '%${input}%'`,
                                            [],
                                            async (_tx, results) => {
                                                var temp = [];
                                                for (let i = 0; i < results.rows.length; ++i)
                                                    temp.push(results.rows.item(i));
                                                if (typeof temp !== 'undefined' && temp.length > 0) {
                                                    set_history(temp);
                                                }
                                            },
                                            () => { }
                                        );
                                    });
                                    set_loading(false);
                                }}
                                autoFocus={true}
                                onFocus={() => set_focus(true)}
                                color={global.accent}
                                onBlur={() => set_focus(false)}
                                returnKeyType={'search'}
                                onSubmitEditing={() => { query = input; search(); }}
                            />
                        </View>
                    </TouchableOpacity>
                    <View style={{ flex: 0.5 }} />
                </View>
            </View>
            {isfocused ? <View style={{ flex: 5, backgroundColor: 'white' }}>
                <View style={styles.history_container}>
                    <View style={{ flex: 8 }}>
                        <FlatList
                            style={{ alignSelf: 'stretch' }}
                            data={history}
                            renderItem={renderHistory}
                            keyExtractor={item => item.id.toString()}
                            keyboardShouldPersistTaps="always"
                        />
                    </View>
                    <View style={styles.history_animation_container}>
                        {loading ? <Progress.CircleSnail color={global.accent} /> : null}
                    </View>
                </View>
            </View> : null}
            <View style={{ flex: isfocused ? 7 : 8, backgroundColor: 'white' }}>
                {message ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        {!isfocused ? <Text style={{ color: 'gray' }}>{message}</Text> : null}
                    </View>
                    : isfocused ? null : <View style={styles.center}>
                        <View style={styles.behind}>
                            <FlatList
                                style={{ alignSelf: 'stretch' }}
                                data={display}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                        </View>
                        <TouchableOpacity style={[styles.filter_button, { backgroundColor: global.accent }]} onPress={() => set_prompt(true)}>
                            <FeatherIcon name="filter" color={'white'} size={35} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <Modal
                transparent={true}
                visible={reminder}
                animationType={'fade'}
            >
                <TouchableWithoutFeedback onPress={() => set_reminder(false)} >
                    <View style={[styles.modal, { alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                        <ImageBackground source={require('../assets/img/chatbox.png')} style={styles.reminder}>
                            <View style={{ flex: 8, flexDirection: 'row' }}>
                                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={[styles.filter_button_demo, { backgroundColor: global.accent }]}>
                                        <FeatherIcon name="filter" color={'white'} size={25} />
                                    </View>
                                </View>
                                <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15 }}>If you don't see the expected results for a search query, please try changing the filter to "Everything" to see all the results</Text>
                                </View>
                                <View style={{ flex: 0.3 }} />
                            </View>
                            <View style={{ flex: 2 }} />
                        </ImageBackground>
                        <View style={[styles.filter_button, { backgroundColor: global.accent, marginTop: 5 }]}>
                            <FeatherIcon name="filter" color={'white'} size={35} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

export default Search;
