// media helper, add needed sizes for devices into the object

const screenSizes = {
  desktop: "1024px",
  mobileL: "420px",
  tablet: "768px"
};

type StyleConverter = (style: TemplateStringsArray) => number;

interface MediaWrapper {
  desktop: StyleConverter;
  mobileL: StyleConverter;
  tablet: StyleConverter;
}

const mediaWrapper: MediaWrapper = Object.keys(screenSizes).reduce(
  (acc: MediaWrapper, screenSize: string): MediaWrapper => {
    acc[screenSize] = (style: TemplateStringsArray): string => `
    @media screen and (max-width: ${screenSizes[screenSize]}) {
      ${style};
    }
  `;
    return acc;
  },
  {} as MediaWrapper
);

export default mediaWrapper;
