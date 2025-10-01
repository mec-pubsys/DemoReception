import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar,
  SafeAreaView,
  TextInput,
  Pressable,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ScrollView,
} from "react-native";
import styles from "./EventListStyle";
import { Header } from "../../components/basics/header";
import { Button } from "../../components/basics/Button";
import { HiraginoKakuText } from "../../components/StyledText";
import { colors } from "../../styles/color";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { Logout } from "../logout/Logout";
import { format, parse } from "date-fns";
import { CustomCalendar } from "../../components/basics/Calendar";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import {
  fetchInitialEventData,
  fetchSearchEventData,
} from "./EventListService";
import { EventDetailParams } from "../event-detail/EventDetailParams";
import { EventListParams } from "./EventListParams";
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  navigation: NavigationProp<any, any>;
};
type Params = {
  eventListParams: EventListParams;
};
export const EventList = ({ navigation }: Props) => {
  const route = useRoute();
  const { eventListParams } = route.params as Params;
  const [showInputs, setShowInputs] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("最終更新日が新しい");
  const [isFromStartDateCalendarVisible, setFromStartDateCalendarVisible] =
    useState(false);
  const [isToStartDateCalendarVisible, setToStartDateCalendarVisible] =
    useState(false);
  const [isFromEndDateCalendarVisible, setFromEndDateCalendarVisible] =
    useState(false);
  const [isToEndDateCalendarVisible, setToEndDateCalendarVisible] =
    useState(false);
  const [fromStartDate, setFromStartDate] = useState("");
  const [toStartDate, setToStartDate] = useState("");
  const [fromEndDate, setFromEndDate] = useState("");
  const [toEndDate, setToEndDate] = useState("");
  const fromStartDateInputRef = useRef(null);
  const toStartDateInputRef = useRef(null);
  const fromEndDateInputRef = useRef(null);
  const toEndDateInputRef = useRef(null);
  const fromStartDateRef = useRef(null);
  const toStartDateRef = useRef(null);
  const fromEndDateRef = useRef(null);
  const toEndDateRef = useRef(null);
  const { width } = Dimensions.get("window");
  const [x, setX] = useState(0);
  const [focusedInput, setFocusedInput] = useState("");
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const today = new Date();

  // AWS
  const [events, setEvents] = useState<any[]>([]);
  const [message, setMessage] = useState<string>();
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(eventListParams.user, 'EventList', 'useEffect', 'screen open');
  }, []);

  useEffect(() => {
    if (!loading) {
      setPage(0);
    }

    handleRead();
  }, [loading]);

  // Initial State
  const handleRead = async () => {
    try {
      const result = await fetchInitialEventData();
      if (result.data) {
        setLoading(true);
      } else {
        setLoading(false);
        setErrMsg(
          "現在受付できるイベントはありません。\n「LGaP受付　ポータルアプリ」でイベントを作成してください。"
        );
      }
      const message = result.message;
      if (message === "success") {
        setMessage("Obtained Successfully!!");
        setEvents(result.data);
      } else {
        setMessage(message);
      }
    } catch (error) {
      console.error("Error from LoginFun:", error);
      setMessage("An error occurred");
    }
  };

  const toggleInputs = (event: any) => {
    setShowInputs(!showInputs);
    handleClosePopup(event);
  };

  const handleEventTitleChange = (text: string) => {
    setEventName(text);
  };

  const handleVenueTextChange = (text: string) => {
    setVenue(text);
  };

  // Clear Button Action
  const handleClearPress = (event: any) => {
    handleClosePopup(event);
    setEventName("");
    setVenue("");
    setFromStartDate("");
    setToStartDate("");
    setFromEndDate("");
    setToEndDate("");
    setSelectedOption("最終更新日が新しい");
    handleRead();
    setPage(1);
  };

  // Sorting Dropdown
  const handleDropdownPress = async () => {
    setIsDropdownVisible(!isDropdownVisible);
    setFromStartDateCalendarVisible(false);
    setToStartDateCalendarVisible(false);
    setFromEndDateCalendarVisible(false);
    setToEndDateCalendarVisible(false);
  };

  const dropdownData = [
    { label: "最終更新日が新しい", value: "newest" },
    { label: "最終更新日が古い", value: "oldest" },
  ];

  const handleDropdownSelect = async (value: any) => {
    setIsDropdownVisible(false);
    if (selectedOption != value) {
      setSelectedOption(value);
      setEvents(
        events.sort((a, b) => {
          if (selectedOption == "最終更新日が新しい") {
            if (a.modification_timestamp > b.modification_timestamp) {
              return 1;
            } else {
              return -1;
            }
          } else {
            if (a.modification_timestamp < b.modification_timestamp) {
              return 1;
            } else {
              return -1;
            }
          }
        })
      );
    }
  };

  const handleEventDetail = (eventItems: any) => {
    if (isDropdownVisible) {
      setIsDropdownVisible(false);
    } else {
      setIsDropdownVisible(false);

      const startDate = eventItems.start_date
        ? new Date(eventItems.start_date).toISOString().split("T")[0]
        : "";
      const endDate = eventItems.end_date
        ? new Date(eventItems.end_date).toISOString().split("T")[0]
        : "";

      const formatted_startDate = startDate
        ? format(parse(startDate, "yyyy-MM-dd", new Date()), "yyyy/MM/dd")
        : "";
      const formatted_endDate = endDate
        ? format(parse(endDate, "yyyy-MM-dd", new Date()), "yyyy/MM/dd")
        : "";

      const dateRange =
        startDate || endDate
          ? `${formatted_startDate} ~ ${formatted_endDate}`
          : "";

      const eventDetailParams = new EventDetailParams();
      eventDetailParams.user = eventListParams.user;
      eventDetailParams.eventId = eventItems.event_id;
      eventDetailParams.eventName = eventItems.event_name;
      eventDetailParams.eventPeriod = dateRange;

      navigation.navigate("EventDetail", {
        eventDetailParams,
      });
      ActivityLogger.insertInfoLogEntry(eventListParams.user, 'EventList', 'handleEventDetail', 'transition', 'EventDetail', eventDetailParams);
    }
  };

  // Close dropdown when click outside
  const handleClosePopup = (event: any) => {
    if (isDropdownVisible) {
      setIsDropdownVisible(false);
    } else {
      closeCalendar(event);
    }
  };

  const handleFromStartDateCalendarPress = (event: any) => {
    setFromStartDateCalendarVisible(!isFromStartDateCalendarVisible);
    setToStartDateCalendarVisible(false);
    setFromEndDateCalendarVisible(false);
    setToEndDateCalendarVisible(false);
    setIsDropdownVisible(false);
  };

  const handleToStartDateCalendarPress = (event: any) => {
    setToStartDateCalendarVisible(!isToStartDateCalendarVisible);
    setFromStartDateCalendarVisible(false);
    setFromEndDateCalendarVisible(false);
    setToEndDateCalendarVisible(false);
    setIsDropdownVisible(false);
  };

  const handleFromEndDateCalendarPress = (event: any) => {
    setFromEndDateCalendarVisible(!isFromEndDateCalendarVisible);
    setToEndDateCalendarVisible(false);
    setFromStartDateCalendarVisible(false);
    setToStartDateCalendarVisible(false);
    setIsDropdownVisible(false);
    setFocusedInput("fromEndDateInput");
  };

  const handleToEndDateCalendarPress = (event: any) => {
    setFromEndDateCalendarVisible(false);
    setFromStartDateCalendarVisible(false);
    setToStartDateCalendarVisible(false);
    changeXPosition();
    setToEndDateCalendarVisible(!isToEndDateCalendarVisible);
    setIsDropdownVisible(false);
    setFocusedInput("toEndDateInput");
  };

  const changeXPosition = () => {
    (toEndDateInputRef.current as any).measure(
      (
        x: number,
        y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number
      ) => {
        setX(pageX);
      }
    );
  };

  const handleFromStartDateSelect = (date: any) => {
    fromStartDate == date ? setFromStartDate("") : setFromStartDate(date);
    setFromStartDateCalendarVisible(false);
  };

  const handleToStartDateSelect = (date: any) => {
    toStartDate == date ? setToStartDate("") : setToStartDate(date);
    setToStartDateCalendarVisible(false);
  };

  const handleFromEndDateSelect = (date: any) => {
    fromEndDate == date ? setFromEndDate("") : setFromEndDate(date);
    setFromEndDateCalendarVisible(false);
  };

  const handleToEndDateSelect = (date: any) => {
    toEndDate == date ? setToEndDate("") : setToEndDate(date);
    setToEndDateCalendarVisible(false);
  };

  const closeCalendar = (event: any) => {
    if (
      event.nativeEvent.target != fromStartDateInputRef.current &&
      event.nativeEvent.target != fromStartDateRef.current
    ) {
      if (isFromStartDateCalendarVisible) {
        setFromStartDateCalendarVisible(false);
      }
    }
    if (
      event.nativeEvent.target != toStartDateInputRef.current &&
      event.nativeEvent.target != toStartDateRef.current
    ) {
      if (isToStartDateCalendarVisible) {
        setToStartDateCalendarVisible(false);
      }
    }
    if (
      event.nativeEvent.target != fromEndDateInputRef.current &&
      event.nativeEvent.target != fromEndDateRef.current
    ) {
      if (isFromEndDateCalendarVisible) {
        setFromEndDateCalendarVisible(false);
      }
    }
    if (
      event.nativeEvent.target != toEndDateInputRef.current &&
      event.nativeEvent.target != toEndDateRef.current
    ) {
      if (isToEndDateCalendarVisible) {
        setToEndDateCalendarVisible(false);
      }
    }
  };

  // Pagination
  const ITEMS_PER_PAGE = 6;
  let totalCount: string = "";
  let newTotalCount: number = 0;
  let totalPages = 0;

  if (events == undefined) {
    totalCount = "0";
    newTotalCount = 0;
  } else {
    totalCount = events.length.toLocaleString();
    newTotalCount = events.length;
    totalPages = Math.ceil(newTotalCount / ITEMS_PER_PAGE);
  }

  const handleSearchPress = async (event: any) => {
    handleClosePopup(event);
    const searchedResult = await fetchSearchEventData(
      eventName,
      venue,
      fromStartDate,
      toStartDate,
      fromEndDate,
      toEndDate,
      selectedOption
    );
    setEvents(searchedResult.data);
    if (searchedResult.data) {
      setPage(1);
    } else {
      setPage(0);
      setErrMsg(
        "指定された条件に当てはまるイベントはありません。\n 別の条件を指定して再度検索してください。"
      );
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <HiraginoKakuText style={[styles.headerText, styles.eventHeaderText]}>
        イベント名
      </HiraginoKakuText>
      <HiraginoKakuText style={[styles.headerText, styles.venueHeaderText]}>
        会場
      </HiraginoKakuText>
      <HiraginoKakuText style={[styles.headerText, styles.eventDateText]}>
        イベント期間
      </HiraginoKakuText>
    </View>
  );

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const renderTableItem = ({ item }: { item: any }) => (
    <Pressable style={styles.row} onPress={() => handleEventDetail(item)}>
      <HiraginoKakuText
        style={[
          styles.cell,
          styles.eventBodyText,
          styles.eventBodyPressableText,
        ]}
        numberOfLines={1}
        normal
      >
        {item.event_name || "-"}
      </HiraginoKakuText>
      <HiraginoKakuText
        style={[styles.cell, styles.venueBodyText]}
        numberOfLines={1}
        normal
      >
        {item.venue_names || "-"}
      </HiraginoKakuText>

      <HiraginoKakuText style={[styles.cell, styles.eventDateBodyText]} normal>
        {item.start_date &&
          item.end_date &&
          `${formatDate(item.start_date)} ~${formatDate(item.end_date)}`}
        {item.start_date &&
          !item.end_date &&
          `${formatDate(item.start_date)} ~`}
        {item.end_date && !item.start_date && `~${formatDate(item.end_date)}`}
      </HiraginoKakuText>
    </Pressable>
  );

  const getPageData = () => {
    let sortedData = [...events];
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, endIndex);
  };

  // Logout Button action

  const handleLogout = () => {
    openLogoutModal();
  };

  const openLogoutModal = () => {
    setIsDropdownVisible(false);
    setLogoutModalVisible(true);
  };

  const handleLogOutButton = () => {
    navigation.navigate("Login");
    ActivityLogger.insertInfoLogEntry(eventListParams.user, 'EventList', 'handleLogOutButton', 'transition', 'Login', null);
  };

  const handleLogOutCancelButton = () => {
    setLogoutModalVisible(false);
  };

  const handleEventTitleFocus = (event: any) => {
    handleClosePopup(event);
  };

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
  };

  const renderPaginationButtons = () => {
    const maxVisibleButtons = 5;

    const currentPage = page;
    let startPage = 1;
    let endPage = Math.min(totalPages, maxVisibleButtons);

    if (totalPages > maxVisibleButtons) {
      if (currentPage <= Math.floor(maxVisibleButtons / 2) + 1) {
        endPage = maxVisibleButtons;
      } else if (
        currentPage >=
        totalPages - Math.floor(maxVisibleButtons / 2)
      ) {
        startPage = totalPages - maxVisibleButtons + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(maxVisibleButtons / 2);
        endPage = currentPage + Math.floor(maxVisibleButtons / 2);
      }
    }

    const buttons = [];
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Pressable
          key={`button-${i}`}
          onPress={() => handlePageChange(i)}
          style={
            i === currentPage ? styles.activeButton : styles.inactiveButton
          }
        >
          <HiraginoKakuText
            style={i === currentPage ? styles.activeText : styles.inactiveText}
          >
            {i}
          </HiraginoKakuText>
        </Pressable>
      );
    }

    if (totalPages > maxVisibleButtons && endPage < totalPages) {
      buttons.push(
        <Pressable
          key={`ellipsis-button`}
          onPress={() => handlePageChange(endPage + 1)}
        >
          <HiraginoKakuText style={styles.inactiveText}>...</HiraginoKakuText>
        </Pressable>
      );
      buttons.push(
        <Pressable
          key={`last-page-button`}
          onPress={() => handlePageChange(totalPages)}
          style={styles.inactiveButton}
        >
          <HiraginoKakuText style={styles.inactiveText}>
            {totalPages}
          </HiraginoKakuText>
        </Pressable>
      );
    }

    return buttons;
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleLastPage = () => {
    setPage(totalPages);
  };

  const lastPage = Math.ceil(newTotalCount / ITEMS_PER_PAGE);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <Header
        titleName="受付するイベントを選んでください"
        buttonName="ログアウト"
        onPress={handleLogout}
      />
      <TouchableWithoutFeedback onPress={handleClosePopup}>
        <View style={styles.bodyContainer}>
          <View
            style={[styles.firstChildContainer, { gap: showInputs ? 16 : 8 }]}
          >
            <View style={styles.infoContainer}>
              <View style={styles.parentInputContainer}>
                <View style={styles.childInputContainer}>
                  <View style={styles.labelContainer}>
                    <HiraginoKakuText style={styles.labelText}>
                      イベント名
                    </HiraginoKakuText>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="イベントタイトル"
                      placeholderTextColor={colors.placeholderTextColor}
                      onFocus={handleEventTitleFocus}
                      onChangeText={handleEventTitleChange}
                      value={eventName}
                    />
                  </View>
                </View>
              </View>
              <>
                <Pressable
                  style={styles.dropdownContainer}
                  onPress={toggleInputs}
                >
                  <HiraginoKakuText style={styles.dropdownText}>
                    詳細検索
                  </HiraginoKakuText>
                  <Entypo
                    name={showInputs ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={colors.primary}
                    style={styles.iconStyle}
                  />
                </Pressable>
                {showInputs && (
                  <View style={styles.hiddenContainer}>
                    <View style={styles.parentInputContainer}>
                      <View style={styles.childInputContainer}>
                        <View style={styles.labelContainer}>
                          <HiraginoKakuText style={styles.labelText}>
                            会場
                          </HiraginoKakuText>
                        </View>
                        <View style={styles.inputContainer}>
                          <TextInput
                            style={styles.input}
                            placeholder="会場名"
                            placeholderTextColor={colors.placeholderTextColor}
                            onFocus={handleClosePopup}
                            onChangeText={handleVenueTextChange}
                            value={venue}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={[styles.mainDateContainer]}>
                      <View style={styles.parentDateContainer}>
                        <View style={styles.labelContainer}>
                          <HiraginoKakuText style={styles.labelText}>
                            開始日
                          </HiraginoKakuText>
                        </View>
                        <View style={styles.childDateContainer}>
                          <View style={styles.dateInputContainer}>
                            <TextInput
                              ref={fromStartDateInputRef}
                              style={styles.dateInput}
                              placeholder="日付を選択"
                              placeholderTextColor={colors.placeholderTextColor}
                              value={
                                fromStartDate != ""
                                  ? format(
                                    new Date(fromStartDate),
                                    "yyyy/MM/dd"
                                  )
                                  : fromStartDate
                              }
                              onPressIn={handleFromStartDateCalendarPress}
                              onPointerDown={handleFromStartDateCalendarPress}
                              showSoftInputOnFocus={false}
                              onTouchStart={() => Keyboard.dismiss()}
                              inputMode="none"
                            />
                            <Pressable
                              ref={fromStartDateRef}
                              style={styles.calendarIconContainer}
                              onPress={handleFromStartDateCalendarPress}
                            >
                              <MaterialIcons
                                name="calendar-today"
                                size={24}
                                color={colors.activeCarouselColor}
                              />
                            </Pressable>
                            {isFromStartDateCalendarVisible && (
                              <CustomCalendar
                                selectedDate={fromStartDate}
                                onDateSelect={handleFromStartDateSelect}
                                minDate={""}
                              />
                            )}
                          </View>
                          <HiraginoKakuText style={styles.tildeText}>
                            〜
                          </HiraginoKakuText>
                          <View style={styles.secondDateInputContainer}>
                            <TextInput
                              ref={toStartDateInputRef}
                              style={styles.dateInput}
                              placeholder="日付を選択"
                              placeholderTextColor={colors.placeholderTextColor}
                              value={
                                toStartDate != ""
                                  ? format(new Date(toStartDate), "yyyy/MM/dd")
                                  : toStartDate
                              }
                              onPressIn={handleToStartDateCalendarPress}
                              onPointerDown={handleToStartDateCalendarPress}
                              showSoftInputOnFocus={false}
                              onTouchStart={() => Keyboard.dismiss()}
                              inputMode="none"
                            />
                            <Pressable
                              ref={toStartDateRef}
                              onPress={handleToStartDateCalendarPress}
                              style={styles.calendarIconContainer}
                            >
                              <MaterialIcons
                                name="calendar-today"
                                size={24}
                                color={colors.activeCarouselColor}
                              />
                            </Pressable>
                            {isToStartDateCalendarVisible && (
                              <CustomCalendar
                                selectedDate={toStartDate}
                                onDateSelect={handleToStartDateSelect}
                                minDate={fromStartDate ? fromStartDate : ""}
                              />
                            )}
                          </View>
                        </View>
                      </View>
                      <View style={styles.secondParentDateContainer}>
                        <View style={styles.labelContainer}>
                          <HiraginoKakuText style={styles.labelText}>
                            終了日
                          </HiraginoKakuText>
                        </View>
                        <View style={styles.childDateContainer}>
                          <View
                            style={[
                              styles.dateInputContainer,
                              x + wp("30.25%") > width &&
                              focusedInput === "toEndDateInput" && {
                                zIndex: -1,
                              },
                            ]}
                          >
                            <TextInput
                              ref={fromEndDateInputRef}
                              style={styles.dateInput}
                              placeholder="日付を選択"
                              placeholderTextColor={colors.placeholderTextColor}
                              value={
                                fromEndDate != ""
                                  ? format(new Date(fromEndDate), "yyyy/MM/dd")
                                  : fromEndDate
                              }
                              onPressIn={handleFromEndDateCalendarPress}
                              onPointerDown={handleFromEndDateCalendarPress}
                              showSoftInputOnFocus={false}
                              onTouchStart={() => Keyboard.dismiss()}
                              inputMode="none"
                            />
                            <Pressable
                              ref={fromEndDateRef}
                              style={styles.calendarIconContainer}
                              onPress={handleFromEndDateCalendarPress}
                            >
                              <MaterialIcons
                                name="calendar-today"
                                size={24}
                                color={colors.activeCarouselColor}
                              />
                            </Pressable>
                            {isFromEndDateCalendarVisible && (
                              <CustomCalendar
                                selectedDate={fromEndDate}
                                onDateSelect={handleFromEndDateSelect}
                                minDate={""}
                              />
                            )}
                          </View>
                          <HiraginoKakuText style={styles.tildeText}>
                            〜
                          </HiraginoKakuText>
                          <View
                            style={[
                              styles.secondDateInputContainer,
                              x + wp("30.25%") > width && {
                                justifyContent: "flex-end",
                              },
                              x + wp("30.25%") > width &&
                              focusedInput === "fromStartDateInput" && {
                                zIndex: -1,
                              },
                              { transform: "10" },
                            ]}
                          >
                            <TextInput
                              ref={toEndDateInputRef}
                              style={styles.dateInput}
                              placeholder="日付を選択"
                              placeholderTextColor={colors.placeholderTextColor}
                              value={
                                toEndDate != ""
                                  ? format(new Date(toEndDate), "yyyy/MM/dd")
                                  : toEndDate
                              }
                              onPressIn={handleToEndDateCalendarPress}
                              onPointerDown={handleToEndDateCalendarPress}
                              showSoftInputOnFocus={false}
                              onTouchStart={() => Keyboard.dismiss()}
                              inputMode="none"
                            />
                            <Pressable
                              ref={toEndDateRef}
                              style={styles.calendarIconContainer}
                              onPress={handleToEndDateCalendarPress}
                            >
                              <MaterialIcons
                                name="calendar-today"
                                size={24}
                                color={colors.activeCarouselColor}
                              />
                            </Pressable>
                            {isToEndDateCalendarVisible && (
                              <CustomCalendar
                                selectedDate={toEndDate}
                                onDateSelect={handleToEndDateSelect}
                                minDate={fromEndDate ? fromEndDate : ""}
                              />
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                text="クリア"
                onPress={handleClearPress}
                style={styles.grayMButton}
                type="ButtonMediumGray"
              />
              <Button
                text="検索"
                onPress={handleSearchPress}
                style={styles.PrimaryMButton}
                type="ButtonMPrimary"
              />
            </View>
          </View>
          <View style={styles.mainPaginationContainer}>
            <View style={styles.parentPaginationContainer}>
              <View style={styles.topPaginationContainer}>
                <View style={styles.countContainer}>
                  <HiraginoKakuText style={styles.paginationCount} normal>
                    {page}-{lastPage} / {totalCount} 件中
                  </HiraginoKakuText>
                </View>
                <Pressable
                  style={styles.sortingContainer}
                  onPress={handleDropdownPress}
                >
                  <MaterialCommunityIcons
                    name="swap-vertical"
                    size={20}
                    color={colors.activeCarouselColor}
                  />
                  <HiraginoKakuText style={styles.paginationCount} normal>
                    {selectedOption}
                  </HiraginoKakuText>
                  <Entypo
                    name="chevron-down"
                    size={20}
                    color={colors.greyTextColor}
                    style={styles.dropdownIconStyle}
                  />
                </Pressable>

                {/* Sorting Dropdown */}
                {isDropdownVisible && (
                  <View style={styles.dropdown}>
                    {dropdownData.map((item) => (
                      <Pressable
                        key={item.value}
                        style={styles.dropdownItem}
                        onPress={() => handleDropdownSelect(item.label)}
                      >
                        <HiraginoKakuText style={styles.paginationCount} normal>
                          {item.label}
                        </HiraginoKakuText>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.tableContainer}>
                {/* Render the header */}
                {renderHeader()}

                {events == undefined || !loading ? (
                  <View style={styles.noDataContainer}>
                    <View style={styles.noDataChildContainer}>
                      <HiraginoKakuText style={styles.noDataText} normal>
                        {errMsg}
                      </HiraginoKakuText>
                    </View>
                  </View>
                ) : (
                  <ScrollView style={styles.tableItemContainer}>
                    <View>
                      {getPageData().map((item, index) => (
                        <View key={index}>{renderTableItem({ item })}</View>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
            {events != undefined && loading && totalPages > 1 && (
              <View style={styles.onChangePageContainer}>
                <View style={styles.previousButtonsContainer}>
                  <Button
                    text=""
                    onPress={handleFirstPage}
                    style={
                      page === 1
                        ? styles.skipBackDisable
                        : styles.skipBackEnable
                    }
                    type={page === 1 ? "ButtonSDisable" : "ButtonSGray"}
                    icon={
                      <Feather
                        name="skip-back"
                        size={20}
                        color={colors.greyTextColor}
                      />
                    }
                    iconPosition="center"
                  />
                  <Button
                    text=""
                    onPress={handlePrevPage}
                    style={
                      page === 1 ? styles.chevronDisable : styles.chevronEnable
                    }
                    type={page === 1 ? "ButtonSDisable" : "ButtonSGray"}
                    icon={
                      <Feather
                        name="chevron-left"
                        size={20}
                        color={colors.greyTextColor}
                      />
                    }
                    iconPosition="center"
                  />
                </View>
                {totalPages > 1 && (
                  <View style={styles.pageNumberContainer}>
                    {renderPaginationButtons()}
                  </View>
                )}

                {totalPages > 1 && (
                  <View style={styles.nextButtonsContainer}>
                    <Button
                      text=""
                      onPress={handleNextPage}
                      style={
                        page === lastPage
                          ? styles.chevronDisable
                          : styles.chevronEnable
                      }
                      type={
                        page === lastPage ? "ButtonSDisable" : "ButtonSGray"
                      }
                      icon={
                        <Feather
                          name="chevron-right"
                          size={20}
                          color={colors.textColor}
                        />
                      }
                      iconPosition="center"
                    />
                    <Button
                      text=""
                      onPress={handleLastPage}
                      style={
                        page === lastPage
                          ? styles.skipForwardDisable
                          : styles.skipForwardEnable
                      }
                      type={
                        page === lastPage ? "ButtonSDisable" : "ButtonSGray"
                      }
                      icon={
                        <Feather
                          name="skip-forward"
                          size={20}
                          color={colors.textColor}
                        />
                      }
                      iconPosition="center"
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>

      {isLogoutModalVisible && (
        <Logout
          onLogOutButtonPress={handleLogOutButton}
          onCancelButtonPress={handleLogOutCancelButton}
        />
      )}
    </SafeAreaView>
  );
};
