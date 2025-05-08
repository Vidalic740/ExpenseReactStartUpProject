import{View, StyleSheet, Text} from 'react-native'

export default function InviteScreen(){
    return(
        <View style={styles.main}>
            <Text>Invite a friend</Text>
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