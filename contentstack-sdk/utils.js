import { Region, Stack } from "contentstack";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const envConfig = process.env.CONTENTSTACK_API_KEY
  ? process.env
  : publicRuntimeConfig;
console.log("7 🚀 ~ envConfig:", envConfig)
const {
  CONTENTSTACK_API_KEY,
  CONTENTSTACK_DELIVERY_TOKEN,
  CONTENTSTACK_ENVIRONMENT,
  CONTENTSTACK_BRANCH,
  CONTENTSTACK_REGION,
  CONTENTSTACK_PREVIEW_TOKEN,
  CONTENTSTACK_PREVIEW_HOST,
  CONTENTSTACK_APP_HOST,
  CONTENTSTACK_LIVE_PREVIEW,
} = envConfig;

// basic env validation
export const isBasicConfigValid = () => {
  console.log("22 🚀 ~ isBasicConfigValid ~ CONTENTSTACK_API_KEY:", CONTENTSTACK_API_KEY)
  console.log("23 🚀 ~ isBasicConfigValid ~ CONTENTSTACK_DELIVERY_TOKEN:", CONTENTSTACK_DELIVERY_TOKEN)
  console.log("23 🚀 ~ isBasicConfigValid ~ CONTENTSTACK_ENVIRONMENT:", CONTENTSTACK_ENVIRONMENT)
  return (
    !!CONTENTSTACK_API_KEY &&
    !!CONTENTSTACK_DELIVERY_TOKEN &&
    !!CONTENTSTACK_ENVIRONMENT
  );
};
// Live preview config validation
export const isLpConfigValid = () => {
  return (
    !!CONTENTSTACK_LIVE_PREVIEW &&
    !!CONTENTSTACK_PREVIEW_TOKEN &&
    !!CONTENTSTACK_PREVIEW_HOST &&
    !!CONTENTSTACK_APP_HOST
  );
};
// set region
const setRegion = () => {
  let region = "US";
  if (!!CONTENTSTACK_REGION && CONTENTSTACK_REGION !== "us") {
    region = CONTENTSTACK_REGION.toLocaleUpperCase().replace(
      "-",
      "_"
    );
  }
  return Region[region];
};
// set LivePreview config
const setLivePreviewConfig = () => {
  if (!isLpConfigValid())
    throw new Error("Your LP config is set to true. Please make you have set all required LP config in .env");
  return {
    preview_token: CONTENTSTACK_PREVIEW_TOKEN,
    enable: CONTENTSTACK_LIVE_PREVIEW === "true",
    host: CONTENTSTACK_PREVIEW_HOST,
  };
};
// contentstack sdk initialization
export const initializeContentStackSdk = () => {
  console.log("60 🚀 ~ initializeContentStackSdk ~ isBasicConfigValid():", isBasicConfigValid())
  // if (isBasicConfigValid() === false)
  //   throw new Error("Please set you .env file before running starter app");
  const stackConfig = {
    api_key: CONTENTSTACK_API_KEY,
    delivery_token: CONTENTSTACK_DELIVERY_TOKEN,
    environment: CONTENTSTACK_ENVIRONMENT,
    region: setRegion(),
    branch: CONTENTSTACK_BRANCH || "main",
  };
  if (CONTENTSTACK_LIVE_PREVIEW === "true") {
    stackConfig.live_preview = setLivePreviewConfig();
  }
  return Stack(stackConfig);
};
// api host url
export const customHostUrl = (baseUrl) => {
  return baseUrl.replace("api", "cdn");
};
// generate prod api urls
export const generateUrlBasedOnRegion = () => {
  return Object.keys(Region).map((region) => {
    if (region === "US") {
      return `cdn.contentstack.io`;
    }
    return `${region}-cdn.contentstack.com`;
  });
};
// prod url validation for custom host
export const isValidCustomHostUrl = (url='') => {
  return url ? !generateUrlBasedOnRegion().includes(url) : false;
};
