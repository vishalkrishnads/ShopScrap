import { StyleSheet, Dimensions } from 'react-native'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export default StyleSheet.create({

    //Home screen start
    background_image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    animated_container: {
        flex: 10,
        height: height / 14
    },
    dummy_search: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 50,
        flexDirection: 'row'
    },
    find_100m_text: {
        fontSize: 20,
        alignSelf: 'flex-start',
        margin: 10
    },
    search_icon: {
        fontSize: height / 24
    },
    placeholder: {
        fontSize: 15,
        color: 'gray'
    },
    copyright_text:{
        color: '#f2f2f2',
        fontSize: 12
    },
    privacy_terms_container:{
        flex: 10, 
        backgroundColor: 'white',
        width: width/1.1,
        borderRadius: 25,
    },
    privacy_terms_heading:{
        fontWeight: 'bold',
        fontSize: height/35
    },
    //Home screen ends

    //Search screen header starts
    header_back_button: {
        flex: 1,
        margin: 20,
        alignItems: 'center',
        height: 25
    },
    search_root: {
        flex: 1,
    },
    app_name: {
        fontWeight: 'bold',
        color: 'gray',
        fontSize: 25
    },
    search_field_root: {
        marginTop: 15,
        flex: 10,
        height: height / 15,
        borderWidth: 2,
        borderRadius: 100,
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    //search screen header end
    //search results start
    search_result_root: {
        margin: 10,
        marginBottom: 0,
        flex: 1,
        borderRadius: 50,
        borderWidth: 2,
        height: height / 4,
        flexDirection: 'row',
        borderColor: "#f2f2f2"
    },
    search_image: {
        flex: 3,
        height: '100%',
        width: '100%',
    },
    search_result_title: {
        fontSize: width / 25,
    },
    search_result_price: {
        fontSize: width / 18,
        fontWeight: 'bold'
    },
    seller_icon: {
        flex: 1,
        height: height / 30,
        width: width,
        resizeMode: 'contain'
    },
    search_results: {
        flex: 10,
        height: height - 1
    },
    search_results_button: {
        width: width / 4.5,
        height: height / 25,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: height / 40
    },
    filter_button: {
        height: 75,
        width: 75,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        margin: width / 15
    },
    filter_button_demo:{
        height: 55,
        width: 55,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reminder:{
        height: 180, 
        width: 300, 
        marginRight: 10
    },
    center: {
        width: '100%',
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    behind: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },
    //search results end
    //filter start
    modal: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    filter_prompt: {
        backgroundColor: 'white',
        height: height / 2.5,
        width: width / 1.2,
        borderRadius: 50
    },
    filter_heading: {
        fontSize: width / 15,
        marginTop: height / 30
    },
    filter_type_heading: {
        fontSize: width / 22
    },
    filter_buttons: {
        marginRight: width / 8,
        fontWeight: 'bold',
        fontSize: width / 25
    },
    //filter end

    //history start
    history_container: {
        flexDirection: 'row',
        marginLeft: width/20,
    },
    history_root: {
        flexDirection: 'row',
        height: height / 12
    },
    history_text:{
        fontSize: height/45
    },
    history_icon:{
        fontSize: height/25
    },
    history_animation_container:{
        flex: 1,
        alignItems: 'center', 
        margin: width/20 
    }
})