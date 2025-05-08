import {View, StyleSheet, Text} from 'react-native'

export default function NotificationScreen(){
    return(
        <View style={styles.main}>
            <Text>Notifications</Text>
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