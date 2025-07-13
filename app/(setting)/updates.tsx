import { StyleSheet, Text, View } from 'react-native';

export default function UpdateScreen(){
    return(
        <View style={styles.main}>
            <Text>App updates</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor: '#fdfdfd',
        padding: 16,
    }
});