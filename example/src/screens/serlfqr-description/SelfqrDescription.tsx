import React, { useEffect, useState, useRef, SetStateAction } from "react";
import {
  StatusBar,
  SafeAreaView,
  View,
  Pressable,
  Image,
  useWindowDimensions,
  FlatList,
  ListRenderItemInfo
} from "react-native";
import styles from "./SelfqrDescriptionStyles";
import { Header } from "../../components/basics/header";
import { Footer } from "../../components/basics/footer";
import { colors } from "../../styles/color";
import { HiraginoKakuText } from "../../components/StyledText";
import { NavigationProp, useRoute } from "@react-navigation/native";
import { SelfqrDescriptionParams } from "./SelfqrDescriptionParams";
import { SelectReceptionMethodParams } from "../select-reception-method/SelectReceptionMethodParams";
import { SelfqrScannerParams } from "../selfqr-scanner/SelfqrScannerParams";
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { ActivityLogger } from "../../log/ActivityLogger";

type Props = {
  navigation: NavigationProp<any, any>;
};

type Params = {
  selfqrDescriptionParams: SelfqrDescriptionParams;
};

const slides = [
  {
    id: "1",
    text: "[自治体アプリ]を起動して、自己QRをタップ",
    image: require("../../assets/images/firstCarousel.png"),
  },
  {
    id: "2",
    text: "受付する人を選んで、自己QRを表示するをタップ",
    image: require("../../assets/images/secondCarousel.png"),
  },
  {
    id: "3",
    text: "自己QRが表示されます。読み取りへ進んでください",
    image: require("../../assets/images/thirdCarousel.png"),
  },
];

const Onboarding = ({
  currentIndex,
  scrollToIndex,
  slides,
}: {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<SetStateAction<number>>;
  scrollToIndex: (index: number) => void;
  slides: any[];
}) => {
  const slidesRef = useRef<FlatList<any> | null>(null);
  const { width } = useWindowDimensions();
  const translationX = useSharedValue(0);

  const Item = ({
    currentIndex,
  }: {
    item: any;
    currentIndex: number;
  }) => {
    const currentText = slides[currentIndex].text;
    const currentImage = slides[currentIndex].image;

    return (
      <View>
        <View style={styles.bodyHeading}>
          <HiraginoKakuText style={styles.bodyHeadingText}>
            {currentText}
          </HiraginoKakuText>
        </View>
        <View style={styles.bodyImageContainer}>
          <Image
            source={currentImage}
            style={[styles.bodyImage, { width, resizeMode: "contain" }]}
          />
        </View>
      </View>
    );
  };

  const _renderItem = (listRenderItemInfo: ListRenderItemInfo<any>) => {
    return <Item item={listRenderItemInfo.item} currentIndex={currentIndex} />;
  };

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      translationX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < 0 && currentIndex < slides.length - 1) {
        runOnJS(scrollToIndex)(currentIndex + 1);
      } else if (event.translationX > 0 && currentIndex > 0) {
        runOnJS(scrollToIndex)(currentIndex - 1);
      }
      translationX.value = withSpring(0);
    });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={swipeGesture}>
        <FlatList
          data={slides}
          renderItem={_renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          scrollEventThrottle={32}
          viewabilityConfig={viewConfig}
          ref={(ref) => {
            slidesRef.current = ref;
          }}
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export const SelfqrDescription = ({ navigation }: Props) => {
  const route = useRoute();
  let { selfqrDescriptionParams } = route.params as Params;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<any> | null>(null);

  useEffect(() => {
    ActivityLogger.insertInfoLogEntry(selfqrDescriptionParams.user, 'SelfqrDescription', 'useEffect', 'screen open');
  }, []);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index: index });
    setCurrentIndex(index);
  };

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    } else if (currentIndex === 0) {
      const selectReceptionMethodParams = new SelectReceptionMethodParams();
      selectReceptionMethodParams.eventId = selfqrDescriptionParams.eventId;
      selectReceptionMethodParams.venueId = selfqrDescriptionParams.venueId;
      selectReceptionMethodParams.user = selfqrDescriptionParams.user;
      selectReceptionMethodParams.receptionTypeCode =
        selfqrDescriptionParams.receptionTypeCode;

      navigation.navigate("SelectReceptionMethod", {
        selectReceptionMethodParams,
      });
    }
  };

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const handleReadButton = () => {
    const selfqrScannerParams = new SelfqrScannerParams();
    selfqrScannerParams.user = selfqrDescriptionParams.user;
    selfqrScannerParams.eventId = selfqrDescriptionParams.eventId;
    selfqrScannerParams.venueId = selfqrDescriptionParams.venueId;
    selfqrScannerParams.receptionTypeCode =
      selfqrDescriptionParams.receptionTypeCode;
    navigation.navigate("SelfqrScanner", {
      selfqrScannerParams,
    });
  };

  const handleSelectReceptionMethod = () => {
    const selectReceptionMethodParams = new SelectReceptionMethodParams();
    selectReceptionMethodParams.eventId = selfqrDescriptionParams.eventId;
    selectReceptionMethodParams.venueId = selfqrDescriptionParams.venueId;
    selectReceptionMethodParams.user.userId =
      selfqrDescriptionParams.user.userId;
    selectReceptionMethodParams.receptionTypeCode =
      selfqrDescriptionParams.receptionTypeCode;

    navigation.navigate("SelectReceptionMethod", {
      selectReceptionMethodParams,
    });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <Header
        titleName="自己QRで受付"
        buttonName="受付をやめる"
        onPress={handleSelectReceptionMethod}
      ></Header>
      <View style={styles.slideContainer}>
        <Onboarding
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          scrollToIndex={scrollToIndex}
          slides={slides}
        />
      </View>
      <View style={styles.dotView}>
        {slides.map(({ }, index: number) => (
          <Pressable
            key={index.toString()}
            style={[
              styles.circle,
              {
                backgroundColor:
                  index === currentIndex
                    ? colors.activeCarouselColor
                    : colors.gray,
              },
            ]}
            onPress={() => scrollToIndex(index)}
          />
        ))}
      </View>
      <Footer
        currentIndex={currentIndex}
        slides={slides}
        hasNextButton={true}
        onPressPrevious={scrollToPrevious}
        onPressNext={scrollToNext}
        onPress={handleReadButton}
      />
    </SafeAreaView>
  );
};
