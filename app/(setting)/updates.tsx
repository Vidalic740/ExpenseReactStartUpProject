import {View, StyleSheet, Text} from 'react-native'

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
        backgroundColor: '#ffefff',
        padding: 16,
    }
});