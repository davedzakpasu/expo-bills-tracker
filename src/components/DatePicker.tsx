import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

type DatePickerProps = {
  label: string;
  value: string; // yyyy-mm-dd
  onChange: (val: string) => void;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const [show, setShow] = useState(false);
  const date = value ? new Date(value) : new Date();

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios"); // keep open on iOS
    if (selectedDate) {
      const formatted = selectedDate.toISOString().slice(0, 10);
      onChange(formatted);
    }
  };

  if (Platform.OS === "web") {
    return (
      <TextInput
        label={label}
        value={value}
        onChangeText={onChange}
        mode="outlined"
        placeholder="YYYY-MM-DD"
      />
    );
  }

  return (
    <View style={{ marginTop: 8 }}>
      <Text>{label}</Text>
      <Button mode="outlined" onPress={() => setShow(true)}>
        {value || "Select Date"}
      </Button>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};
