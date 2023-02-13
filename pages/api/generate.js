import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const data = req.body.data || "";

  if (
    data?.productNameInput.trim().length === 0 ||
    data?.productIndustryInput.trim().length === 0 ||
    data?.productDescriptionInput.trim().length === 0
  ) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      },
    });
    return;
  }

  let prompt = `Company Information
  Company Name: ${data.productNameInput}
  Industry: ${data.productIndustryInput}
  Description: ${data.productDescriptionInput}

  Prompt
  Design a unique and memorable logo that accurately represents the ${data.productNameInput} brand. The company operates in the ${data.productIndustryInput} industry and is described as ${data.productDescriptionInput}.  
  The logo should be easily recognizable and distinguishable from other logos in the same industry.  
  Make sure it remains simple and easy to reproduce in various formats. The final logo should be delivered in vector format, have some padding. The only text logo can include is ${data.productNameInput}`

  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
    });
    console.log(response.data.data[0]);
    const image_url = response.data.data[0].url;
    res.status(200).json({ image_url });
  } catch (error) {

    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
