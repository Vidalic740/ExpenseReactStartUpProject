import {View, Text, StyleSheet} from 'react-native'

export default function AccountScreen(){
    return(
        <View style={styles.main}>
            <Text>Accounts</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor: 'ffefff',
        padding: 16,
    }
})