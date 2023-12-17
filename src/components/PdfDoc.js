import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


function MyDocument({data}) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.text}>{data}</Text>
            </View>
            </Page>
        </Document>
    );
}

const styles = StyleSheet.create({
    page: {
      flexDirection: 'row',
      backgroundColor: '#fff',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    text: {
    }
  });

export default MyDocument
