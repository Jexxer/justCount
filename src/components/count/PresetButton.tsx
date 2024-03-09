import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { editPreset, incrementCounter } from "@/src/redux/counterSlice";
import useKeyboardVisible from "../hooks/useKeyboardVisible";


type PresetButtonProps = {
  number: number;
  index: number;
  setModalVisible: Function,
  setTargetIndex: Function
}

export default function PresetButton(props: PresetButtonProps) {
  const { number, index, setModalVisible, setTargetIndex } = props;
  const isKeyboardVisible = useKeyboardVisible();
  const dispatch = useAppDispatch();
  const addButtonStyles = StyleSheet.create({
    button: {
      backgroundColor: "white",
      borderRadius: 10,
      overflow: "hidden",
      flex: 1,
      aspectRatio: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 40,
      color: "grey",
      textAlign: "center",
    },
  });

  const handlePress = () => {
    if (number === 0) {
      setTargetIndex(index);
      setModalVisible(true);
    } else dispatch(incrementCounter(number))
  };
  return (
    <>
      <Pressable
        style={addButtonStyles.button}
        onPress={handlePress}
        disabled={isKeyboardVisible}
        onLongPress={() => {
          setTargetIndex(index);
          setModalVisible(true);
        }}
      >
        {number ? (
          <Text style={addButtonStyles.text}>{number}</Text>
        ) : (
          <FontAwesome name="plus" size={35} color="grey" />
        )}
      </Pressable>
    </>
  );
};
;


const styles = StyleSheet.create({
  container: { color: "black" },
});
