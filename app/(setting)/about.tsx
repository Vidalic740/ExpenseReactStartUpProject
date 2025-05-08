import {View, Text, StyleSheet} from 'react-native'

export default function AboutScreen(){
    return(
        <View style={styles.main}>
            <Text>About</Text>
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