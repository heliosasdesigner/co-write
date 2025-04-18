import axios from "axios";
import FormData from "form-data";
import Constants from "expo-constants";

const { STABILITY_API_KEY } = Constants.expoConfig?.extra || {};

if (!STABILITY_API_KEY) {
  throw new Error("STABILITY_API_KEY is not defined");
}

const payload = {
  prompt: "Lighthouse on a cliff overlooking the ocean",
  output_format: "jpeg",
};
const data = new FormData();
data.append(
  "image",
  fs.readFileSync("./assets/catforvideo.jpg"),
  "catforvideo.jpg"
);
data.append("seed", 0);
data.append("cfg_scale", 1.8);
data.append("motion_bucket_id", 127);

const response = await axios.request({
  url: `https://api.stability.ai/v2beta/image-to-video`,
  method: "post",
  validateStatus: undefined,
  headers: {
    authorization: `Bearer sk-MYAPIKEY`,
    ...data.getHeaders(),
  },
  data: data,
});

console.log("Generation ID:", response.data.id);
