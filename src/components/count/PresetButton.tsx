import { StyleSheet, Text, View } from "react-native";
import React from "react";

type Props = {};

const PresetButton = (props: Props) => {
  return (
    <View>
      <Text style={styles.container}>PresetButton</Text>
    </View>
  );
};

export default PresetButton;

const styles = StyleSheet.create({
  container: { color: "black" },
});
