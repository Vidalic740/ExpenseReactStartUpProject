import { View, StyleSheet, Text} from 'react-native'

export default function LanguageScreen(){
    return(
        <View style={styles.main}>
            <Text>Languages</Text>
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