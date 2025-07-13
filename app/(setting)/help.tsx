import{ View, StyleSheet, Text} from 'react-native'

export default function HelpScreen(){
    return(
        <View style={styles.main}>
            <Text>Help</Text>
        </View>
    );
}

const styles =StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor: '#fdfdfd',
        padding: 20,
    },
});