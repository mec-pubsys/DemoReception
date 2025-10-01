import React from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { StyleSheet, View, Platform } from 'react-native';
import { colors } from '../../styles/color';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface CustomCalendarProps {
  onDateSelect: (date: string) => void;
  selectedDate: string;
  minDate: string;
}

export const CustomCalendar : React.FC<CustomCalendarProps> = ({ onDateSelect, selectedDate, minDate }) => { 
  const today = new Date();

  const handleDayPress = (date: DateData) => {
    onDateSelect(date.dateString);  
  };
  
  LocaleConfig.locales.jp = {
    monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    dayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
    dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
  };
  LocaleConfig.defaultLocale = "jp";

  return (
    <View style={styles.calendarPositionContainer}>
      <Calendar
        current={selectedDate!= null ? selectedDate: today.toDateString()}
        minDate={minDate ? minDate.toString() : ""}
        style={styles.calendarMainContainer}
        theme={{
          backgroundColor: colors.secondary,
          calendarBackground: colors.secondary,
          todayTextColor: colors.calendarBlueColor,
          arrowHeight: 25,
          arrowWidth: 16,
          arrowColor: colors.calendarBlueColor,
          selectedDayBackgroundColor: colors.selectedDayBgColor,
          selectedDayTextColor: colors.calendarBlueColor,
          textMonthFontFamily: "HiraginoKaku_GothicPro_Text",
          textMonthFontSize: 17,
          textDayHeaderFontFamily: "HiraginoKaku_GothicPro_Text",
          textDayHeaderFontWeight: "300",
          textDayHeaderFontSize: 13,
          textDayFontSize: 20,
          textDayFontWeight: "600",
          weekVerticalMargin: 3,
        }}
        onDayPress={handleDayPress}
        markingType={'custom'}
        markedDates={{
          [selectedDate]: {
            selected: true,
            customStyles: { container: { width: 35, height: 35, borderRadius: 20 } },
            ...Platform.select({
              web: {
                customStyles: { container: { width: 40, height: 40, borderRadius: 20 } }
              }
            })
          },
        }}
        monthFormat={"yyyy年 M月"}
        hideExtraDays
      />
    </View>
  );
};

export const styles = StyleSheet.create({
 
  calendarPositionContainer: {
    position: "absolute",
    top: hp("4.7%"),    
  },
  calendarMainContainer: {
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: wp("1.1%"),
    borderRadius: wp("1.1%"),
    width: wp("30.25%"),
    maxWidth: 361,
    ...Platform.select({
      web: {
        boxShadow: `0px 1px 99px 0px rgba(0, 0, 0, 0.3)`,
      }
    }),
    backgroundColor: colors.secondary,  
    paddingBottom: hp("1.2%"),  
  },  
});
 