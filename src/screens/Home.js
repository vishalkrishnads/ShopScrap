import * as React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StatusBar, SafeAreaView, Animated, Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { openDatabase } from 'react-native-sqlite-storage';
import { changeBarColors } from 'react-native-immersive-bars';
import Icon from 'react-native-vector-icons/EvilIcons';
import styles from '../assets/styles';

const height = Dimensions.get('window').height;

var db = openDatabase({ name: 'shopscrap-history.db' });
const Home = ({ navigation }) => {
    let [placeholder, change_placeholder] = React.useState('');
    const scrollAnim = React.useRef(new Animated.Value(0)).current;

    const string = 'Search for something';
    const index = React.useRef(0);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', (e) => {
            scrollDown();
            return unsubscribe;
        }, [navigation]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        changeBarColors(true, '#50000000', 'transparent');
    });

    React.useEffect(() => {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='history'",
                [],
                function (tx, res) {
                    if (res.rows.length === 0) {
                        txn.executeSql('DROP TABLE IF EXISTS history', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, query VARCHAR(1000))',
                            [],
                            () => { },
                            (error) => console.error(error)
                        );
                    }
                }
            );
        });
    });

    const scrollUp = () => {
        Animated.timing(scrollAnim, {
            toValue: -(height / 2.7),
            duration: 200,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start(() => navigation.navigate('Search'));
    };

    const scrollDown = () => {
        Animated.timing(scrollAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start();
    };

    function tick() {
        change_placeholder(prev => prev + string[index.current]);
        index.current++;
    }
    React.useEffect(() => {
        if (index.current < string.length) {
            let addChar = setInterval(tick, 100);
            return () => clearInterval(addChar);
        }
    }, [placeholder]);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground source={require('../assets/img/Background.jpg')} style={styles.background_image}>
                <StatusBar
                    translucent={true}
                    animated={true}
                    backgroundColor={'transparent'}
                />
                <View style={{ flex: 3 }} />
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 0.5 }} />
                        <View style={{ flex: 10 }}>
                            <Text style={styles.find_100m_text}>Give that scrapper some work</Text>
                        </View>
                        <View style={{ flex: 0.5 }} />
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flex: 0.5 }} />
                        <Animated.View
                            style={[styles.animated_container, { transform: [{ translateY: scrollAnim }] }]}
                        >
                            <TouchableOpacity onPress={scrollUp} style={styles.dummy_search}>
                                <View style={{ flex: 1.5, alignItems: 'flex-end' }}>
                                    <View style={{ flex: 3 }} />
                                    <View style={{ flex: 7, alignItems: 'center' }}>
                                        <Icon name="search" color={'gray'} style={styles.search_icon} />
                                    </View>
                                    <View style={{ flex: 3 }} />
                                </View>
                                <View style={{ flex: 10, alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={styles.placeholder}>{placeholder}</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                        <View style={{ flex: 0.5 }} />
                    </View>
                </View>
                <View style={{ flex: 3 }}>
                    <View style={{ flex: 12, alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Text style={styles.copyright_text}>Made with 🤍 for open source</Text>
                    </View>
                    <View style={{ flex: 2 }} />
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default Home;
