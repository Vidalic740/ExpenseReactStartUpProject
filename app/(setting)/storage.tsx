import { View, StyleSheet, Text} from 'react-native'

export default function StorageScreen(){
    return(
        <View style={styles.main}>
            <Text>Storage and data</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor: '#ffefff',
        padding: 16,
    }
});