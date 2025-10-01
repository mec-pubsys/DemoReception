export const typography = {
  headings: {
    HeadingXxLargeRegular: {
      size: 57,
      weight: "300",
      lineHeight: 80,
    },
    HeadingXLargeRegular: {
      size: 45,
      weight: "300",
      lineHeight: 63,
    },
    HeadingLargeBold: {
      size: 36,
      weight: "600",
      lineHeight: 50,
    },
    HeadingLargeRegular: {
      size: 36,
      weight: "300",
      lineHeight: 50,
    },
    HeadingMediumBold: {
      size: 32,
      weight: "600",
      lineHeight: 48,
    },
    HeadingMediumRegular: {
      size: 32,
      weight: "300",
      lineHeight: 48,
    },
    HeadingSmallBold: {
      size: 28,
      weight: "600",
      lineHeight: 42,
    },
    HeadingSmallRegular: {
      size: 28,
      weight: "300",
      lineHeight: 42,
    },
    HeadingXSmallBold: {
      size: 24,
      weight: "600",
      lineHeight: 36,
    },
    HeadingXSmallRegular: {
      size: 24,
      weight: "300",
      lineHeight: 36,
    },
    HeadingXxSmallBold: {
      size: 20,
      weight: "600",
      lineHeight: 30,
    },
    HeadingXxSmallRegular: {
      size: 20,
      weight: "300",
      lineHeight: 30,
    },
    HeadingXxxSmallBold: {
      size: 18,
      weight: "600",
      lineHeight: 27,
    },
    HeadingXxxxSmallBold: {
      size: 16,
      weight: "600",
      lineHeight: 24,
    },
    HeadingXxxxSmallRegular: {
      size: 16,
      weight: "300",
      lineHeight: 24,
    },
  },
  bodyText: {
    BodyTextXLarge: {
      size: 20,
      weight: "300",
      lineHeight: 27,
    },
    BodyTextLarge: {
      size: 16,
      weight: "300",
      lineHeight: 27,
    },
    BodyTextMedium: {
      size: 14,
      weight: "300",
      lineHeight: 24,
    },
    BodyTextSmall: {
      size: 12,
      weight: "300",
      lineHeight: 20,
    },
  },
  buttonTexts: {
    ButtonLargeBold: {
      size: 32,
      weight: "600",
      lineHeight: 48,
    },
    ButtonMediumBold: {
      size: 24,
      weight: "600",
      lineHeight: 36,
    },
    ButtonSmallBold: {
      size: 16,
      weight: "600",
      lineHeight: 24,
    },
    ButtonSmallRegular: {
      size: 16,
      weight: "300",
      lineHeight: 24,
    },
  },
  labels: {
    LabelLargeBold: {
      size: 16,
      weight: "600",
      lineHeight: 24,
    },
    LabelLargeRegular: {
      size: 16,
      weight: "300",
      lineHeight: 24,
    },
    LabelMediumBold: {
      size: 14,
      weight: "600",
      lineHeight: 21,
    },
    LabelMediumRegular: {
      size: 14,
      weight: "300",
      lineHeight: 21,
    },
    LabelSmallBold: {
      size: 12,
      weight: "600",
      lineHeight: 18,
    },
    LabelSmallRegular: {
      size: 12,
      weight: "300",
      lineHeight: 18,
    },
    LabelXSmallRegular: {
      size: 10,
      weight: "300",
      lineHeight: 15,
    },
  },
  links: {
    LinkLarge: {
      size: 16,
      weight: "300",
      lineHeight: 27,
    },
    LinkMedium: {
      size: 14,
      weight: "300",
      lineHeight: 24,
    },
  },
};

// Destructuring for direct access
export const {
  HeadingXxLargeRegular,
  HeadingXLargeRegular,
  HeadingLargeBold,
  HeadingLargeRegular,
  HeadingMediumBold,
  HeadingMediumRegular,
  HeadingSmallBold,
  HeadingSmallRegular,
  HeadingXSmallBold,
  HeadingXSmallRegular,
  HeadingXxSmallBold,
  HeadingXxSmallRegular,
  HeadingXxxSmallBold,
  HeadingXxxxSmallBold,
  HeadingXxxxSmallRegular,
} = typography.headings;

export const { BodyTextXLarge, BodyTextLarge, BodyTextMedium, BodyTextSmall } =
  typography.bodyText;

export const {
  ButtonLargeBold,
  ButtonMediumBold,
  ButtonSmallBold,
  ButtonSmallRegular,
} = typography.buttonTexts;

export const {
  LabelLargeBold,
  LabelLargeRegular,
  LabelMediumBold,
  LabelMediumRegular,
  LabelSmallBold,
  LabelSmallRegular,
  LabelXSmallRegular,
} = typography.labels;

export const { LinkLarge, LinkMedium } = typography.links;
